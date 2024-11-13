<template>
  <view class="container">
    <view class="header">加好友</view>
    <input class="search-input" placeholder="输入好友昵称或ID" v-model="searchInput" />
    <view v-if="searchInput" class="result-list">
      <view class="result-item" v-for="(user, index) in searchResults" :key="index">
        <text>{{ user.nickname }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchInput: "",
      searchResults: [
        { nickname: "Tom" },
        { nickname: "Jerry" }
      ]
    };
  }
};
</script>

<style scoped>
.container { padding: 20px; }
.header { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
.search-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.result-list { margin-top: 20px; }
.result-item { padding: 10px; border-bottom: 1px solid #f0f0f0; }
</style>
