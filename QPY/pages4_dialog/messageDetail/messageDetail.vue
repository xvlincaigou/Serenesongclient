<template>
  <view class="container">
	  
	<view class="title-header">
		<text class="receiver-title">收信人：{{ message.receiverName }}</text>
		<text class="time">\n {{ formatDate(message.time) }}</text>
    </view>
	<view v-if="message.replyTo != '000000000000000000000000'">
	  <view class="message-box">
	    <text class="message-title">回复消息内容：</text>
	    <text class="message">\n{{ messageReturn }}</text>
	  </view>
	</view>

    <view class="message-box">
	  <text class="message-title">消息内容：</text>
      <text class="message">\n{{ message.content }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
      token: '',
	  message: [],
	  messageContent: '',
	  messageReturn: '',
    };
  },
  onLoad(options) {
    this.token = uni.getStorageSync('userToken');
	this.message = JSON.parse(decodeURIComponent(options.message));
  },
  onShow() {
	this.findMessage();
  },
  methods: {  
    sendMessage() {
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
	  
	  if (!this.messageContent) {
	  	return; // 如果搜索框为空，不发送请求
	  }
	  
	  uni.request({
	      url: `${this.baseurl}/sendMessage`,
	      method: 'POST',
	      data: {
	        token: this.token,
	        receiver: this.message.receiver,
	        content: this.messageContent,
			replyToMessageId: "",
	      },
	      success: (res) => {
	        uni.showToast({
	          title: '消息已发送',
	          icon: 'success',
	        });
			setTimeout(() => {
			  uni.switchTab({
			    url: `/pages/dialog/index/index`
			  });
			}, 500);
	      },
	      fail: () => {
	        uni.showToast({
	          title: '请求失败，请稍后重试',
	          icon: 'none',
	        });
	      },
	  });
    },
	findMessage() {
		if (this.message.replyTo === '000000000000000000000000') {
			return;
		}
		uni.request({
		    url: `${this.baseurl}/getMessageById`,
		    method: 'GET',
			data: {
				messageId: this.message.replyTo,
			},
		    success: (res) => {
			  this.messageReturn = res.data.content;
		    },
		    fail: () => {
		      uni.showToast({
		        title: '请求失败，请稍后重试',
		        icon: 'none',
		      });
		    },
		});
	},
	formatDate(dateString) {
	    const date = new Date(dateString);
	    const year = date.getFullYear();
	    const month = String(date.getMonth() + 1).padStart(2, '0');
	    const day = String(date.getDate()).padStart(2, '0');
	    return `${year}-${month}-${day}`;
	},
  },
};
</script>

<style>
.container { padding: 20px; }
.title-header {
	width: 90%;
	text-align: left;
	padding: 20px;
	background-color: #ffffff;
	border-radius: 10px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
}
.receiver-title { 
	font-size: 24px;
    color: #333;
	font-weight: 600; 
}
.time {
	font-size: 17px;
	color: #aaa;
}

.message-box {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.message-title {
	font-size: 18px;
	line-height: 3.0;
	font-weight: bold; 
}
.message {
  font-size: 16px; /* 较小字体 */
  color: #444;
  width: 100%;
  height: 100px;
  line-height: 1.5;
  border: none;
  resize: none;
  overflow-y: auto; /* 使文本域可上下滚动 */
}

.bottom-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.bottom-btn {
  width: 100%;
  padding: 6px 0;
  margin-left: 10px;
  margin-right: 10px;
  background: linear-gradient(145deg, #ffffff, #efefef);
  border: none;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  color: #333;
  box-shadow: 2px 2px 8px rgba(107, 107, 107, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.bottom-btn:hover {
  background: linear-gradient(145deg, #e0e0e0, #f8f8f8);
  transform: translateY(-3px);
  box-shadow: 2px 6px 15px rgba(0, 0, 0, 0.15);
}

.bottom-btn:active {
  transform: translateY(1px);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.bottom-btn:focus {
  outline: none;
}
</style>
