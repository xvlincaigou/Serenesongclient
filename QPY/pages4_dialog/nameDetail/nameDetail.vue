<template>
  <view class="container">
    <view class="header">
      <text >发给 "{{ receiverName }}" 的消息</text>
    </view>
    <scroll-view class="content" scroll-y="true">
      <view v-if="reversedSendMessage.length === 0">
        <text>没有与 "{{ receiverName }}" 相关的消息</text>
      </view>
      <view v-else>
        <view 
          v-for="(message, index) in reversedSendMessage" 
          :key="index" 
          class="message-item" 
          @click="viewMessageDetail(message)"
        >
          <view class="friend-header">
            <text class="friend-name">
              {{ message.replyTo === '000000000000000000000000' ? '发给：' : '回复：' }}{{ message.receiverName }}
            </text>
            <text class="message-time"> {{ formatDate(message.time)}}</text> 
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      receiverName: '',
      sendMessage: [],
      baseurl: getApp().globalData.baseURL,
      token: '',
    };
  },
  computed: {
    // 过滤出与 receiverName 相同的消息
	reversedSendMessage() {
	  if (!this.sendMessage || this.sendMessage.length === 0) {
	    return [];
	  }
	  const filteredMessages = this.sendMessage.filter(message => message.receiverName === this.receiverName);
	  return filteredMessages.slice().reverse();
	},
  },
  onLoad(options) {
    this.receiverName = decodeURIComponent(options.receiverName);
    this.token = uni.getStorageSync('userToken');
    this.fetchSendMessage();
  },
  methods: {
    // 获取已发送的消息
    fetchSendMessage() {
      uni.request({
        url: `${this.baseurl}/getMessagesISend`,
        method: 'GET',
        data: {
          token: this.token,
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.sendMessage = res.data.messages;
          } else {
            uni.showToast({
              title: '获取信息失败',
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
    // 查看消息详情
    viewMessageDetail(message) {
      uni.navigateTo({
        url: `/pages4_dialog/messageDetail/messageDetail?message=${encodeURIComponent(JSON.stringify(message))}`
      });
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  }
};
</script>

<style scoped>
.container { background-color: #ffffff;}
.header {
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px #999 solid;
}
.header text{
	margin-left: 8px;
	font-size: 15px;
	color: #666;
	font-weight: bold;
}
.content { 
  min-height: 500px;
  max-height: 1000px;
  overflow-y: auto;
  padding: 0px;
  margin-right: 50px;
  margin-top: 20px;
  font-size: 14px;
}
.message-item {
  padding: 16px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background: linear-gradient(145deg, #eaeaea, #fafafa);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.friend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friend-name {
  font-size: 18px;
  font-weight: bold;
  color: #112f41;
}

.message-time {
  font-size: 14px;
  margin-top: 10px;
  color: #888888;
}
</style>
