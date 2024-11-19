<template>
  <view class="container">
    <view class="search-header">
      <text>词搜索结果 - "{{ keyword }}"</text>
    </view>
    <view class="results-list">
      <view
        class="result-item"
        v-for="(ci, index) in matchedCi"
        :key="index"
        @click="navigateToDetail(ci)"
      >
        <text class="result-title">
          {{ ci.cipai[0] }} · {{ getFirstSentence(ci.content[0]) }}
        </text>
        <text class="result-subtitle">&nbsp;&nbsp;&nbsp;{{ ci.author }}</text>
      </view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      keyword: '', 
      matchedCi: [] 
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
        url: `${baseurl}/search?keyword=${encodeURIComponent(this.keyword)}&option=ci`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.matchedCi = res.data.matched_ci || [];
          } else {
            console.error('API error:', res);
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
        }
      });
    },
    // 提取文本的第一句
    getFirstSentence(text) {
      const sentences = text.split(/[，。\n]/); // 按中文逗号、句号或换行符分割
      return sentences[0];
    },
    // 跳转到详情页
    navigateToDetail(originalCi) {
      let contentCombined = originalCi.content.join('\n'); 
      let firstSentence = this.getFirstSentence(originalCi.content[0]); 
      let cipaiFormatted = originalCi.cipai + ' · ' + firstSentence; 
      let ciToSend = {
        ...originalCi,
        cipai: cipaiFormatted,
        content: contentCombined
      };
      uni.navigateTo({
        url: `/pages/info/info_ci/info_ci?ci=${encodeURIComponent(JSON.stringify(ciToSend))}`
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

.result-subtitle {
  font-size: 16px;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ci-content {
  margin-top: 10px;
}

.ci-content text {
  display: block;
  font-size: 16px;
  color: #555;
  line-height: 24px;
}
</style>

