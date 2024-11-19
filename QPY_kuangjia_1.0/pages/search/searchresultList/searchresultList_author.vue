<template>
  <view class="container">
    <view class="search-header">
      <text>词人搜索结果 - "{{ keyword }}"</text>
    </view>
    <view class="results-list">
      <view
        class="result-item"
        v-for="(author, index) in matched_authors"
        :key="index"
        @click="navigateToDetail(author)"
      >
        <text class="result-title">{{ author.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      matched_authors: [],
    };
  },
  onLoad(options) {
    this.keyword = options.keyword || '';
    this.fetchResults();
  },
  methods: {
    fetchResults() {
      const baseurl = getApp().globalData.baseURL;
      uni.request({
        url: `${baseurl}/search?keyword=${encodeURIComponent(this.keyword)}&option=author`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.matched_authors = res.data.matched_authors || [];
          } else {
            console.error('API error:', res);
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
        }
      });
    },
    navigateToDetail(author) {
      uni.navigateTo({
        url: `/pages/info/info_author/info_author?author=${encodeURIComponent(JSON.stringify(author))}`
      });
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.search-header {
  padding: 16px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #dddddd;
}

.results-list {
  padding: 8px;
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
}

.result-title {
  font-size: 18px;
  color: #333333;
}

</style>
