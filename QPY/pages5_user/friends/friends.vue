<template>
  <view class="friend-container">
    <!-- Tab选择栏 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'follow'}" @click="selectTab('follow')">我的关注</text>
      <text :class="{active: selectedTab === 'fans'}" @click="selectTab('fans')">我的粉丝</text>
    </view>
    
    <!-- 列表区域 -->
    <scroll-view class="content" scroll-y="true">
        <view v-if="selectedTab === 'follow'">
          <view v-if="subscribedTo.length === 0">
            <text>当前还没有关注</text>
          </view>
          <view v-else>
            <view v-for="(friend, index) in subscribedTo" :key="index" class="friend-item" @click="viewFriendProfile(friend)">
              <image :src="friend.avatar ? 'data:image/png;base64,' + friend.avatar : ''" class="friend-avatar" />
              <text class="friend-name">{{ friend.name }}</text>
            </view>
          </view>
        </view>
        
        <view v-else-if="selectedTab === 'fans'">
          <view v-if="subscribers.length === 0">
            <text>当前还没有粉丝</text>
          </view>
          <view v-else>
            <view v-for="(friend, index) in subscribers" :key="index" class="friend-item" @click="viewFriendProfile(friend)">
              <image :src="friend.avatar ? 'data:image/png;base64,' + friend.avatar : ''" class="friend-avatar" />
              <text class="friend-name">{{ friend.name }}</text>
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
      baseurl: getApp().globalData.baseURL,
      selectedTab: 'follow', // 默认选中“我的关注”
      subscribedTo: [],
      subscribers: [],
      token: "",
	  personal_id: "",
      loading: false
    };
  },
  onLoad() {
    // 页面加载时默认加载关注列表
    this.fetchSubscribers();
    this.fetchSubscribedTo();
	this.personal_id = uni.getStorageSync('personal_id');
  },
  onShow() {
	this.fetchSubscribers();
	this.fetchSubscribedTo();
  },
  methods: {
    selectTab(tab) {
      if (this.selectedTab !== tab) {
        this.selectedTab = tab;
        this.fetchSubscribers();
        this.fetchSubscribedTo();
      }
    },
    // 通用的获取用户信息函数
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
    fetchSubscribers() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      
      // 获取粉丝列表
      const subscribers = uni.getStorageSync('subscribers');
      console.log('粉丝列表:', subscribers);
      this.subscribers = [];
      
      // 如果粉丝列表为空或不是数组，则不做任何处理
      if (!Array.isArray(subscribers) || subscribers.length === 0) {
        return;
      }
      
      subscribers.forEach(user_id => {
        this.fetchUserInfo(user_id, this.subscribers);
      });
    },
    fetchSubscribedTo() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      
      // 获取关注列表
      const subscribedTo = uni.getStorageSync('subscribedTo');
      console.log('关注列表:', subscribedTo);
      this.subscribedTo = [];
      
      // 如果关注列表为空或不是数组，则不做任何处理
      if (!Array.isArray(subscribedTo) || subscribedTo.length === 0) {
        return;
      }
      
      subscribedTo.forEach(user_id => {
        this.fetchUserInfo(user_id, this.subscribedTo);
      });
    },
    viewFriendProfile(friend) {
      console.log('好友信息:', friend);
      if (friend.user_id) {
		if (friend.user_id === this.personal_id) {
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
  }
}
</script>

<style>
.friend-container {
  padding: 16px;
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

.friend-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.friend-avatar {
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  margin-right: 10px;
}

.friend-name {
  font-size: 16px;
}

.loading-text {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

.content {
  height: 100%; /* 根据页面需要进行调整 */
}
</style>
