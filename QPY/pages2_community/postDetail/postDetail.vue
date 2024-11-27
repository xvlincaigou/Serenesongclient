<!-- postDetail.vue -->
<template>
  <view class="container">
    <!-- 发动态的人的头像和昵称 -->
    <view class="pd-post-header">
      <image :src="avatar" class="pd-post-avatar"></image>
      <view class="pd-post-info">
        <text class="pd-post-nickname">{{ nickname }}</text>
        <view class="pd-post-meta">
          <text class="pd-post-category">{{ category }}</text>
          <text class="pd-post-time">{{ postDate }}</text>
        </view>
      </view>
    </view>
    <!-- 动态内容 -->
    <view class="pd-post">
      <!-- 动态标题和内容 -->
      <view v-if="postTitle">
        <text class="pd-post-title">{{ postTitle }}\n\n</text>
      </view>
      <!-- 使用 detail 内容替换原内容 -->
      <text class="pd-post-content">{{ detailContent }}</text>
    </view>
    <!-- 如果 content 不为空并且 detail 不为空，则显示原始内容 -->
    <view v-if="detailContent !== postContent && postContent" class="pd-post original-content">
      <text class="pd-post-content">{{ postContent }}</text>
    </view>
    <!-- 操作按钮 -->
    <view class="pd-post-actions">
      <button @click="share">分享 1788</button>
      <button @click="comment">评论 5000+</button>
      <button @click="love" :style="{backgroundColor: liked ? 'red' : 'white', color: liked ? 'white' : 'grey'}">点赞 1w+</button>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input-container">
        <textarea v-model="commentText"
                class="comment-input"
                placeholder="请输入评论内容..."
                @input="adjustInputHeight($event, 'comment')"
                :style="{ height: commentInputHeight + 'px', overflowY: commentInputOverflow }"></textarea>
        <button class="send-button" @click="sendComment">发送</button>
    </view>

    <!-- 评论列表 -->
    <view class="comment-list">
      <view v-for="(comment, index) in comments" :key="index" class="comment-item">
        <!-- 评论者的头像和昵称 -->
        <view class="comment-header">
          <image :src="comment.avatar" class="comment-avatar"></image>
          <view class="comment-info">
            <text class="comment-nickname">{{ comment.nickname }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
        </view>
        <!-- 评论内容 -->
        <view class="comment-content">
          <text>{{ comment.content }}</text>
        </view>
        <!-- 操作按钮 -->
        <view class="comment-actions">
          <button @click="shareComment(comment)">分享</button>
          <button @click="likeComment(comment)" :style="{backgroundColor: comment.liked ? 'red' : 'white', color: comment.liked ? 'white' : 'grey'}">点赞</button>
          <button @click="replyComment(comment)">回复</button>
        </view>

        <!-- 回复输入框 -->
        <view v-if="comment.showReplyInput" class="reply-input-container">
          <textarea v-model="comment.replyText"
                    class="reply-input"
                    placeholder="请输入回复内容..."
                    @input="adjustInputHeight($event, comment)"
                    :style="{ height: comment.replyInputHeight + 'px' }"></textarea>
          <button class="send-button" @click="sendReply(comment)">发送</button>
        </view>

        <!-- 回复列表 -->
        <view v-if="comment.replies && comment.replies.length" class="replies-list">
          <view v-for="(reply, rIndex) in comment.replies" :key="rIndex" class="reply-item">
            <!-- 回复者的头像和昵称 -->
            <view class="reply-header">
              <image :src="reply.avatar" class="reply-avatar"></image>
              <view class="reply-info">
                <text class="reply-nickname">{{ reply.nickname }}</text>
                <text class="reply-time">{{ reply.time }}</text>
              </view>
            </view>
            <!-- 回复内容 -->
            <view class="reply-content">
              <text>{{ reply.content }}</text>
            </view>
			<!-- 引用回复 -->
			<view v-if="reply.quoteContent" class="quote-box">
			  <text class="quote-text">{{ reply.quoteNickname }}: {{ reply.quoteContent }}</text>
			</view>
            <!-- 操作按钮 -->
            <view class="reply-actions">
              <button @click="shareReply(reply)">分享</button>
              <button @click="likeReply(reply)" :style="{backgroundColor: reply.liked ? 'red' : 'white', color: reply.liked ? 'white' : 'grey'}">点赞</button>
              <button @click="replyToReply(comment, reply)">回复</button>
            </view>

            <!-- 回复输入框 -->
            <view v-if="reply.showReplyInput" class="reply-input-container">
              <textarea v-model="reply.replyText"
                        class="reply-input"
                        placeholder="请输入回复内容..."
                        @input="adjustInputHeight($event, reply)"
                        :style="{ height: reply.replyInputHeight + 'px', overflowY: reply.replyInputOverflow }"></textarea>
              <button class="send-button" @click="sendReplyToReply(comment, reply)">发送</button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postTitle: '',
      postDate: '',
      postContent: '',
      avatar: '',
      nickname: '',
      category: '',
      detail: '',
      detailContent: '',
      liked: false,
      commentText: '',
      commentInputHeight: 20,
      commentInputOverflow: 'hidden',
      comments: [],
    };
  },
  onLoad(options) {
    this.postTitle = decodeURIComponent(options.title);
    this.postDate = options.date;
    this.postContent = decodeURIComponent(options.content);
    this.avatar = decodeURIComponent(options.avatar);
    this.nickname = decodeURIComponent(options.nickname);
    this.category = decodeURIComponent(options.category);
    this.detail = decodeURIComponent(options.detail);
    // 如果 detail 不为空，则使用 detail 内容替换原内容
    if (this.detail) {
      this.detailContent = this.detail;
    } else {
      this.detailContent = this.postContent;
    }
  },
  methods: {
    share() {
      uni.showToast({
        title: '分享逻辑',
        icon: 'none',
        duration: 3000
      });
    },
    comment() {
      // 评论逻辑
    },
    love() {
      this.liked = !this.liked;
    },
    adjustInputHeight(event, item) {
      const textarea = event.target;
      const lineHeight = 20;
      const maxHeight = 140;
      const minHeight = 20;
    
      textarea.style.height = 'auto';
      let newHeight = textarea.scrollHeight;
      newHeight = Math.ceil(newHeight / lineHeight) * lineHeight;
    
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
      } else if (newHeight < minHeight) {
        newHeight = minHeight;
      }
    
      if (item === 'comment') {
        this.commentInputHeight = newHeight;
        this.commentInputOverflow = newHeight >= maxHeight ? 'auto' : 'hidden';
      } else {
        this.$set(item, 'replyInputHeight', newHeight);
        this.$set(item, 'replyInputOverflow', newHeight >= maxHeight ? 'auto' : 'hidden');
      }
    },
    sendComment() {
      if (this.commentText.trim() === '') {
        uni.showToast({
          title: '评论内容不能为空',
          icon: 'none'
        });
        return;
      }
      const newComment = {
        avatar: '/static/dialog/avatar0.png', // 这里使用默认头像，实际项目中应使用当前用户的头像
        nickname: '我', // 当前用户昵称
        time: this.getCurrentTime(),
        content: this.commentText,
        liked: false,
        showReplyInput: false,
        replyText: '',
        replyInputHeight: 20,
        replies: [],
      };
      this.comments.unshift(newComment);
      this.commentText = '';
      this.commentInputHeight = 20; // 重置高度
    },
    shareComment(comment) {
      uni.showToast({
        title: '分享逻辑',
        icon: 'none',
        duration: 3000
      });
    },
    likeComment(comment) {
      comment.liked = !comment.liked;
    },
    replyComment(comment) {
      comment.showReplyInput = !comment.showReplyInput;
      if (comment.showReplyInput) {
        comment.replyInputHeight = 20; // 初始化高度
      }
    },
    sendReply(comment) {
      if (comment.replyText.trim() === '') {
        uni.showToast({
          title: '回复内容不能为空',
          icon: 'none'
        });
        return;
      }
      const newReply = {
        avatar: '/static/dialog/avatar0.png',
        nickname: '我',
        time: this.getCurrentTime(),
        content: comment.replyText,
        liked: false,
        showReplyInput: false,
        replyText: '',
        replyInputHeight: 20,
        quoteNickname: comment.nickname,
        quoteContent: comment.content,
      };
      if (!comment.replies) {
        comment.replies = [];
      }
      comment.replies.push(newReply);
      comment.replyText = '';
      comment.replyInputHeight = 20; // 重置高度
      comment.showReplyInput = false;
    },
    shareReply(reply) {
      uni.showToast({
        title: '分享逻辑',
        icon: 'none',
        duration: 3000
      });
    },
    likeReply(reply) {
      reply.liked = !reply.liked;
    },
    replyToReply(comment, reply) {
      reply.showReplyInput = !reply.showReplyInput;
      if (reply.showReplyInput) {
        reply.replyInputHeight = 20; // 初始化高度
      }
    },
    sendReplyToReply(comment, reply) {
      if (reply.replyText.trim() === '') {
        uni.showToast({
          title: '回复内容不能为空',
          icon: 'none'
        });
        return;
      }
      const newReply = {
        avatar: '/static/dialog/avatar0.png',
        nickname: '我',
        time: this.getCurrentTime(),
        content: reply.replyText,
        liked: false,
        showReplyInput: false,
        replyText: '',
        replyInputHeight: 20,
        quoteNickname: reply.nickname,
        quoteContent: reply.content,
      };
      comment.replies.push(newReply);
      reply.replyText = '';
      reply.replyInputHeight = 20;
      reply.showReplyInput = false;
    },
    getCurrentTime() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
}
/* 发动态的人的信息 */
.pd-post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
}

.pd-post-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.pd-post-info {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.pd-post-nickname {
  font-size: 20px;
}

.pd-post-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.pd-post-category {
  font-size: 14px;
  color: grey;
  margin-right: 12px;
}

.pd-post-time {
  font-size: 14px;
  color: grey;
}

/* 动态内容样式 */
.pd-post {
  background-color: #f0f0f0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.pd-post-title {
  font-size: 20px;
  font-weight: bold;
  word-break: break-word;
}

.pd-post-content {
  font-size: 16px;
  color: grey;
  margin-top: 6px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  max-width: 100%;
}

/* 原始内容样式 */
.original-content {
  background-color: #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
}

/* 操作按钮样式 */
.pd-post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.pd-post-actions button {
  font-size: 14px;
  color: grey;
  background-color: white;
  border: none;
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
  max-height: 140px;
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
  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.comment-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.comment-nickname {
  font-size: 16px;
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
</style>
