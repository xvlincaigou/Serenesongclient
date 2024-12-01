<template>
  <view class="container">
    <view class="UserWorks-list">
      <view v-if="UserWorks.length > 0">
        <view
          class="UserWorks-item"
          v-for="(UserWork, index) in UserWorks"
          :key="index"
          @click="navigateToDetail(UserWork)"
        >
          <view class="UserWork-header">
            <text class="UserWorks-title">
              {{ UserWork.cipai[0] }} · {{ UserWork.title }}
            </text>
            <text class="UserWorks-time">\n {{ formatDate(UserWork.created_at)}}</text> 
          </view>
        </view>
      </view>
      <view v-else class="no-UserWorks">
        <text>哎呀，没有创作啊，试试去写写吧！</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userToken: '',
      UserWorks: [],
    };
  },
  onLoad(options) {
    uni.getStorage({
      key: 'userToken',
      success: (res) => {
        this.userToken = res.data;
        console.log('1userToken', this.userToken);
        // 在获取到token之后再调用fetchResults
        this.fetchResults();
      },
    });
  },
  methods: {
    fetchResults() {
      const baseurl = getApp().globalData.baseURL;
      console.log('2userToken', this.userToken);
      uni.request({
        url: `${baseurl}/getMyWorks?token=${this.userToken}&kind=UserWorks`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.UserWorks = res.data.UserWorks || [];
          } else {
            console.error('API error:', res);
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
        },
      });
    },
    navigateToDetail(UserWork) {
      uni.navigateTo({
        url: `/pages3_write/userWorkDetail/userWorkDetail?UserWork=${encodeURIComponent(JSON.stringify(UserWork))}`,
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

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.UserWorks-list {
  padding: 16px;
}

.UserWorks-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.UserWorks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.UserWorks-title {
  font-size: 18px;
  font-weight: bold;
  color: #1b4965;
}

.UserWorks-time {
  font-size: 14px;
  color: #888888;
}

.no-UserWorks {
  padding: 12px;
  text-align: center;
  color: #999999;
}
</style>