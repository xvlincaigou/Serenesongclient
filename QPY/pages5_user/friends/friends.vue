<template>
  <view class="friend-container">
    <!-- Tab选择栏 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'follow'}" @click="selectTab('follow')">我的关注</text>
      <text :class="{active: selectedTab === 'fans'}" @click="selectTab('fans')">我的粉丝</text>
    </view>
    
    <!-- 列表区域 -->
    <scroll-view class="content" scroll-y="true">
      <view v-if="loading" class="loading-text">
        <text>加载中...</text>
      </view>
      <view v-else>
        <view v-if="selectedTab === 'follow'">
          <view v-if="friends.length === 0">
            <text>当前还没有关注</text>
          </view>
          <view v-else>
            <view v-for="(friend, index) in friends" :key="index" class="friend-item" @click="viewFriendProfile(friend)">
              <image :src="friend.avatar" class="friend-avatar" />
              <text class="friend-name">{{ friend.name }}</text>
            </view>
          </view>
        </view>
        
        <view v-else-if="selectedTab === 'fans'">
          <view v-if="friends.length === 0">
            <text>当前还没有粉丝</text>
          </view>
          <view v-else>
            <view v-for="(friend, index) in friends" :key="index" class="friend-item" @click="viewFriendProfile(friend)">
              <image :src="friend.avatar" class="friend-avatar" />
              <text class="friend-name">{{ friend.name }}</text>
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
      selectedTab: 'follow', // 默认选中“我的关注”
      friends: [],
	  token: "",
      loading: false
    };
  },
  onLoad() {
    // 页面加载时默认加载关注列表
    this.fetchFriendsList();
  },
  methods: {
    selectTab(tab) {
      if (this.selectedTab !== tab) {
        this.selectedTab = tab;
        this.fetchFriendsList();
      }
    },
    fetchFriendsList() {
	  let baseurl = getApp().globalData.baseURL;
      this.loading = true;
      const that = this;
	  const token = uni.getStorageSync('userToken');
      if (token) {
		this.token = token;
        if (that.selectedTab === 'follow') {
            // 我的关注列表
			uni.request({
			  url: `${baseurl}/getSubscribedTo?token=${token}`,
			  method: 'GET',
			  success: (response) => {
			    // 根据接口返回格式进行适配
			    // 假设返回数据格式为：{ code: 200, data: [...], msg: '成功' }
				console.log('follow');
			    if (response.statusCode === 200 && response.data && Array.isArray(response.data.data)) {
			      that.friends = response.data.data.map(item => {
			        return {
			          name: item.name || '匿名用户', // 根据实际字段修改
			          avatar: item.avatar || '/static/dialog/avatar0.png' // 若无头像则设为默认
			        };
			      });
			    } else {
			      that.friends = [];
			    }
			  },
			  fail: (err) => {
			    console.error('请求失败', err);
			    that.friends = [];
			  },
			  complete: () => {
			    that.loading = false;
			  }
			});
        } else {
            // 我的粉丝列表
			uni.request({
			  url: `${baseurl}/getSubscribers?token=${token}`,
			  method: 'GET',
			  success: (response) => {
			    // 根据接口返回格式进行适配
			    // 假设返回数据格式为：{ code: 200, data: [...], msg: '成功' }
				console.log('fans');
			    if (response.statusCode === 200 && response.data && Array.isArray(response.data.data)) {
			      that.friends = response.data.data.map(item => {
			        return {
			          name: item.name || '匿名用户', // 根据实际字段修改
			          avatar: item.avatar || '/static/dialog/avatar0.png' // 若无头像则设为默认
			        };
			      });
			    } else {
			      that.friends = [];
			    }
			  },
			  fail: (err) => {
			    console.error('请求失败', err);
			    that.friends = [];
			  },
			  complete: () => {
			    that.loading = false;
			  }
			});
        }
      }
    },
    viewFriendProfile(friend) {
      uni.navigateTo({ 
        url: `/pages5_user/friendProfile/friendProfile?name=${friend.name}&avatar=${encodeURIComponent(friend.avatar)}`
      });
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
