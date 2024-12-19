<template>
  <view class="container">
	  
	<view class="title-header">
		<text class="receiver-title">收信人：{{ name }}</text>
    </view>

    <view class="message-box">
	  <text class="message-title">消息内容</text>
      <textarea v-model="messageContent" class="message" placeholder="请输入消息内容"></textarea>
    </view>
    
    <!-- 按钮容器 -->
    <view class="button-container">
      <button @click="sendMessage" class="bottom-btn">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
      name: '',
      user_id: '',
      messageContent: '',
      token: '',
    };
  },
  onLoad(options) {
    this.token = uni.getStorageSync('userToken');
	this.name = options.name;
	this.user_id = options.user_id;
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
	  console.log(this.messageContent);
	  
	  uni.request({
	      url: `${this.baseurl}/sendMessage`,
	      method: 'POST',
	      data: {
	        token: this.token,
	        receiver: this.user_id,
	        content: this.messageContent,
			replyToMessageId: "",
	      },
	      success: (res) => {
	        uni.showToast({
	          title: '消息已发送',
	          icon: 'success',
	        });
			console.log(res.data);
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
