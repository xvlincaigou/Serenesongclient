<!-- index.vue -->
<template>
  <view class="container">
    <!-- 好友列表 -->
    <scroll-view scroll-x="true" class="friend-list">
      <view class="friend-list-container">
		<view v-for="(friend, index) in friends" :key="index" class="friend-item">
		  <image :src="friend.avatar ? 'data:image/png;base64,' + friend.avatar : ''" class="friend-avatar" @click="viewFriend(friend)"></image>
		  <text class="friend-name">{{ friend.name }}</text>
		</view>
      </view>
    </scroll-view>

    <!-- 动态和作品的标签 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'allPost'}" @click="selectTab('allPost')">全部</text>
      <text :class="{active: selectedTab === 'friendPost'}" @click="selectTab('friendPost')">词友</text>
    </view>

    <!-- 根据选择的标签显示内容 -->
    <scroll-view v-if="selectedTab === 'allPost'" class="content" scroll-y="true">
		<view v-if="allPosts">
		  <view v-for="(post, index) in allPosts" :key="index">
		    <!-- Display post time outside of the post box -->
		    <!-- 发动态的人的头像和昵称 -->
		    <view class="post-header">
		      <image :src="post.icon ? 'data:image/png;base64,' + post.icon : ''" class="post-avatar" @click="viewFriendByIcon(post.author)"></image>
		      <view class="post-info">
		        <text class="post-nickname">{{ post.name }}</text>
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
		  <text>当前还没有人发动态</text>
		</view>
    </scroll-view>

    <!-- 词友动态 -->
    <scroll-view v-else class="content" scroll-y="true">
      <view v-if="friendPosts.length > 0">
        <view v-for="(post, index) in friendPosts" :key="index">
          <!-- Display post time outside of the post box -->
          <!-- 发动态的人的头像和昵称 -->
          <view class="post-header">
            <image :src="post.icon ? 'data:image/png;base64,' + post.icon : ''" class="post-avatar"></image>
            <view class="post-info">
              <text class="post-nickname">{{ post.name }}</text>
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
      <view v-else class="no-friendPosts">
        <text>当前还没有好友发动态</text>
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
	  token: "",
      selectedTab: 'allPost',  // 默认选择的标签
      friends: [],
      allPosts: [],
      friendPosts: [],
    };
  },
  onShow() {
    this.getUserID();
	this.getFriends();
	this.getAllDynamics(); // 获取动态列表
	this.getFriendDynamics();
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
		this.token = token;
	    uni.request({
	      url: `${this.baseurl}/getPersonalID`,
	      method: 'GET',
	      data: { token },
	      success: (res) => {
	        if (res.statusCode === 200 && res.data.personal_id) {
	          console.log('User ID:', res.data.personal_id);
	          this.user_id = res.data.personal_id;
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
      selectTab(tab) {
        this.selectedTab = tab;
      },
	  fetchUserInfo(user_id, targetArray) {
	    uni.request({
	      url: `${this.baseurl}/getUserInfo`,
	      method: 'GET',
	      data: {
	        token: this.token,
	        user_id: user_id,
	      },
	      success: (res) => {
	        if (res.statusCode === 200) {
	          if (res.data) {
	            // 将 user_id 添加到用户信息对象中
	            const friendWithId = { user_id: user_id, ...res.data };
	            targetArray.push(friendWithId);
	            this.$set(targetArray, targetArray.length - 1, friendWithId); // 确保响应式
	            console.log('friend:', targetArray);
	          }
	        } else {
	          uni.showToast({
	            title: '获取用户信息失败',
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
	  getFriends() {
		if (!this.token) {
		  this.token = uni.getStorageSync('userToken');
		}
		
		// 获取关注列表
		const subscribedTo = uni.getStorageSync('subscribedTo');
		console.log('关注列表:', subscribedTo);
		this.friends = [];
		
		// 如果关注列表为空或不是数组，则不做任何处理
		if (!Array.isArray(subscribedTo) || subscribedTo.length === 0) {
		  return;
		}
		
		subscribedTo.forEach(user_id => {
		  this.fetchUserInfo(user_id, this.friends);
		});
	  },
	  getAllDynamics() {
	    if (!this.token) {
	        this.token = uni.getStorageSync('userToken');
	    }
	    uni.request({
	        url: `${this.baseurl}/getRandomPosts`,
	        method: 'GET',
	        data: {
	            token: this.token,
	            value: '100',
	        },
	        success: (res) => {
	            if (res.statusCode === 200) {
	              this.allPosts = res.data.dynamics;
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
	  getFriendDynamics() {
	      // 获取用户 token，如果不存在则从本地存储中获取
	      if (!this.token) {
	          this.token = uni.getStorageSync('userToken');
	      }
	  
	      // 获取关注列表
	      const subscribedTo = uni.getStorageSync('subscribedTo');
		  this.friendPosts = [];
	  
	      // 如果关注列表为空或不是数组，则不做任何处理
	      if (subscribedTo.length === 0) {
	          return;
	      }
	  
	      // 遍历关注列表中的每个 user_id
	      subscribedTo.forEach(user_id => {
	          uni.request({
	              url: `${this.baseurl}/getFollowingPosts`,
	              method: 'GET',
	              data: {
	                  token: this.token,
	                  user_id: user_id,
	              },
	              success: (res) => {
					  console.log('id:', user_id);
	                  if (res.statusCode === 200) {
	                      // 将获取到的动态数据添加到 friendPosts 数组中
	                      if (res.data && res.data.dynamics) {
	                          this.friendPosts = this.friendPosts.concat(res.data.dynamics);
							  console.log('fP:', this.friendPosts);
	                      }
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
	      });
	  },
	  viewFriendByIcon(friend) {
		  if(friend === this.user_id) {
		  	uni.switchTab({
		  	  url: `/pages/user/index/index`
		  	});
		  } else {
		  	uni.navigateTo({
		  	  url: `/pages5_user/friendProfile/friendProfile?user_id=${friend}`
		  	});
		  }
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
      		  this.getAllDynamics();
			  this.getFriendDynamics();
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
      viewFriend(friend) {
        console.log('好友信息:', friend);
        if (friend.user_id) {
          if(friend.user_id === this.user_id) {
          	uni.switchTab({
          	  url: `/pages/user/index/index`
          	});
          } else {
          	uni.navigateTo({
          	  url: `/pages5_user/friendProfile/friendProfile?user_id=${friend.user_id}`
          	});
          }
        } else {
          uni.showToast({
            title: '用户ID不存在',
            icon: 'none',
          });
        }
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
	  },
	  refreshPost() {
		  console.log('refresh');
	  }
    }
  };
</script>

<style>
.liked {
  content: url('/static/community/icon_loved.png');
}

.not-liked {
  content: url('/static/community/icon_love.png');
}
.container {
  padding: 16px;
  position: relative;
}

.friend-list {
  overflow-x: auto;
  margin-bottom: 10px;
}

.friend-list-container {
  display: flex;
  flex-direction: row;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  margin-right: 16px;
}

.friend-avatar {
  width: 55px;
  height: 55px;
  border-radius: 30px;
}

.friend-name {
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
}

/* 标签样式 */
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

/* 内容样式 */
.content {
  max-height: 2000px;
  overflow-y: auto;
  padding: 0px;
  font-size: 10px;
}

/* 单个动态容器 */
.post-container {
  margin-bottom: 20px;
}

/* 发动态的人的信息 */
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

/* 动态内容样式 */
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
  border-bottom: 1px solid #555;
  color: #333;
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
/* 操作按钮样式 */
.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
}
.post-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
  margin-bottom: 20px;
  cursor: pointer;
}

/* 悬浮按钮样式 */
.floating-button {
  position: fixed;
  bottom: 60px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #fadbff;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.plus-icon {
  color: #fff;
  font-size: 36px;
}

/* 新增的提示信息样式 */
.no-dynamicPosts {
  padding: 12px;
  text-align: center;
  color: #999999;
}

.no-friendPosts {
  padding: 12px;
  text-align: center;
  color: #999999;
}
</style>
