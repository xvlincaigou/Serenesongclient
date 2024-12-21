<template>
  <view class="container">
    <!-- 顶部选择栏 -->
    <view class="selection-bar">
      <button 
        :class="{'selected': selectedType === '作品'}" 
        @click="selectType('作品')">作品</button>
      <button 
        :class="{'selected': selectedType === '推荐'}" 
        @click="selectType('推荐')">推荐</button>
      <button 
        :class="{'selected': selectedType === '词评'}" 
        @click="selectType('词评')">词评</button>
      <button 
        :class="{'selected': selectedType === '观点'}" 
        @click="selectType('观点')">观点</button>
    </view>

    <!-- 标题输入框（当类型为“观点”时隐藏） -->
    <view v-if="showTitleInput" class="input-container">
      <input 
        class="title-input" 
        type="text" 
        placeholder="请输入标题" 
        v-model="title" 
        maxlength="50"
      />
    </view>

    <!-- 内容输入框 -->
    <view class="input-container">
      <textarea 
        class="content-input" 
        placeholder="请输入内容" 
        v-model="content"
        maxlength="2000"
        rows="8"
        @input="onContentInput"
      />
    </view>

    <!-- 发帖按钮 -->
    <button class="post-button" @click="postContent">发帖</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedType: '作品',
      title: '',
      content: '',
      showTitleInput: true,
    }
  },
  methods: {
    // 选择帖子的类型
    selectType(type) {
      this.selectedType = type;
      if (type === '推荐') {
        uni.showToast({
          title: '推荐逻辑',
          icon: 'none'
        });
      } else if (type === '词评') {
        uni.showToast({
          title: '词评逻辑',
          icon: 'none'
        });
      }
      this.showTitleInput = type !== '观点';
    },
    // 内容输入事件（可根据需要添加自动换行逻辑）
    onContentInput(e) {
      // 此处可添加逻辑，如动态调整输入框高度
    },
    // 发帖按钮点击事件
    postContent() {
      uni.showToast({
        title: '动态已发布',
        icon: 'success'
      });
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/community/index/index'
        });
      }, 3000);
    }
  }
}
</script>

<style>
.container {
  padding: 20rpx;
}
.selection-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;
}
.selection-bar button {
  flex: 1;
  padding: 20rpx 0;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #f0f0f0;
  color: #000;
  height: 40px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selection-bar button.selected {
  background-color: darkgrey;
  color: #fff;
}
.input-container {
  margin-bottom: 20rpx;
}
.title-input {
  width: 95%;
  margin: 0 auto;
  font-size: 24px;
  font-weight: bold;
  word-break: break-word;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10rpx;
}
.content-input {
  width: 95%;
  margin: 0 auto;
  font-size: 16px;
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ccc;
  padding: 10rpx;
  height: 240rpx; /* 留出至少8行的空间 */
}
.post-button {
  width: 80px;
  height: 40px;
  background-color: #007aff;
  color: #fff;
  margin-right: 10px;
  padding: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
}
</style>
