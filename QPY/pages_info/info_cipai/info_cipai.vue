<template>
  <view class="container">
    <view class="section header-section">
      <text class="header-title">{{ cipaiDetail.name }}</text>
    </view>
    <view class="section desc-section">
      <text class="desc-text">{{ cipaiDetail.desc }}</text>
    </view>
    <view class="formats-section">
      <view v-for="(format, index) in cipaiDetail.formats" :key="index" class="section format-section">
        <view class="format-header-container">
          <text class="format-header">韵律版本{{ index + 1 }}：{{ format.author }}</text>
          <button class="compose-button" @click="goToCompose(cipaiDetail.name, index)">以此韵律创作</button>
        </view>
        <text v-if="format.desc" class="format-desc-title">古人点评:\n</text>
        <text v-if="format.desc" class="format-desc">{{ format.desc }}\n\n</text>
        <text v-if="format.sketch" class="format-sketch-title">韵律特征:\n</text>
        <text v-if="format.sketch" class="format-sketch">{{ format.sketch }}\n\n</text>
        <view class="tune-section">
          <text class="tune-desc-title">韵律内容:\n</text>
          <text class="tunes">{{ formatTunes(format.tunes) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cipaiDetail: {}
    };
  },
  methods: {
    formatTunes(tunes) {
      return tunes.map(tune => `${tune.tune}${tune.rhythm ? ' (' + tune.rhythm + ')' : ''}`)
                  .join('')
                  .replace(/韵\)/g, '韵)\n'); // 每当有“韵”字符时换行
    },
    goToCompose(cipai_name, format_num) {
      uni.navigateTo({
        url: `/pages3_write/write/write?cipai_name=${encodeURIComponent(cipai_name)}&format_num=${format_num}`
      });
    }
  },
  onLoad(options) {
    const cipai = JSON.parse(decodeURIComponent(options.cipai));
    this.cipaiDetail = cipai || {};
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
}

.section, .format-section {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  white-space: pre-wrap; /* 保证换行 */
}

.formats-section {
  width: 100%; 
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.header-title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center; /* 使标题居中 */
}

.format-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.format-header {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.compose-button {
  color: #909090;
  padding: 0px 6px;
  margin-right: 0px;
  border-radius: 5px;
  font-size: 14px;
}

.desc-text, .format-desc, .format-sketch, .tunes {
  font-size: 15px;
  color: #7a7a7a;
  line-height: 1.6;
  margin-top: 10px;
}

.tune-desc {
  color: #444;
  margin-top: 10px;
}

.tunes {
  color: #444;
}

.format-desc-title, .format-sketch-title, .tune-desc-title {
  font-size: 16px;
  text-decoration: underline;
  font-weight: bold; 
}
</style>
