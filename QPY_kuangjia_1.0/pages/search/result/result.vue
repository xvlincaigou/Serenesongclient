<template>
  <view class="container">

    <!-- 结果显示区域 -->
    <view class="result-content">
      <text class="result-title">{{ title }}</text>
	  <text class="result-type">{{ typeInChinese }}</text>
      <text class="result-subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      subtitle: "",
      type: ""
    };
  },
  computed: {
    typeInChinese() {
      const typeMapping = {
        poet: "诗人",
        poem: "诗词",
        cipai: "词牌"
      };
      return typeMapping[this.type] || this.type;
    }
  },
  onLoad(options) {
    // 接收从 index.vue 传递过来的参数
    this.title = decodeURIComponent(options.title || "");
    this.subtitle = decodeURIComponent(options.subtitle || "");
    this.type = decodeURIComponent(options.type || "");
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


.result-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.result-title {
  font-size: 32px;
  color: #333333;
  margin-bottom: 10px;
  font-weight: 700; 
}

.result-type {
  font-size: 16px;
  color: #8f8f8f;
  font-style: italic; 
  margin-bottom: 20px;
}

.result-subtitle {
  font-size: 18px;
  color: #555555;
  margin-bottom: 8px;
}


</style>
