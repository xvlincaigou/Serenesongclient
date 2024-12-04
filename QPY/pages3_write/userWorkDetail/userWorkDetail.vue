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

      <!-- 操作按钮容器 -->
      <view class="UserWork-footer-container">
        <button @click="editUserWork" class="button edit-button">编辑作品</button>
        <button @click="deleteUserWork" class="button delete-button">删除作品</button>
        <button @click="featureUserWork" class="button feature-button">推荐作品</button>
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
      UserWork: null, // 保存作品的详细信息
    };
  },
  onLoad(options) {
    const workData = options.UserWork ? JSON.parse(decodeURIComponent(options.UserWork)) : null;
    this.UserWork = workData;
  },
  methods: {
    editUserWork() {
      uni.navigateTo({
        url: `/pages3_write/write/write?work=${encodeURIComponent(JSON.stringify(this.UserWork))}`,
      });
    },
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

.button {
  padding: 5px 20px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #333;
  color: #fff;
}

.delete-button {
  background-color: #555;
  color: #fff;
}

.feature-button {
  background-color: #777;
  color: #fff;
}

.button:hover {
  background-color: #111;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
}
</style>
