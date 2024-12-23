<template>
  <view class="container">
    <!-- 搜索框和添加好友按钮 -->
    <view class="search-bar">
	  <textarea v-model="searchInput"
	      class="search-input"
	      placeholder="寻觅知音">
	  </textarea>
      <button class="add-btn" @click="searchUser">→</button>
    </view>
  
    <view class="tabs">
      <text :class="{active: selectedTab === 'get'}" @click="selectTab('get')">来  雁</text>
      <text :class="{active: selectedTab === 'send'}" @click="selectTab('send')">往  雁</text>
    </view>
  
    <!-- 列表区域 -->
    <scroll-view class="content" scroll-y="true">
      <!-- 已接收消息列表 -->
      <view v-if="selectedTab === 'get'" class="list">
		<view v-if="!uniqueSenderNames || uniqueSenderNames.length === 0">
		  <text class="message-shu">暂无来雁</text>
		</view>
		<view v-else>
		  <view 
		    v-for="(senderName, index) in uniqueSenderNames" 
		    :key="index" 
		    class="message-item" 
		    @click="viewSenderDetail(senderName)"
		  >
		    <view class="friend-header">
		      <text class="friend-name">
		        来自：{{ senderName }}
		      </text>
		    </view>
		  </view>
		</view>
      </view>
      
      <!-- 已发送消息唯一接收者列表 -->
      <view v-else-if="selectedTab === 'send'">
        <view v-if="!uniqueReceiverNames || uniqueReceiverNames.length === 0">
          <text class="message-shu">暂未飞雁</text>
        </view>
        <view v-else>
          <view 
            v-for="(receiverName, index) in uniqueReceiverNames" 
            :key="index" 
            class="message-item" 
            @click="viewReceiverDetail(receiverName)"
          >
            <view class="friend-header">
              <text class="friend-name">
                发给：{{ receiverName }}
              </text>
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
    // 反转已接收的消息列表
    reversedGetMessage() {
      if (!this.getMessage || this.getMessage.length === 0) {
        return [];
      }
      return this.getMessage.slice().reverse();
    },
    // 反转已发送的消息列表
    reversedSendMessage() {
      if (!this.sendMessage || this.sendMessage.length === 0) {
        return [];
      }
      return this.sendMessage.slice().reverse();
    },
    // 提取唯一的 receiverName
    uniqueReceiverNames() {
      const namesSet = new Set();
      this.reversedSendMessage.forEach(message => {
        if (message.receiverName) {
          namesSet.add(message.receiverName);
        }
      });
      return Array.from(namesSet);
    },
	uniqueSenderNames() {
	  const namesSet = new Set();
	  this.reversedGetMessage.forEach(message => {
	    if (message.senderName) {
	      namesSet.add(message.senderName);
	    }
	  });
	  return Array.from(namesSet);
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
    // 搜索用户方法
    searchUser() {
      if (!this.searchInput) {
        return; // 如果搜索框为空，不发送请求
      }
      
      uni.request({
        url: `${this.baseurl}/searchUserByName`,
        method: 'GET',
        data: { 
          token: this.token,
          name: this.searchInput, 
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
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
    // 选项卡切换
    selectTab(tab) {
      if (this.selectedTab !== tab) {
        this.selectedTab = tab;
      }
    },
    // 导航方法
    navigateTo(page) {
      uni.navigateTo({ url: `/pages4_dialog/${page}/${page}` });
    },
    // 获取已接收的消息
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
    // 获取已发送的消息
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
    // 查看已接收的消息详情
    viewGetMessage(message) {
      uni.navigateTo({
        url: `/pages4_dialog/chat/chat?message=${encodeURIComponent(JSON.stringify(message))}`
      });
    },
    // 查看已发送的消息详情
    viewSendMessage(message) {
      // 将 message 对象转化为 JSON 字符串并传递给目标页面
      uni.navigateTo({
        url: `/pages4_dialog/messageDetail/messageDetail?message=${encodeURIComponent(JSON.stringify(message))}`
      });
    },
    // 点击 receiverName 跳转到 nameDetail 页面
    viewReceiverDetail(receiverName) {
      uni.navigateTo({
        url: `/pages4_dialog/nameDetail/nameDetail?receiverName=${encodeURIComponent(receiverName)}`
      });
    },
	viewSenderDetail(senderName) {
	  uni.navigateTo({
	    url: `/pages4_dialog/fromDetail/fromDetail?senderName=${encodeURIComponent(senderName)}`
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
.container { background-color: #fff; }
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8f8f8;
  position: sticky;
  top: 0;
  z-index: 10;
}
.search-input{
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
.add-btn {
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

.add-btn:hover {
  background-color: #3b2d17;  /* 悬浮时的背景色 */
}

.add-btn:active {
  background-color: #182f7a;  /* 按钮点击时的背景色 */
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
input {
  flex: 1;
  padding: 8px;
  border: none;
  background-color: #ffffff;
}

.tabs{
	padding-top: 10px;
}
.tabs text {
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.tabs text.active {
  color: #5b5e95;
  border-bottom: 2px solid #565795;
}

.loading-text {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.content { 
  max-height: 500px;
  overflow-y: auto;
  padding: 0px;
  margin-right: 50px;
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
  color: #888888;
}
.message-shu {
	  color: #888888;
	  display: flex; 
	  justify-content: center;
	  align-items: center;
	  height: 50px; 
}
</style>
