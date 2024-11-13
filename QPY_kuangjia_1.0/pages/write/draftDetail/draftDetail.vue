<template>
  <view class="dD-container">
    <text class="dD-work-title">{{ draftTitle }}\n</text>
    <text class="dD-work-date">{{ draftDate }}</text>
    <view class="dD-work-content-box">
      <text class="dD-work-content">{{ draftContent }}</text>
    </view>
    <view class="dD-actions">
      <button @click="publishWork()">发布</button>
      <button @click="editWork()">修改</button>
	  <button @click="deleteWork()">删除</button>
	  <button @click="setWork()">设为作品</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      draftTitle: '',
      draftDate: '',
	  draftContent: ''
    };
  },
  onLoad(options) {
    this.draftTitle = options.title;
    this.draftDate = options.date;
	this.draftContent = options.content;
  },
  methods: {
    editWork() { /* 修改作品逻辑 */ },
    publishWork() { /* 发布作品逻辑 */ },
	deleteWork() { /* 删除作品逻辑 */ },
	setWork() { /* 设为代表逻辑 */ }
  },
};
</script>

<style>
.dD-container { padding: 16px; }
.dD-work-title { font-size: 18px; font-weight: bold; }
.dD-work-date { color: grey; margin-top: 8px; font-size: 10px;}
.dD-work-content-box {
  background-color: #f0f0f0;
  padding: 16px;
  margin-top: 8px;
  border-radius: 8px;
}
.dD-work-content { color: black; font-size: 14px; }
.dD-actions { display: flex; justify-content: space-around; margin-top: 16px; }
button { padding: 8px; font-size: 14px; width: 20%;}
</style>
