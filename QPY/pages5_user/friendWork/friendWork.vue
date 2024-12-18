<template>
  <view class="container">
    <view v-if="UserWork">
      <view class="UserWork-header-container">
        <text class="UserWork-title">{{ UserWork.cipai[0] }} · {{ UserWork.title }}</text>
      </view>

      <!-- 作品内容容器 -->
      <view class="UserWork-content-container">
        <view v-for="(item, index) in UserWork.content" :key="index" class="UserWork-description">
          {{ item }}
        </view>
      </view>
	</view>

    <view v-else>
      <text class="error-message">加载作品失败，请稍后再试。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      UserWork: null,
    };
  },
  onLoad(options) {
    const workData = options.UserWork ? JSON.parse(decodeURIComponent(options.UserWork)) : null;
    this.UserWork = workData;
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

.UserWork-header-container,
.UserWork-content-container {
  margin-bottom: 24px; 
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

.UserWork-header-container {
  display: flex;
  flex-direction: column;
  gap: 4px; 
}

.UserWork-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.UserWork-content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.UserWork-description {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.UserWork-footer-container {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
}
</style>
