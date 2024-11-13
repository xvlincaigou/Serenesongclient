<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input type="text" placeholder="搜索词牌" v-model="searchQuery" @input="filterResults" />
      <view v-if="filteredResults.length > 0" class="search-results">
        <view v-for="item in filteredResults" :key="item" class="result-item" @click="navigateToWritePage(item)">
          {{ item }}
        </view>
      </view>
    </view>

    <!-- 推荐词牌展示区域 -->
    <view class="recommendation-container">
      <!-- 推荐标题，点击显示提示 -->
      <view class="triangle-container">
        <view class="triangle" @click="showRefreshLogic">今日推荐词牌</view>
      </view>

      <!-- 词牌矩形展示 -->
      <view class="tags-container">
        <view class="tag-item" v-for="tag in tags" :key="tag.name" @click="navigateToWritePage(tag.name)">
          <view class="tag-title">{{ tag.name }}</view>
          <view class="tag-description">{{ tag.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      tags: [
        { name: '满江红', description: '激昂深沉\n英雄气概\n人生感悟' },
        { name: '清平乐', description: '简洁明快\n安静和谐' },
        { name: '水调歌头', description: '音韵优美\n美好向往\n时光流逝' },
        { name: '江城子', description: '节奏富有故事感\n春天\n离别\n夜晚' },
        { name: '念奴娇', description: '旋律婉转\n情感细腻\n思念爱恋' },
        { name: '浣溪沙', description: '短小精悍\n轻松愉快\n美好瞬间' },
        { name: '虞美人', description: '感伤悲哀\n失恋\n告别' },
        { name: '菩萨蛮', description: '略带异域风情\n爱情\n美人' },
      ],
      filteredResults: []
    };
  },
  methods: {
    // 过滤搜索结果
    filterResults() {
      if (this.searchQuery) {
        this.filteredResults = this.tags
          .map(tag => tag.name)
          .filter(name => name.includes(this.searchQuery));
      } else {
        this.filteredResults = []; // 清空输入时隐藏搜索结果
      }
    },
    // 跳转到 write 页面并传递参数
    navigateToWritePage(cipai) {
      uni.navigateTo({
        url: `/pages/write/write/write?cipai=${cipai}`
      });
    },
    // 显示刷新逻辑提示
    showRefreshLogic() {
      uni.showToast({
        title: '刷新逻辑',
        icon: 'none',
        duration: 2000
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-bar {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-results {
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
}

.result-item {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.recommendation-container {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  position: relative;
}

.triangle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.triangle {
  width: 100px;
  height: 30px;
  background-color: #ddd;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tag-item {
  width: 50px;
  height: 150px;
  margin-bottom: 30px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tag-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}

.tag-description {
  font-size: 10px;
  color: #666;
  line-height: 20px;
  overflow: hidden;
}
</style>
