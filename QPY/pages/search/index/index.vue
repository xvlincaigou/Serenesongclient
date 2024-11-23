<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input
        placeholder="搜索词人、词、词牌"
        v-model="searchText"
        @focus="isFocused = true"
        @blur="handleBlur"
        autocomplete="on"
      />

      <!-- 搜索结果下拉框 -->
      <view class="search-dropdown" v-if="isFocused && searchText">
        <view
          class="dropdown-item"
          v-for="(item, index) in searchOptions"
          :key="index"
          @click="navigateToList(item.option)"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 每日推荐 -->
    <view class="daily-recommendation">
      <image
        class="recommendation-image"
        :src="recommendation.image"
        mode="widthFix"
      />
      <text class="recommendation-text">{{ recommendation.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      isFocused: false,
      recommendation: {
        text: '',
        image: '',
      },
    };
  },
  computed: {
    searchOptions() {
      if (!this.searchText) return [];
      return [
        { label: `与"${this.searchText}"有关的词人`, option: 'author' },
        { label: `与"${this.searchText}"有关的词`, option: 'ci' },
        { label: `与"${this.searchText}"有关的词牌`, option: 'cipai' },
      ];
    },
  },
  methods: {
    navigateToList(option) {
      uni.navigateTo({
        url: `/pages/search/searchresultList/searchresultList_${option}?keyword=${this.searchText}`,
      });
    },
    handleBlur() {
      setTimeout(() => {
        this.isFocused = false;
      }, 100);
    },
    fetchRecommendation() {
      // 获取推荐词
      uni.request({
        url: 'http://124.221.16.68:8080/recommendCi',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.recommend) {
            const recommendData = res.data.recommend;
            const cipai = recommendData.cipai[0];
            const firstLine = recommendData.content[0].split(/[，。\n]/)[0];
            const author = recommendData.author;
            const content = recommendData.content.join('\n');
            const text = `${cipai}·${firstLine}\n${author}\n\n${content}`;
            this.recommendation.text = text;
          } else {
            console.error('获取推荐词失败', res);
          }
        },
        fail: (err) => {
          console.error('请求失败', err);
        },
      });

      // 获取推荐图片
      uni.request({
        url: 'http://124.221.16.68:8080/recommendPic',
        method: 'GET',
        responseType: 'arraybuffer',
        success: (res) => {
          if (res.statusCode === 200) {
            const base64 = uni.arrayBufferToBase64(res.data);
            const imageSrc = 'data:image/png;base64,' + base64;
            this.recommendation.image = imageSrc;
          } else {
            console.error('获取推荐图片失败', res);
          }
        },
        fail: (err) => {
          console.error('请求失败', err);
        },
      });
    },
  },
  mounted() {
    this.fetchRecommendation();
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.search-bar {
  width:100%;
  position: relative;
  padding: 8px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #dddddd;
}

input {
  width: 90%;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: #ffffff;
}

.search-dropdown {
  position: absolute;
  top: 56px; 
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item text {
  font-size: 16px;
  color: #333333;
}

.daily-recommendation {
  padding: 10px;
  text-align: center;
}

.recommendation-image {
  width: 100%;
  height: auto;
  margin-bottom: 25px;
}

.recommendation-text {
  font-size: 16px;
  color: #5d5d5d;
}
</style>
