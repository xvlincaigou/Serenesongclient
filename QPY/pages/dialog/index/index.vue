<template>
  <view class="container">
    <!-- 搜索框和添加好友按钮 -->
    <view class="search-bar">
      <input placeholder="搜索好友" v-model="searchInput" />
      <button class="add-btn" @click="searchUser">+</button>
    </view>
	
	<view class="tabs">
	  <text :class="{active: selectedTab === 'get'}" @click="selectTab('get')">已接收</text>
	  <text :class="{active: selectedTab === 'send'}" @click="selectTab('send')">已发送</text>
	</view>
	
	<!-- 列表区域 -->
	<scroll-view class="content" scroll-y="true">
	    <view v-if="selectedTab === 'get'">
	      <view v-if="getMessage.length === 0">
	        <text>当前没有收到的消息</text>
	      </view>
	      <view v-else>
	        <view v-for="(message, index) in reversedGetMessage" :key="index" class="message-item" @click="viewGetMessage(message)">
			  <view class="friend-header">
			    <text class="friend-name">
			      来自：{{ message.senderName }}
			    </text>
			    <text class="message-time">\n {{ formatDate(message.time) }}</text> 
			  </view>
	        </view>
	      </view>
	    </view>
	    
	    <view v-else-if="selectedTab === 'send'">
	      <view v-if="sendMessage.length === 0">
	        <text>当前没有发送的消息</text>
	      </view>
	      <view v-else>
	        <view v-for="(message, index) in reversedSendMessage" :key="index" class="message-item" @click="viewSendMessage(message)">
			  <view class="friend-header">
			    <text class="friend-name">
			      {{ message.replyTo === '000000000000000000000000' ? '发给：' : '回复：' }}{{ message.receiverName }}
			    </text>
			    <text class="message-time">\n {{ formatDate(message.time)}}</text> 
			  </view>
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
      searchInput: "",
	  selectedTab: 'get',
      getMessage: [],
	  sendMessage: [],
	  baseurl: getApp().globalData.baseURL,
	  token: "",
	  personal_id: "",
    };
  },
  computed: {
    filteredFriends() {
      if (!this.searchText) return this.friends;
      return this.friends.filter(friend =>
        friend.nickname.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
	reversedGetMessage() {
	  return this.getMessage.slice().reverse();
	},
	reversedSendMessage() {
	  return this.sendMessage.slice().reverse();
	}
  },
  onLoad() {
	this.token = uni.getStorageSync('userToken');
	this.personal_id = uni.getStorageSync('personal_id');
    this.fetchGetMessage();
    this.fetchSendMessage();
  },
  onShow() {
  	this.fetchGetMessage();
  	this.fetchSendMessage();
	this.searchUser();
  },
  methods: {
	searchUser() {
		if (!this.searchInput) {
			return; // 如果搜索框为空，不发送请求
		}
		console.log(this.searchInput);
		
	    uni.request({
	      url: `${this.baseurl}/searchUserByName`,
	      method: 'GET',
		  data: { 
			token: this.token,
			name: this.searchInput, 
		  },
	      success: (res) => {
	      	if (res.statusCode === 200 && res.data) {
				console.log(res.data);
				if(res.data.id === this.personal_id) {
					uni.switchTab({
					  url: `/pages/user/index/index`
					});
				} else {
					uni.navigateTo({
					  url: `/pages5_user/friendProfile/friendProfile?user_id=${res.data.id}`
					});
				}
				this.searchInput = '';
			} else {
				uni.showToast({
				  title: '未搜索到用户',
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
	    if (this.selectedTab !== tab) {
	      this.selectedTab = tab;
	    }
	},
    navigateTo(page) {
      uni.navigateTo({ url: `/pages4_dialog/${page}/${page}` });
    },
	fetchGetMessage() {
		if (!this.token) {
		  this.token = uni.getStorageSync('userToken');
		}
		this.getMessage = [];
		uni.request({
		  url: `${this.baseurl}/getMessagesIGet`,
		  method: 'GET',
		  data: {
		    token: this.token,
		  },
		  success: (res) => {
		    if (res.statusCode === 200) {
		      if (res.data) {
		        console.log(res.data);
				this.getMessage = res.data.messages;
		      }
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
	fetchSendMessage() {
		if (!this.token) {
		  this.token = uni.getStorageSync('userToken');
		}
		this.sendMessage = [];
		uni.request({
		  url: `${this.baseurl}/getMessagesISend`,
		  method: 'GET',
		  data: {
		    token: this.token,
		  },
		  success: (res) => {
		    if (res.statusCode === 200) {
		      if (res.data) {
		        console.log(res.data);
				this.sendMessage = res.data.messages;
		      }
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
	viewGetMessage(message) {
		uni.navigateTo({
		  url: `/pages4_dialog/chat/chat?message=${encodeURIComponent(JSON.stringify(message))}`
		});
	},
	viewSendMessage(message) {
	  console.log(message);
	  // 将 message 对象转化为 JSON 字符串并传递给目标页面
	  uni.navigateTo({
	    url: `/pages4_dialog/messageDetail/messageDetail?message=${encodeURIComponent(JSON.stringify(message))}`
	  });
	},
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
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 10;
}
input {
  flex: 1;
  padding: 8px;
  border: none;
  background-color: #ffffff;
}
.add-btn {
  font-size: 18px;
  color: #333333;
  margin-left: 8px;
}

.friend-list {
  height: calc(800px); /* 调整高度，保证最多显示7个好友 */
  overflow-y: auto;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.tabs text {
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
}

.tabs text.active {
  color: #007aff;
  border-bottom: 2px solid #007aff;
}

.loading-text {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.content {
  height: 100%; /* 根据页面需要进行调整 */
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
