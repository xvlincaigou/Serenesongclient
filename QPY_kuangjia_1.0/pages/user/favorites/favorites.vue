<template>
  <view class="favorite-container">
    <view v-for="(favorite, index) in favorites" :key="index" class="favorite-item" @click="viewFavoriteDetail(favorite)">
      <text class="favorite-source">{{ favorite.source }}</text>
      <view class="favorite-box">{{ favorite.title }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favorites: [
        { title: "静夜思", source: "唐诗三百首", content: "床前明月光", analysis: "表达了作者的思乡之情" },
        { title: "清平乐", source: "宋词精选", content: "天高云淡", analysis: "展现了伟人的革命乐观主义精神" },
        // 可添加更多收藏作品
      ],
    };
  },
  methods: {
    viewFavoriteDetail(favorite) {
      uni.navigateTo({ url: `/pages/user/favoriteDetail/favoriteDetail?title=${favorite.title}&source=${favorite.source}&content=${favorite.content}&analysis=${favorite.analysis}` });
    },
  },
};
</script>

<style>
.favorite-container { padding: 16px; }
.favorite-item { margin-bottom: 16px; }
.favorite-source { color: gray; font-size: 12px; }
.favorite-box { background-color: #f0f0f0; padding: 20px; }
</style>
