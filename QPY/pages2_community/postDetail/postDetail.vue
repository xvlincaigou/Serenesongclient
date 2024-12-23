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
		  <view v-if="post.author != user_id">
			<button
			    class="follow-button" 
			    :class="{ 'following': isFollowed, 'unfollow': !isFollowed }"
			    @click="toggleFollow">
			    {{ isFollowed ? '取关' : '关注' }}
			</button>
		  </view>
        </view>
        <view class="post">
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
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container">
        <textarea v-model="commentText"
            class="comment-input"
            placeholder="请输入评论内容...">
        </textarea>
        <button class="send-button" @click="sendComment">↑</button>
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
		  <!-- 删除按钮（仅当前用户的评论显示） -->
		  <view class="comment-actions" v-if="comment.Comment.Commenter === user_id">
		    <button @click="deleteComment(comment)"class="delete-button">删除</button>
		  </view>
        </view>
        <!-- 评论内容 -->
        <view class="comment-content">
          <text>{{ comment.Comment.Content }}</text>
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
				if (!Array.isArray(this.comments)) {
				    this.comments = [];
				}
				this.comments.unshift(res.data.comment);
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
    
        // 调用API删除评论
        uni.request({
            url: `${this.baseurl}/withdrawComment`,
            method: 'POST',
            data: {
                token: this.token,
                comment_id: commentID,
            },
            success: (res) => {
                // 使用filter方法过滤掉要删除的评论，并更新this.comments
                this.comments = this.comments.filter(item => item.CommentId !== res.data.comment_id);
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
		if(subscribedTo === []) {
			this.isFollowed = false;
		}
		else {
			this.isFollowed = subscribedTo.includes(this.post.author);
		}
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
    width: 100%;
    padding: 20px; /* 控制容器内的左右间距，避免内容贴边 */
    box-sizing: border-box;
}

.post-detail{
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px; 
	margin-bottom: 10px; 
}

/* 发动态的人的信息 */
.post-header {
  padding: 0px 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd; 
  padding-bottom: 10px; 
  margin-bottom: 10px; 
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
  background-color: #fefcfa;
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
  border-bottom: 1px solid #a8a8a8;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}
.post-comment-content{
	font-size: 14px;
	color: #666;
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

/* 评论输入容器 */
.comment-input-container {
  display: flex;
  align-items: center;  /* 对齐按钮和输入框 */
  margin-top: 20px;
}

/* 评论输入框 */
.comment-input {
  flex: 1;
  height: 20px;  /* 固定高度 */
  overflow: hidden;  /* 不显示滚动条 */
  border: 1px solid #ccc;
  padding: 7px 12px;  /* 内边距 */
  font-size: 15px;
  border-radius: 6px;
  background-color: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.comment-input:focus {
  border-color: #3498db;  /* 聚焦时的边框颜色 */
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);  /* 聚焦时的阴影效果 */
  outline: none;  /* 去掉默认的输入框外框 */
}

/* 发送按钮 */
.send-button {
  width: 30px;
  height: 30px;
  background-color: #504e4c;  /* 按钮背景色 */
  color: white;
  padding: 0;
  margin-left: 10px;
  border: none;
  border-radius: 50%;  /* 圆形按钮 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #3b2d17;  /* 悬浮时的背景色 */
}

.send-button:active {
  background-color: #182f7a;  /* 按钮点击时的背景色 */
}


/* 评论列表 */
.comment-list {
    margin-top: 20px;
}

/* 单条评论 */
.comment-item {
  background-color: white; /* 白色背景 */
  padding: 5px;
}

/* 评论者信息 */
.comment-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%; /* 圆形头像 */
    object-fit: cover; /* 确保头像不变形 */
}

.comment-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.comment-nickname {
  font-size: 14px;
  font-weight: bold;
  color: #333; /* 深灰色 */
}

.comment-time {
  font-size: 12px;
  color: grey;
}

/* 评论内容 */
.comment-content {
  background-color: #ffffff; /* 背景色略浅 */
    padding: 12px;
    margin-top: 8px;
	border-bottom: 1px #adadad solid;
    font-size: 14px;
    color: #333; /* 深灰色 */
    line-height: 1.5;
}

/* 评论操作按钮 */
.comment-actions {
  right:40px;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

.delete-button {
  background-color: #bdbdbd; /* 红色背景 */
  color: white;
  border: none;
  margin-bottom: 10px;
  padding: 0px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #c0392b; /* 悬浮时颜色加深 */
}

/* 关注按钮样式 */
.follow-button {
  position: absolute;
  right: 25px;
  top: 25px;
  padding: 0px 20px;
  border-radius: 30px; /* 圆角按钮 */
  border: 0.1px solid  ;
  background-color: #3498db; /* 背景颜色 */
  color: white; /* 文字颜色 */
  font-size: 14px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease; 
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1); /* 阴影 */
}


.following {
  border-color: gray;
  color: gray;
  background-color: #ffffff; /* 已关注时背景色 */
}

.following:hover {
  background-color: #dcdcdc; /* 悬浮时背景色 */
}

.unfollow {
  border-color: #a2bbff;
  color: #a7c6ff;
  background-color: #ffffff; /* 取消关注时背景色 */
}

.unfollow:hover {
  background-color: #eefcff; /* 悬浮时背景色 */
}

</style>
