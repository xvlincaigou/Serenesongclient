<template>
  <view class="container">
    <!-- Profile Section -->
    <view class="section">
      <view class="avatar-wrapper">
        <image :src="avatar" class="avatar" />
      </view>
      <view class="stats">
        <view class="stat-item" @click="navigateToWork()">
          <text class="stat-label">创作</text>
          <text class="stat-number">{{ creationCount }}</text>
        </view>
        <view class="stat-item" @click="navigateTo('favorites')">
          <text class="stat-label">收藏</text>
          <text class="stat-number">{{ favoritesCount }}</text>
        </view>
        <view class="stat-item" @click="navigateTo('friends')">
          <text class="stat-label">知音</text>
          <text class="stat-number">{{ friendsCount }}</text>
        </view>
      </view>
    </view>
    <view class="info">
      <text class="name">{{ name }}\n</text>
      <text class="signature">{{ signature }}\n</text>
	  <text class="id">id : {{ user_id }}</text>
    </view>

    <!-- Edit Profile Button -->
    <button class="edit-profile" @click="navigateTo('editProfile')">修改资料</button>

    <!-- Tabs for 动态 and 作品 -->
    <view class="tabs">
      <text :class="{ active: selectedTab === 'dynamic' }" @click="selectTab('dynamic')">流觞曲水</text>
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
              <text class="post-comment">\n批注\n</text>
			  <text class="post-comment-content">{{ formatComment(post.Comment) }}</text>
            </view>
            <view v-else>
              <text class="post-content">{{ post.content }}</text>
            </view>
          </view>
		  <!-- 动态操作按钮 -->
		  <view class="post-actions">
			<!-- 删除按钮，设置更小的尺寸 -->
			<image 
			  :src="'/static/community/icon_delete.png'" 
			  @click.stop="del(post)" 
			  alt="删除"
			  style="width: 21px; height: 21px; margin-right: 4px;" 
			/>
		    <!-- 评论按钮，设置更小的尺寸 -->
		    <image 
		      :src="'/static/community/icon_comment.png'" 
		      @click.stop="comment(post)" 
		      alt="评论"
		      style="width: 24px; height: 24px; margin-right: 4px;" 
		    />
		    <!-- 点赞按钮 -->
		    <image
		      :class="isLiked(post) ? 'liked' : 'not-liked'"
		      @click.stop="love(post)"
		      alt="点赞"
		      style="width: 24px; height: 24px; cursor: pointer;"
		    />
		  </view>
        </view>
      </view>
      <view v-else class="no-dynamicPosts">
        <text>暂无流觞</text>
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
          <text>暂无代表作，尝试去创作吧！</text>
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
      user_id: '',
      avatar: '',
      name: "",
      signature: "",
      favoritesCount: 0, // 收藏数量
      creationCount: 0,  // 创作数量
      friendsCount: 0,    // 词友数量
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
    this.getUserID();
    this.getFavoritesCount(); // 获取收藏数量
    this.getWorksCount();     // 获取作品数量
	this.getFriendsCount();   // 获取词友数量
    this.fetchResults();      // 获取所有作品
    // 注意：getDynamics 已在 getUserID 成功后调用
  },
  methods: {
    getUserID() {
      const token = uni.getStorageSync('userToken');
      if (!token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/getPersonalID`,
        method: 'GET',
        data: { token },
        success: (res) => {
          if (res.statusCode === 200 && res.data.personal_id) {
            this.user_id = res.data.personal_id;
            this.getUserInfo();
            this.getDynamics(); // 获取动态列表
          } else {
            uni.showToast({
              title: '获取用户ID失败',
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
    navigateTo(page) {
      uni.navigateTo({ url: `/pages5_user/${page}/${page}` });
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
        uni.request({
          url: `${this.baseurl}/getCollectionItemCount`,
          method: 'GET',
          data: { token: this.token },
          success: (res) => {
            if (res.statusCode === 200) {
              this.favoritesCount = res.data.count;
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
          url: `${this.baseurl}/getMyWorks`,
          method: 'GET',
          data: {
            token: this.token,
            kind: 'UserWorks'
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.UserWorks) {
              this.creationCount = res.data.UserWorks.length;
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
	getFriendsCount() {
	  const token = this.token || uni.getStorageSync('userToken');
	  const subscribedTo = uni.getStorageSync('subscribedTo');
	  this.friendsCount = subscribedTo.length;
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
      uni.request({
        url: `${baseurl}/getMyWorks`,
        method: 'GET',
        data: {
          token: this.token,
          kind: 'UserWorks'
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.userWorks = res.data.UserWorks || [];
          } else {
            uni.showToast({
              title: '获取作品失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
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
    selectTab(tab) {
      this.selectedTab = tab;
    },
    viewPost(post) {
      const params = `post=${encodeURIComponent(JSON.stringify(post))}`;
      uni.navigateTo({ url: `/pages2_community/postDetail/postDetail?${params}` });
    },
    del(post) {
      uni.showModal({
        title: '确认删除',
        content: '您确定要删除这条动态吗？',
        success: (res) => {
          if (res.confirm) {
            uni.request({
              url: `${this.baseurl}/withdrawPost`,
              method: 'POST',
              data: {
                token: this.token,
                post_id: post.ID
              },
              success: (response) => {
                if (response.statusCode === 200) {
                  uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                  });
                  // 重新获取动态列表
                  this.getDynamics();
                } else {
                  uni.showToast({
                    title: '删除失败',
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
          }
        }
      });
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
      return post.Likes.some(like => String(like) === String(this.user_id));
    },
    viewWork(work) {
      uni.navigateTo({ 
        url: `/pages3_write/userWorkDetail/userWorkDetail?UserWork=${encodeURIComponent(JSON.stringify(work))}` 
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
.liked {
  content: url('/static/community/icon_loved.png');
}

.not-liked {
  content: url('/static/community/icon_love.png');
}
.container {
  padding: 16px;
  min-height: 100vh;
  background-color: #ffffff;
}

/* Existing styles for profile, stats, etc. */

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
  margin-left: 30px;
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

.edit-profile {
  width: 100%;
  margin: 12px 0;
  padding: 0px 0;
  font-size: 14px;
  background-color: white;
  color: black;
  border: 1px solid grey;
  border-radius: 4px;
  text-align: center;
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
  background-color: #f2f2f2;
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
  color: #667;
  margin-top: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  max-width: 100%;
}
.post-comment {
  font-size: 14px;
  color: #333;
  border-bottom: #667 1px solid;
  margin-top: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}
.post-comment-content{
	font-size: 14px;
	color: #333;
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
  background: linear-gradient(145deg, #eaeaea, #fafafa);
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
