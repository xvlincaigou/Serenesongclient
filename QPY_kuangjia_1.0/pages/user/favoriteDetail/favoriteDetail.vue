<template>
  <view class="fD-container">
    <text class="favorite-title">{{ favoriteTitle }}\n</text>
    <text class="favorite-source">{{ favoriteSource }}\n</text>
    
    <!-- 作品原文框 -->
    <view class="favorite-content-box">
      <text class="favorite-content">{{ favoriteContent }}</text>
    </view>
    
    <!-- 作品原文和作品赏析之间的白色缝隙 -->
    <view class="gap"></view>
    
    <!-- 作品赏析框 -->
    <view class="favorite-analysis-box">
      <text class="favorite-analysis">赏析：\n{{ favoriteAnalysis }}</text>
    </view>
    
    <button @click="startCreating">我也要创作</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favoriteTitle: '',
      favoriteSource: ''
    };
  },
  onLoad(options) {
    this.favoriteTitle = options.title;
    this.favoriteSource = options.source;
	this.favoriteContent = options.content;
	this.favoriteAnalysis = options.analysis;
  },
  methods: {
    startCreating() { /* 开始创作逻辑 */ },
  },
};
</script>

<style>
.fD-container { padding: 16px; }
.favorite-title { font-size: 18px; font-weight: bold; }
.favorite-source { color: grey; margin-top: 8px; font-size: 12px; }

/* 作品原文样式 */
.favorite-content-box {
  margin-top: 20px;
  background-color: #333; /* 深灰色背景 */
  padding: 12px;
  border-radius: 8px;
}
.favorite-content {
  font-size: 16px; /* 比作品赏析大 */
  color: white;
}

/* 缝隙 */
.gap {
  height: 8px; /* 调整缝隙高度 */
  background-color: white;
}

/* 作品赏析样式 */
.favorite-analysis-box {
  background-color: #ddd; /* 浅灰色背景 */
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
}
.favorite-analysis {
  font-size: 14px; /* 较小字体 */
  color: black;
}

button {
  margin: 10px 0;
  padding: 8px;
  width: 30%;
}
</style>
