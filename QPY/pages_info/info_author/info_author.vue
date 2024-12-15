<template>
  <view class="container">
    <view class="detail-header">
      <text class="header-title">{{ author.name }}</text>
    </view>
    <view class="detail-body">
      <view class="bio-section">
        <text class="bio-text">{{ author.bio }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      author: {}
    };
  },
  onLoad(options) {
    this.author = JSON.parse(decodeURIComponent(options.author));
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #fefdf9;
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

.detail-body {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.bio-section {
  margin-top: 10px;
}

.bio-text {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}
</style>
