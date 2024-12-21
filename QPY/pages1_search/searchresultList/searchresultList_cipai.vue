<template>
  <view class="container">
    <view class="search-header">
      <text>词牌搜索结果 - "{{ keyword }}"</text>
    </view>
    <view class="results-list">
      <view v-if="Object.keys(matchedCipai).length > 0">
        <view class="result-item" v-for="(cipai, name) in matchedCipai" :key="name" @click="navigateToDetail(cipai, name)">
          <text class="result-title">{{ name }}</text>
          <text class="result-desc">{{ cipai.desc }}</text>
        </view>
      </view>
      <view v-else class="no-results">
        <text>哎呀，没有匹配搜索的词牌</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      matchedCipai: {}
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
        url: `${baseurl}/search?keyword=${encodeURIComponent(this.keyword)}&option=cipai`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.matchedCipai = res.data.matched_cipai || {};
          } else {
            console.error('API error:', res);
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
        }
      });
    },
    navigateToDetail(cipai, name) {
      const cipaiDetail = {
        name: name,
        ...cipai
      };
      uni.navigateTo({
        url: `/pages_info/info_cipai/info_cipai?cipai=${encodeURIComponent(JSON.stringify(cipaiDetail))}`
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
  cursor: pointer;
}

.result-title {
  font-size: 18px;
  color: #333333;
}

.result-desc {
  font-size: 14px;
  color: #666;
  overflow: visible;
  display: block;  
  line-height: normal;
  max-height: none;  
}

.no-results {
  padding: 12px 16px;
  text-align: center;
  color: #999999;
}
</style>
