<template>
  <view class="wD-container">
    <text class="wD-work-title">{{ workTitle }}\n</text>
    <text class="wD-work-date">{{ workDate }}</text>
    <view class="wD-work-content-box">
      <text class="wD-work-content">{{ workContent }}</text>
    </view>
    <view class="wD-actions">
      <button @click="publishWork()">发布</button>
      <button @click="editWork()">修改</button>
	  <button @click="deleteWork()">删除</button>
	  <button @click="setWork()">设为代表</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      workTitle: '',
      workDate: '',
	  workContent: ''
    };
  },
  onLoad(options) {
    this.workTitle = options.title;
    this.workDate = options.date;
	this.workContent = options.content;
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
.wD-container { padding: 16px; }
.wD-work-title { font-size: 18px; font-weight: bold; }
.wD-work-date { color: grey; margin-top: 8px; font-size: 10px;}
.wD-work-content-box {
  background-color: #f0f0f0;
  padding: 16px;
  margin-top: 8px;
  border-radius: 8px;
}
.wD-work-content { color: black; font-size: 14px; }
.wD-actions { display: flex; justify-content: space-around; margin-top: 16px; }
button { padding: 8px; font-size: 14px; width: 20%;}
</style>
