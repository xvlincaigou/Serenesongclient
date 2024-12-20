<template>
  <view class="container">
    <view class="header">
      <text>来自 "{{ senderName }}" 的消息</text>
    </view>
    <scroll-view class="content" scroll-y="true">
      <view v-if="reversedGetMessage.length === 0">
        <text>没有与 "{{ senderName }}" 相关的消息</text>
      </view>
      <view v-else>
        <view 
          v-for="(message, index) in reversedGetMessage" 
          :key="index" 
          class="message-item" 
          @click="viewMessageDetail(message)"
        >
          <view class="friend-header">
            <text class="friend-name">
              来自：{{ message.senderName }}
            </text>
            <text class="message-time">\n {{ formatDate(message.time)}}</text> 
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
      senderName: '',
      getMessage: [],
      baseurl: getApp().globalData.baseURL,
      token: '',
    };
  },
  computed: {
    // 过滤出与 receiverName 相同的消息
	reversedGetMessage() {
	  if (!this.getMessage || this.getMessage.length === 0) {
	    return [];
	  }
	  const filteredMessages = this.getMessage.filter(message => message.senderName === this.senderName);
	  return filteredMessages.slice().reverse();
	},
  },
  onLoad(options) {
    this.senderName = decodeURIComponent(options.senderName);
    this.token = uni.getStorageSync('userToken');
    this.fetchGetMessage();
  },
  methods: {
    // 获取已发送的消息
    fetchGetMessage() {
      uni.request({
        url: `${this.baseurl}/getMessagesIGet`,
        method: 'GET',
        data: {
          token: this.token,
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.getMessage = res.data.messages;
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
.container { background-color: #f8f8f8; }
.header {
  padding: 16px;
  background-color: #e8e8e8;
  font-size: 20px;
  font-weight: bold;
}
.content {
  height: 100%;
}
.message-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.friend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.friend-name {
  font-size: 18px;
  font-weight: bold;
  color: #1b4965;
}
.message-time {
  font-size: 14px;
  color: #888888;
}
</style>
