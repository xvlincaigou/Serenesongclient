<template>
  <view class="container">
    <!-- 图片部分 -->
    <image src="/static/write/create.png" class="image" @click="chooseToCreate()"></image>

    <!-- 文字部分 -->
    <view class="footer">
	  <text class="text-a" @click="checkWork()">我的文集</text>
      <text class="text-b" @click="checkDraft()">我的手稿</text>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    // 跳转到 create 页面
    chooseToCreate() {
      uni.navigateTo({
        url: '/pages3_write/choose/choose'
      });
    },
    
    // 跳转到 draft 页面
    checkDraft() {
      uni.navigateTo({
        url: '/pages3_write/draftList/draftList'
      });
    },
	
	checkWork() {
	  uni.navigateTo({
	    url: '/pages3_write/userWorkList/userWorkList'
	  });
	}
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  margin-bottom: 50px;
}

.footer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-a, .text-b {
  font-size: 20px;
  color: #808080;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px  rgba(144, 144, 144, 0.3);
}
</style>
