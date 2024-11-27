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
        { title: "唐多令·冬至", content: "飞絮满红装，寒英落浅塘。\n过瑶台、玉色圜方。\n昨夜西风应送暖，冬已至、日初长。\n\n白发共疏狂，冰河入月光。\n问此生、何必匆忙？\n最是人间孤独好，凭栏处、有梅香。", date: "2023-12-22" },
        { title: "过圣人庙", content: "玉殿连松柏，名章自古传。\n言诗风雅著，问礼道德还。\n天命违周迹，仁心顺杏坛。\n宫墙高万仞，我本是青山。", date: "2024-04-05" },
        // 可添加更多作品
      ],
    };
  },
  methods: {
    viewWorkDetail(work) {
      uni.navigateTo({ url: `/pages3_write/workDetail/workDetail?title=${work.title}&date=${work.date}&content=${work.content}` });
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
