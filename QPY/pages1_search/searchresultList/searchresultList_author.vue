<template>
  <view class="container">
    <view class="search-header">
      <text>词人搜索结果 - "{{ keyword }}"</text>
    </view>
    <view class="results-list">
      <view v-if="matched_authors.length > 0">
        <view
          class="result-item"
          v-for="(author, index) in matched_authors"
          :key="index"
          @click="navigateToDetail(author)"
        >
          <text class="result-title">{{ author.name }}</text>
        </view>
      </view>
      <view v-else class="no-results">
        <text>哎呀，没有匹配搜索的词人</text>
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
          if (res.statusCode === 200 && res.data) {
            this.matched_authors = res.data.matched_authors || [];
          }
        }
      });
    },
    navigateToDetail(author) {
      uni.navigateTo({
        url: `/pages_info/info_author/info_author?author=${encodeURIComponent(JSON.stringify(author))}`
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

.no-results {
  padding: 12px 16px;
  text-align: center;
  color: #999999;
}
</style>
