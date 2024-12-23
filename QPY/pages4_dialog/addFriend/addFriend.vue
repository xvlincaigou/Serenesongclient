<template>
  <view class="container">
    <view class="header">发消息</view>
    <view class="search-bar">
	  <input v-model="searchInput"
	      class="search-input"
	      placeholder="请输入用户昵称">
	  </input>
	  <button class="search-btn" @click="searchUser">搜索</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
      token: "",
	  personal_id: "",
      searchInput: ''
    };
  },
  onShow() {
	this.searchUser();  
  },
  onLoad() {
	this.token = uni.getStorageSync('userToken'); 
	this.personal_id = uni.getStorageSync('personal_id');
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.search-btn {
  padding: 5px 10px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
}
.result-list {
  margin-top: 20px;
}
.result-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
