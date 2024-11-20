<template>
  <view class="fD-container">
    <text class="favorite-title">{{ favoriteTitle }}\n</text>
    <text class="favorite-author">{{ favoriteAuthor }}</text>
    
    <!-- 作品原文框 -->
    <view class="favorite-content-box">
      <text class="favorite-content">{{ favoriteContentStr }}</text>
    </view>
    
    <!-- 作品原文和作品赏析之间的白色缝隙 -->
    <view class="gap"></view>
    
    <!-- 作品赏析框 -->
    <view class="favorite-analysis-box">
      <textarea v-model="favoriteAnalysis" class="favorite-analysis" placeholder="请输入评论"></textarea>
    </view>
    
    <!-- 按钮容器 -->
    <view class="button-container">
      <button @click="saveComment">保存批注</button>
      <button @click="startCreating">我也要创作</button>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
	  baseurl:getApp().globalData.baseURL,
      favoriteTitle: '',
      favoriteAuthor: '',
      favoriteContent: [],
      favoriteContentStr: '',
      favoriteAnalysis: '',
	  collectionID: '',
      ciID: '',
      token: '',
    };
  },
  onLoad(options) {
    this.favoriteTitle = decodeURIComponent(options.cipai);
    this.favoriteAuthor = decodeURIComponent(options.author);
    this.favoriteContent = JSON.parse(decodeURIComponent(options.content));
    this.favoriteAnalysis = decodeURIComponent(options.comment) || '';
    // 将内容数组拼接成字符串，每句后添加换行符
    this.favoriteContentStr = this.favoriteContent.join('\n');
	this.collectionID = options.collectionID;
    this.ciID = options.ciID;
    // 从本地存储中获取 token
    this.token = uni.getStorageSync('userToken') || '';
    if (!this.token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      });
    }
	console.log('获取到的token:', this.token);
  },
  methods: {
    startCreating() {
      // 开始创作逻辑
    },
    // 保存批注方法
    saveComment() {
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/modifyCollectionComment?collectionID=${this.collectionID}&ciID=${this.ciID}&comment=${encodeURIComponent(this.favoriteAnalysis)}&token=${this.token}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: res.data.message || '批注保存成功',
              icon: 'success',
            });
          } else {
            uni.showToast({
              title: res.data.message || '批注保存失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
        },
      });
    },
  },
};
</script>

<style>
.fD-container { padding: 16px; }
.favorite-title { font-size: 18px; font-weight: bold; }
.favorite-author { font-size: 14px; color: grey; margin-top: 4px; }

.favorite-content-box {
  margin-top: 20px;
  background-color: #333; /* 深灰色背景 */
  padding: 12px;
  border-radius: 8px;
}
.favorite-content {
  font-size: 16px; /* 比作品赏析大 */
  color: white;
  white-space: pre-wrap; /* 支持换行 */
}

.gap {
  height: 8px; /* 调整缝隙高度 */
  background-color: white;
}

.favorite-analysis-box {
  background-color: #ddd; /* 浅灰色背景 */
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
}
.favorite-analysis {
  font-size: 14px; /* 较小字体 */
  color: black;
  width: 100%;
  height: 100px;
  border: none;
  resize: none;
  overflow-y: auto; /* 使文本域可上下滚动 */
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.button-container button {
  margin: 10px 0;
  padding: 8px;
  width: 45%; /* 调整按钮宽度以适应容器 */
}
</style>
