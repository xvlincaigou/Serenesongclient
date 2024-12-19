<!-- postDetail.vue -->
<template>
  <view class="container">
    <view class="post-detail">
        <!-- 显示动态的详细信息 -->
        <view class="post-header">
          <image :src="post.icon ? 'data:image/png;base64,' + post.icon : ''" class="post-avatar" @click="viewFriend(post.author)"></image>
          <view class="post-info">
            <text class="post-nickname">{{ post.name }}</text>
            <view class="post-meta">
              <text class="post-category">{{ getCategory(post.Type) }}</text>
            </view>
          </view>
		  <!-- 关注按钮 -->
		  <button 
		    class="follow-button" 
		    :class="{ 'following': isFollowed, 'unfollow': !isFollowed }"
		    @click="toggleFollow">
		    {{ isFollowed ? '取关' : '关注' }}
		  </button>
        </view>
        <view class="post-content">
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
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container">
        <textarea v-model="commentText"
            class="comment-input"
            placeholder="请输入评论内容...">
        </textarea>
        <button class="send-button" @click="sendComment">发送</button>
    </view>

    <!-- 评论列表 -->
    <view class="comment-list">
      <view v-for="(comment, index) in comments" :key="index" class="comment-item">
        <!-- 评论者的头像和昵称 -->
        <view class="comment-header">
          <image :src="comment.Avatar ? 'data:image/png;base64,' + comment.Avatar : ''" class="comment-avatar"></image>
          <view class="comment-info">
            <text class="comment-nickname">{{ comment.Name }}</text>
          </view>
        </view>
        <!-- 评论内容 -->
        <view class="comment-content">
          <text>{{ comment.Comment.Content }}</text>
        </view>

        <!-- 删除按钮（仅当前用户的评论显示） -->
        <view class="comment-actions" v-if="comment.Comment.Commenter === user_id">
          <button @click="deleteComment(comment)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  baseurl: getApp().globalData.baseURL,
      post: null,
      user_id: '',
      token: '',
      commentText: '',
      commentInputHeight: 20,
      commentInputOverflow: 'hidden',
      comments: [],
	  isFollowed: false,
    };
  },
  onShow() {
	  this.fetchComments(); 
	  this.checkFollowStatus();
  },
  onLoad(options) {
    if (options.post) {
        this.post = JSON.parse(decodeURIComponent(options.post));
		console.log(this.post);
    }
	const token = uni.getStorageSync('userToken');
	if (!token) {
	  uni.showToast({
	    title: '请先登录',
	    icon: 'none',
	  });
	  return;
	}
	this.token = token;
	this.user_id = uni.getStorageSync('personal_id');
	this.checkFollowStatus();
	this.fetchComments();
  },
  methods: {
	viewFriend(friend) {
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
        const regex = /.{1,10}/g;
        return comment.match(regex).join('\n');
    },
    sendComment() {
        if (this.commentText.trim() === '') {
            uni.showToast({
              title: '评论内容不能为空',
              icon: 'none',
            });
            return;
        }
    
        // 调用API发送评论
        uni.request({
            url: `${this.baseurl}/commentPost`,
            method: 'POST',
            data: {
              token: this.token,
              post_id: this.post.ID,
              content: this.commentText,
            },
            success: (res) => {
				// console.log(this.token);
				// console.log(this.post.ID);
				// console.log(this.commentText);
				// console.log(res.data);
				if (!Array.isArray(this.comments)) {
				    this.comments = [];
				}
				this.comments.unshift(res.data.comment);
				// console.log(this.comments);
				this.commentText = '';  // 清空评论输入框
				this.commentInputHeight = 20;  // 重置输入框高度
            },
            fail: () => {
              uni.showToast({
                title: '请求失败，请稍后重试',
                icon: 'none',
              });
            },
        });
    },
    deleteComment(comment) {
        const commentID = comment.CommentId;
        console.log(`删除的评论ID: ${commentID}`);
    
        // 调用API删除评论
        uni.request({
            url: `${this.baseurl}/withdrawComment`,
            method: 'POST',
            data: {
                token: this.token,
                comment_id: commentID,
            },
            success: (res) => {
                console.log('API响应数据:', res.data);
                // 使用filter方法过滤掉要删除的评论，并更新this.comments
                this.comments = this.comments.filter(item => item.CommentId !== res.data.comment_id);
                console.log('更新后的评论列表:', this.comments);
                uni.showToast({
                    title: '评论删除成功',
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

    fetchComments() {
        this.comments = this.post.Comments;
    },
	// 检查是否已关注
	checkFollowStatus() {
	    const subscribedTo = uni.getStorageSync('subscribedTo') || [];
		console.log('first:', subscribedTo);
		if(subscribedTo === []) {
			this.isFollowed = false;
		}
		else {
			this.isFollowed = subscribedTo.includes(this.post.author);
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
	          receiver: this.post.author,
	          subscribeOrCancel: isSubscribing,
	        },
	        success: (res) => {
	          if (isSubscribing) {
	            subscribedTo.push(this.post.author);  // 关注
	          } else {
	            subscribedTo = subscribedTo.filter(item => item !== this.post.author);  // 取关
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
  },
};
</script>

<style>
.container {
  padding: 20px;
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
  color: black;
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
}
.post-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
  margin-bottom: 20px;
  cursor: pointer;
}

/* 评论输入框 */
.comment-input-container {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
}

.comment-input {
  flex: 1;
  min-height: 20px;
  max-height: 20px;
  overflow-y: hidden;
  border: 1px solid #ccc;
  padding: 4px;
  font-size: 14px;
  border-radius: 4px;
  resize: none;
}

.send-button {
  width: 30px;
  height: 30px;
  background-color: green;
  color: white;
  padding: 0;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
}

/* 评论列表 */
.comment-list {
  margin-top: 20px;
}

/* 单条评论 */
.comment-item {
  margin-bottom: 20px;
}

/* 评论者信息 */
.comment-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comment-avatar {
  width: 30px;
  height: 30px;
  border-radius: 15px;
}

.comment-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.comment-nickname {
  font-size: 12px;
}

.comment-time {
  font-size: 12px;
  color: grey;
}

/* 评论内容 */
.comment-content {
  background-color: #f0f0f0;
  padding: 16px;
  margin-top: 8px;
  border-radius: 8px;
}

/* 评论操作按钮 */
.comment-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

.comment-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
  margin-right: 10px;
}

/* 回复输入框 */
.reply-input-container {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
}

.reply-input {
  flex: 1;
  min-height: 20px;
  max-height: 140px;
  overflow-y: hidden;
  border: 1px solid #ccc;
  padding: 4px;
  font-size: 14px;
  border-radius: 4px;
  resize: none;
}

.reply-input + .send-button {
  margin-left: 10px;
}

/* 回复列表 */
.replies-list {
  margin-left: 20px;
  margin-top: 10px;
}

/* 单条回复 */
.reply-item {
  margin-bottom: 15px;
}

/* 引用框 */
.quote-box {
  background-color: #e8e8e8;
  padding: 8px;
  border-left: 3px solid #ccc;
  margin-bottom: 6px;
}

.quote-text {
  font-size: 12px;
  color: #666;
}

/* 回复者信息 */
.reply-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.reply-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.reply-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.reply-nickname {
  font-size: 14px;
}

.reply-time {
  font-size: 12px;
  color: grey;
}

/* 回复内容 */
.reply-content {
  background-color: #f0f0f0;
  padding: 12px;
  margin-top: 6px;
  border-radius: 8px;
}

/* 回复操作按钮 */
.reply-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}

.reply-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
  margin-right: 10px;
}

/* 关注按钮样式 */
.follow-button {
  border-right: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid;
  background-color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.following {
  border-color: gray;
  color: gray;
}

.unfollow {
  border-color: red;
  color: red;
}
</style>
