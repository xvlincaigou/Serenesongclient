<template>
  <view class="container">
    <!-- Profile Section -->
    <view class="section">
      <view class="avatar-wrapper">
        <image :src="avatar" class="avatar" />
      </view>
      <view class="stats">
        <view class="stat-item">
          <text class="stat-label">创作</text>
          <text class="stat-number">{{ creationCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">收藏</text>
          <text class="stat-number">{{ favoritesCount }}</text>
        </view>
      </view>
    </view>
    <view class="info">
      <text class="name">{{ name }}\n</text>
      <text class="signature">{{ signature }}\n</text>
	  <text class="id">{{ user_id }}</text>
    </view>
	
	<!-- 新增按钮行容器 -->
	<view class="button-row">
		<button class="send-message" @click="sendMessage()">发消息</button>
		<button
		  class="follow-button" 
		  :class="{ 'following': isFollowed, 'unfollow': !isFollowed }"
		  @click="toggleFollow">
		  {{ isFollowed ? '取关' : '关注' }}
		</button>
	</view>
    
	<!-- Tabs for 动态 and 作品 -->
    <view class="tabs">
      <text :class="{ active: selectedTab === 'dynamic' }" @click="selectTab('dynamic')">动态</text>
      <text :class="{ active: selectedTab === 'works' }" @click="selectTab('works')">代表作品</text>
    </view>

    <!-- Content Displayed Based on Tab Selection -->
    <scroll-view v-if="selectedTab === 'dynamic'" class="content" scroll-y="true">
      <view v-if="dynamicPosts">
        <view v-for="(post, index) in dynamicPosts" :key="index">
          <!-- Display post time outside of the post box -->
          <!-- 发动态的人的头像和昵称 -->
          <view class="post-header">
            <image :src="avatar" class="post-avatar"></image>
            <view class="post-info">
              <text class="post-nickname">{{ name }}</text>
              <view class="post-meta">
                <text class="post-category">{{ getCategory(post.Type) }}</text>
              </view>
            </view>
          </view>
          <!-- 动态内容 -->
          <view class="post" @click="viewPost(post)">
            <!-- 动态内容根据Type渲染 -->
            <view v-if="post.Type === 0">
              <text class="post-title">{{ post.Classic.cipai[0] }}\n</text>
              <text class="post-author">{{ post.Classic.author }}</text>
              <view class="post-content">
                <text v-for="(line, idx) in post.Classic.content" :key="idx">{{ line }}\n</text>
              </view>
            </view>
            <view v-else-if="post.Type === 1">
              <text class="post-title">{{ post.Modern.cipai[0] }} · {{ post.Modern.title }}</text>
              <view class="post-content">
                <text v-for="(line, idx) in post.Modern.content" :key="idx">{{ line }}\n</text>
              </view>
            </view>
            <view v-else-if="post.Type === 2">
              <text class="post-title">{{ post.CollectionCi.cipai[0] }}\n</text>
              <text class="post-author">{{ post.CollectionCi.author }}</text>
              <view class="post-content">
                <text v-for="(line, idx) in post.CollectionCi.content" :key="idx">{{ line }}\n</text>
              </view>
              <text class="post-comment">\n批注：\n{{ formatComment(post.Comment) }}</text>
            </view>
            <view v-else>
              <text class="post-content">{{ post.content }}</text>
            </view>
          </view>
          <!-- 动态操作按钮 -->
          <view class="post-actions">
            <button @click.stop="comment(post)">评论</button>
            <button
              @click.stop="love(post)"
              :style="{ backgroundColor: isLiked(post) ? 'red' : 'white', color: isLiked(post) ? 'white' : 'grey' }"
            >
              点赞
            </button>
          </view>
        </view>
      </view>
      <view v-else class="no-dynamicPosts">
        <text>他/她还没有发过动态</text>
      </view>
    </scroll-view>

    <scroll-view v-else class="content" scroll-y="true">
      <view class="UserWorks-list">
        <view v-if="publicUserWorks.length > 0">
          <view
            class="UserWorks-item"
            v-for="(work, index) in publicUserWorks"
            :key="index"
            @click="viewWork(work)"
          >
            <view class="UserWorks-header">
              <text class="UserWorks-title">
                {{ work.cipai[0] }} · {{ work.title }}
              </text>
              <text class="UserWorks-time">{{ formatDate(work.created_at) }}</text>
            </view>
          </view>
        </view>
        <view v-else class="no-UserWorks">
          <text>他/她没有公开的作品</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
	  personal_id: '',
      user_id: '',
      avatar: '',
      name: "",
      signature: "",
      favoritesCount: 0, // 收藏数量
      creationCount: 0,  // 创作数量
      isFollowed: false,
      selectedTab: 'dynamic', // 默认选择的标签
      token: "",
      userWorks: [],        // 用户所有作品
      dynamicPosts: []      // 动态列表
    };
  },
  computed: {
    // 计算公开的作品
    publicUserWorks() {
      return this.userWorks.filter(work => work.is_public);
    }
  },
  onShow() {
	this.getToken();
    this.getFavoritesCount(); // 获取收藏数量
    this.getWorksCount();     // 获取作品数量
    this.fetchResults();      // 获取所有作品
    // 注意：getDynamics 已在 getUserID 成功后调用
  },
  onLoad(options) {
	this.user_id = options.user_id;  
	this.checkFollowStatus();
  },
  methods: {
    getToken() {
      this.token = uni.getStorageSync('userToken');
	  this.personal_id = uni.getStorageSync('personal_id');
	  this.getUserInfo();
	  this.getDynamics();
    },

    getUserInfo() {
      const token = this.token || uni.getStorageSync('userToken');
      if (!token || !this.user_id) {
        return;
      }
      uni.request({
        url: `${this.baseurl}/getUserInfo`,
        method: 'GET',
        data: {
          user_id: this.user_id,
          token: token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            console.log('用户信息:', res.data);
            this.avatar = res.data.avatar ? 'data:image/png;base64,' + res.data.avatar : '';
            this.name = res.data.name || "";
            this.signature = res.data.signature || "";
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
        }
      });
    },
    navigateToWork() {
      uni.navigateTo({
        url: `/pages3_write/userWorkList/userWorkList`
      });
    },
    getFavoritesCount() {
      const token = uni.getStorageSync('userToken');
      if (token) {
        this.token = token;
        console.log('token:', token);
        uni.request({
          url: `${this.baseurl}/getCollections`,
          method: 'GET',
          data: { 
			token: this.token,
			user_id: this.user_id
		  },
          success: (res) => {
            if (res.data.collections && res.statusCode === 200) {
              this.favoritesCount = res.data.collections.length;
            }
          },
          fail: () => {
            uni.showToast({
              title: '请求失败',
              icon: 'none',
            });
          }
        });
      } else {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
      }
    },
    getWorksCount() {
      const token = this.token || uni.getStorageSync('userToken');
      if (token) {
        this.token = token;
        uni.request({
          url: `${this.baseurl}/getWorks`,
          method: 'GET',
          data: {
            token: this.token,
            user_id: this.user_id
          },
          success: (res) => {
			console.log('works:', res.data);
            if (res.statusCode === 200 && res.data.public_works) {
              console.log('作品:', res.data.public_works.length);
              this.creationCount = res.data.public_works.length;
            }
          },
          fail: () => {
            uni.showToast({
              title: '请求失败',
              icon: 'none',
            });
          }
        });
      } else {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
      }
    },
    fetchResults() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      const baseurl = this.baseurl;
      console.log('Fetching user works with token:', this.token);
      uni.request({
        url: `${this.baseurl}/getWorks`,
        method: 'GET',
        data: {
          token: this.token,
          user_id: this.user_id
        },
        success: (res) => {
          console.log('API response:', res.data);
          if (res.statusCode === 200 && res.data) {
            this.userWorks = res.data.public_works || [];
            console.log('获取到的所有作品:', this.userWorks);
          } else {
            console.error('API error:', res);
            uni.showToast({
              title: '获取作品失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
          });
        },
      });
    },
    getDynamics() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      if (!this.token || !this.user_id) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/getDynamics`,
        method: 'GET',
        data: {
          token: this.token,
          user_id: this.user_id
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 直接赋值动态列表，不再添加 liked 属性
            this.dynamicPosts = res.data.dynamics;
            console.log('获取到的动态列表:', this.dynamicPosts);
          } else {
            uni.showToast({
              title: '获取动态列表失败',
              icon: 'none',
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
        }
      });
    },
	// 检查是否已关注
	checkFollowStatus() {
	    const subscribedTo = uni.getStorageSync('subscribedTo') || [];
		console.log('first:', subscribedTo);
		if(subscribedTo === []) {
			this.isFollowed = false;
		}
		else {
			this.isFollowed = subscribedTo.includes(this.user_id);
		}
		console.log('isF?:', this.isFollowed);
	},
	// 切换关注状态
	toggleFollow() {
	    let subscribedTo = uni.getStorageSync('subscribedTo') || [];
	      
	    // 判断是关注还是取关
	    const isSubscribing = !this.isFollowed;
	      
	    // 调用API更新关注状态
	    uni.request({
	        url: `${this.baseurl}/subscribeOthers`,
	        method: 'POST',
	        data: {
	          token: this.token,
	          receiver: this.user_id,
	          subscribeOrCancel: isSubscribing,
	        },
	        success: (res) => {
	          if (isSubscribing) {
	            subscribedTo.push(this.user_id);  // 关注
	          } else {
	            subscribedTo = subscribedTo.filter(item => item !== this.user_id);  // 取关
	          }
	          uni.setStorageSync('subscribedTo', subscribedTo);  // 更新本地存储
			  console.log('now:', subscribedTo);
	          this.isFollowed = isSubscribing;  // 更新按钮显示
	          uni.showToast({
	            title: isSubscribing ? '已关注' : '已取关',
	            icon: 'success',
	          });
	        },
	        fail: () => {
	          uni.showToast({
	            title: '请求失败，请稍后重试',
	            icon: 'none',
	          });
	        },
	    });
	},
	sendMessage() {
	  uni.navigateTo({ url: `/pages4_dialog/sendMessage/sendMessage?name=${this.name}&user_id=${this.user_id}` });
	},
    selectTab(tab) {
      this.selectedTab = tab;
    },
    viewPost(post) {
      const params = `post=${encodeURIComponent(JSON.stringify(post))}`;
      uni.navigateTo({ url: `/pages2_community/postDetail/postDetail?${params}` });
    },
    comment(post) {
      const params = `post=${encodeURIComponent(JSON.stringify(post))}`;
      uni.navigateTo({ url: `/pages2_community/postDetail/postDetail?${params}` });
    },
    love(post) {
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }

      const isLikeAction = this.isLiked(post);
	  console.log('isLiked:', isLikeAction);
	  
      const apiUrl = isLikeAction ? `${this.baseurl}/withdrawLike` : `${this.baseurl}/likePost`;

      uni.request({
        url: apiUrl,
        method: 'POST',
        data: {
          token: this.token,
          post_id: post.ID
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 重新获取动态列表以更新点赞状态
			this.getDynamics();
            uni.showToast({
              title: !isLikeAction ? '点赞成功' : '取消点赞成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: !isLikeAction ? '点赞失败' : '取消点赞失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    },
    isLiked(post) {
      // 检查当前用户是否已点赞该动态
      return post.Likes.some(like => String(like) === String(this.personal_id));
    },
    viewWork(work) {
      uni.navigateTo({ 
        url: `/pages5_user/friendWork/friendWork?UserWork=${encodeURIComponent(JSON.stringify(work))}` 
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getCategory(type) {
      const categories = {
        0: '经典',
        1: '创作',
        2: '收藏'
      };
      return categories[type] || '其他';
    },
    formatComment(comment) {
      if (!comment) return '';
      // 将评论按每10个字符分割
      const regex = /.{1,10}/g;
      return comment.match(regex).join('\n');
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
  background-color: #ffffff;
  min-height: 100vh;
}

.section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar-wrapper {
  width: 100px;
  height: 100px;
  margin-right: 10px;
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: grey;
}
.info {
  margin-top: 10px;
}
.name {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}
.signature,
.id {
  font-size: 12px;
  margin-left: 10px;
  color: grey;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-left:60px;
  margin-right: 30px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  margin-left: 10px;
}
.stat-label {
  font-size: 14px;
  text-align: center;
}
.stat-number {
  font-size: 14px;
  text-align: center;
  margin-top: 4px;
}

/* 新增按钮行容器样式 */
.button-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 按钮之间均匀分布 */
  align-items: center; /* 垂直居中对齐 */
  margin-top: 10px;
  gap: 20px; /* 按钮之间的间距 */
  padding: 0 5px; /* 容器左右内边距，防止按钮靠边 */
}

/* 更新后的发送消息和关注按钮样式 */
.send-message,
.follow-button {
  flex: 1; /* 让按钮平分容器宽度 */
  padding: 3px 0; /* 增大按钮高度，增强触控体验 */
  font-size: 14px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid grey;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* 按钮悬停效果 */
.send-message:hover,
.follow-button:hover {
  background-color: #f0f0f0;
}

/* 按钮按下效果 */
.send-message:active,
.follow-button:active {
  background-color: #e0e0e0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
}

/* 关注按钮的不同状态 */
.follow-button.following {
  background-color: #fefefe; /* 已关注时背景色 */
  color: #333333;
  border-color: #a2a2a2;
}
.follow-button.unfollow {
  background-color: #ffffff; /* 未关注时背景色 */
  color: #333333;
  border-color: #a2bbff;
}
.follow-button.unfollow:hover {
  background-color: #eefcff; /* 悬浮时背景色 */
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
}
.tabs text {
  flex: 1;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: black;
}
.active {
  border-bottom: 2px solid black;
}

.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0px;
  margin-right: 50px;
  font-size: 14px;
}

/* Existing styles for dynamic posts */
.post-container {
  margin-bottom: 20px;
}
.post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
}
.post-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.post-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}
.post-nickname {
  font-size: 16px;
}
.post-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.post-category {
  font-size: 12px;
  color: grey;
  margin-right: 8px;
}
.post-time {
  font-size: 12px;
  color: grey;
}
.post {
  background-color: #f0f0f0;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
}
.post-title {
  font-size: 18px;
  font-weight: bold;
  word-break: break-word;
}
.post-author {
  font-size: 12px;
  color: grey;
  margin-top: 4px;
}
.post-name {
  font-size: 12px;
  color: grey;
  margin-top: 4px;
}
.post-content {
  font-size: 14px;
  color: grey;
  margin-top: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  max-width: 100%;
}
.post-comment {
  font-size: 14px;
  color: black;
  margin-top: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}
.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.post-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
  margin-bottom: 20px;
  cursor: pointer;
}

/* 新增的提示信息样式 */
.no-dynamicPosts {
  padding: 12px;
  text-align: center;
  color: #999999;
}

/* Existing styles for UserWorks */
.UserWorks-item {
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.UserWorks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.UserWorks-title {
  font-size: 18px;
  font-weight: bold;
  word-break: break-word;
}

.UserWorks-time {
  font-size: 14px;
  color: #888888;
}

.no-UserWorks {
  padding: 12px;
  text-align: center;
  color: #999999;
}

/* 按钮悬停效果 */
button:hover {
  background-color: #e0e0e0;
}


</style>
