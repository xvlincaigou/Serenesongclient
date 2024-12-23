<template>
  <view class="friend-container">
    <!-- Tab选择栏 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'follow'}" @click="selectTab('follow')">听弦</text>
      <text :class="{active: selectedTab === 'fans'}" @click="selectTab('fans')">赠羽</text>
    </view>
    
    <!-- 列表区域 -->
    <scroll-view class="content" scroll-y="true">
      <!-- 听弦列表 -->
      <view v-if="selectedTab === 'follow'">
        <view v-if="isLoadingFollow" class="loading-container">
          <text class="loading-text">正在加载中...</text>
        </view>
        <view v-else-if="subscribedTo.length === 0" class="empty-container">
          <text class="empty-text">暂无听弦</text>
        </view>
        <view v-else>
          <view 
            v-for="(friend, index) in subscribedTo" 
            :key="index" 
            class="friend-item" 
            @click="viewFriendProfile(friend)"
          >
            <view class="friend-header">
              <!-- 可选：添加头像 -->
              <!--
              <image 
                v-if="friend.avatar" 
                :src="friend.avatar" 
                class="friend-avatar" 
                mode="cover"
              ></image>
              -->
              <text class="friend-name">{{ friend.name || '未命名用户' }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 赠羽列表 -->
      <view v-else-if="selectedTab === 'fans'">
        <view v-if="isLoadingFans" class="loading-container">
          <text class="loading-text">正在加载中...</text>
        </view>
        <view v-else-if="subscribers.length === 0" class="empty-container">
          <text class="empty-text">暂无赠羽</text>
        </view>
        <view v-else>
          <view 
            v-for="(friend, index) in subscribers" 
            :key="index" 
            class="friend-item" 
            @click="viewFriendProfile(friend)"
          >
            <view class="friend-header">
              <!-- 可选：添加头像 -->
              <!--
              <image 
                v-if="friend.avatar" 
                :src="friend.avatar" 
                class="friend-avatar" 
                mode="cover"
              ></image>
              -->
              <text class="friend-name">{{ friend.name || '未命名用户' }}</text>
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
      baseurl: getApp().globalData.baseURL,
      selectedTab: 'follow', // 默认选中“我的关注”
      subscribedTo: [],
      subscribers: [],
      token: "",
      personal_id: "",
      isLoadingFollow: false,
      isLoadingFans: false,
    };
  },
  onLoad() {
    this.personal_id = uni.getStorageSync('personal_id');
    this.fetchSubscribers();
    this.fetchSubscribedTo();
  },
  onShow() {
    this.fetchSubscribers();
    this.fetchSubscribedTo();
  },
  methods: {
    selectTab(tab) {
      if (this.selectedTab !== tab) {
        this.selectedTab = tab;
        // 根据选择的标签刷新对应的数据
        if (tab === 'follow') {
          this.fetchSubscribedTo();
        } else if (tab === 'fans') {
          this.fetchSubscribers();
        }
      }
    },
    // 通用的获取用户信息函数，返回一个 Promise
    fetchUserInfo(user_id) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.baseurl}/getUserInfoText`,
          method: 'GET',
          data: {
            token: this.token,
            user_id: user_id,
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data) {
              resolve(res.data);
            } else {
              uni.showToast({
                title: '获取用户信息失败',
                icon: 'none',
              });
              resolve(null);
            }
          },
          fail: () => {
            uni.showToast({
              title: '请求失败',
              icon: 'none',
            });
            resolve(null);
          }
        });
      });
    },
    async fetchSubscribers() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      this.isLoadingFans = true;
      this.subscribers = [];
      
      // 获取粉丝列表
      const subscribers = uni.getStorageSync('subscribers');
      
      if (!Array.isArray(subscribers) || subscribers.length === 0) {
        // 数据为空，直接结束加载
        this.isLoadingFans = false;
        return;
      }
      
      // 使用 Promise.all 等待所有用户信息请求完成
      const promises = subscribers.map(user_id => this.fetchUserInfo(user_id));
      const results = await Promise.all(promises);
      this.subscribers = results.filter(user => user !== null);
      this.isLoadingFans = false;
    },
    async fetchSubscribedTo() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      this.isLoadingFollow = true;
      this.subscribedTo = [];
      
      // 获取关注列表
      const subscribedTo = uni.getStorageSync('subscribedTo');
      
      if (!Array.isArray(subscribedTo) || subscribedTo.length === 0) {
        // 数据为空，直接结束加载
        this.isLoadingFollow = false;
        return;
      }
      
      // 使用 Promise.all 等待所有用户信息请求完成
      const promises = subscribedTo.map(user_id => this.fetchUserInfo(user_id));
      const results = await Promise.all(promises);
      this.subscribedTo = results.filter(user => user !== null);
      this.isLoadingFollow = false;
    },
    viewFriendProfile(friend) {
      if (friend._id) {
        if (friend._id === this.personal_id) {
          uni.switchTab({
            url: `/pages/user/index/index`
          });
        } else {
          uni.navigateTo({
            url: `/pages5_user/friendProfile/friendProfile?user_id=${friend._id}`
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
  background-color: #fefdf9; /* 增加背景色，提升整体对比 */
  min-height: 100vh; /* 确保内容高度覆盖屏幕 */
}

/* Tab选择栏 */
.tabs {
  display: flex;
  justify-content: space-around;
  padding-top: 5px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0; /* 加粗下边框 */
  background-color: #ffffff; /* 设置背景色 */
  padding-bottom: 10px; /* 增加内边距 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 增强阴影效果 */
}

.tabs text {
  font-size: 18px;
  padding: 12px 16px;
  cursor: pointer;
  transition: color 0.3s, border-bottom 0.3s;
}

.tabs text.active {
  color: #476381;
  border-bottom: 3px solid #476381;
  font-weight: bold; /* 加粗激活状态文本 */
}

/* 列表区域 */
.content {
  height: calc(100vh - 100px); /* 根据实际需要调整 */
  padding-bottom: 20px;
}

/* 加载中和空状态容器 */
.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* 调整高度以居中显示 */
}

.loading-text,
.empty-text {
  font-size: 16px;
  color: #888888;
}

/* 好友项卡片样式 */
.friend-item {
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 12px; /* 更大的圆角 */
  background: linear-gradient(145deg, #ffffff, #f0f0f0); /* 更柔和的渐变背景 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 增强阴影效果 */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.friend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 好友项头部布局 */
.friend-header {
  display: flex;
  align-items: center;
}

/* 好友头像样式（可选） */
.friend-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
}

/* 好友昵称样式 */
.friend-name {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  word-break: break-word; /* 自动换行 */
}

/* 响应式调整（可选） */
@media (max-width: 600px) {
  .tabs text {
    font-size: 16px;
    padding: 10px 12px;
  }

  .friend-item {
    padding: 14px;
  }

  .friend-name {
    font-size: 16px;
  }
}
</style>
