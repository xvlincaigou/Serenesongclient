<template>
  <view class="creation-container">
    <view v-for="(work, index) in works" :key="index" class="creation-work-item" @click="viewWorkDetail(work)">
      <text class="creation-work-date">{{ work.date }}</text>
      <view class="creation-work-box">{{ work.title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      works: [
        { title: "创作作品 1", content: "随便写点", date: "2024-01-01" },
        { title: "创作作品 2", content: "再用gpt抄点", date: "2024-01-02" },
        // 可添加更多作品
      ],
    };
  },
  methods: {
    viewWorkDetail(work) {
      uni.navigateTo({ url: `/pages5_user/workDetail/workDetail?title=${work.title}&date=${work.date}&content=${work.content}` });
    },
  },
};
</script>

<style>
.creation-container { padding: 16px; }
.creation-work-item { margin-bottom: 16px; }
.creation-work-date { color: gray; font-size: 12px; }
.creation-work-box { background-color: #f0f0f0; padding: 20px; }
</style>
