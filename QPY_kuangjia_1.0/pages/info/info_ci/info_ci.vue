<template>
  <view class="container">
    <view class="detail-header">
      <text class="header-title">{{ci.cipai}}</text>
	  <text class="author-title">\n\n {{ci.author}}</text>
    </view>
    <view class="detail-body">
      <view class="cont-section">
        <text class="cont-text">{{ ci.content }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ci: {}
    };
  },
  onLoad(options) {
    this.ci = JSON.parse(decodeURIComponent(options.ci));
	console.log('Loaded ci object:', this.ci);
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
}

.detail-header {
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.header-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.author-title{
	font-size: 17px;
	color: #AAA;
}

.detail-body {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.cont-section {
  margin-top: 10px;
}

.cont-text {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}
</style>
