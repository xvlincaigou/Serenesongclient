<template>
  <view class="draft-container">
    <view v-for="(draft, index) in drafts" :key="index" class="draft-item" @click="viewDraftDetail(draft)">
      <text class="draft-date">{{ draft.date }}</text>
      <view class="draft-box">{{ draft.title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      drafts: [
        { title: "创作作品 1", content: "随便写点", date: "2024-01-01" },
        { title: "创作作品 2", content: "再用gpt抄点", date: "2024-01-02" },
        // 可添加更多作品
      ],
    };
  },
  methods: {
    viewDraftDetail(draft) {
      uni.navigateTo({ url: `/pages/write/draftDetail/draftDetail?title=${draft.title}&date=${draft.date}&content=${draft.content}` });
    },
  },
};
</script>

<style>
.draft-container { padding: 16px; }
.draft-item { margin-bottom: 16px; }
.draft-date { color: gray; font-size: 12px; }
.draft-box { background-color: #f0f0f0; padding: 20px; }
</style>
