<template>
  <view class="container">
    <view class="search-header">
      <text>词搜索结果 - "{{ keyword }}"</text>
    </view>
    <view class="results-list">
      <view v-if="matchedCi.length > 0">
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
      <view v-else class="no-results">
        <text v-if="isLoading">正在加载中...</text>
        <text v-else>哎呀，没有匹配搜索的词</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '', 
      matchedCi: [],
      isLoading: false,
      loadTimer: null   // 定时器ID
    };
  },
  onLoad(options) {
    this.keyword = options.keyword || '';
    this.fetchResults();
  },
  onUnload() {
    // 清除定时器以防止内存泄漏
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
    }
  },
  methods: {
    fetchResults() {
      this.isLoading = true; // 开始加载
      const baseurl = getApp().globalData.baseURL;
      const keywords = this.keyword.split(' ').filter(k => k.trim() !== '');
      const keywordsString = keywords.map(k => `keyword=${encodeURIComponent(k)}`).join('&'); 
      uni.request({
        url: `${baseurl}/search?${keywordsString}&option=ci`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.matchedCi = res.data.matched_ci || [];
            if (this.matchedCi.length === 0) {
              // 如果没有匹配结果，设置2秒后显示“没有匹配的词”
              this.loadTimer = setTimeout(() => {
                this.isLoading = false;
              }, 2000);
            } else {
              // 有匹配结果，立即停止加载
              this.isLoading = false;
            }
          } else {
            console.error('API error:', res);
            // API出错也停止加载
            this.isLoading = false;
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
          // 请求失败也停止加载
          this.isLoading = false;
        }
      });
    },
    getFirstSentence(text) {
      const sentences = text.split(/[，。\n]/);
      return sentences[0];
    },
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
        url: `/pages_info/info_ci/info_ci?ci=${encodeURIComponent(JSON.stringify(ciToSend))}`
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

.no-results {
  padding: 12px 16px;
  text-align: center;
  color: #999999;
}
</style>
