<template>
  <view class="fD-container">
	  
	<view class="title-header">
		<text class="favorite-title">{{ favoriteTitle }}·{{getFirstSentence(favoriteContentStr)}}\n</text>
		<text class="favorite-author">{{ favoriteAuthor }}</text>
    </view>
    <!-- 作品原文框 -->
    <view class="favorite-content-box">
      <text class="favorite-content">{{ favoriteContentStr }}</text>
    </view>
    
    <!-- 作品赏析框 -->
    <view class="favorite-analysis-box">
	  <text class="analysis-title">批注</text>
      <textarea v-model="favoriteAnalysis" class="favorite-analysis" placeholder="请输入批注"></textarea>
    </view>
    
    <!-- 按钮容器 -->
    <view class="button-container">
      <button @click="saveComment">保存批注</button>
      <button @click="sendCollection">分享收藏</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
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
    sendCollection() {
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/publishDynamic`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          token: this.token,
          Type: 2,
          _id: this.collectionID,
          _id2: this.ciID,
        },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: '已发布动态',
              icon: 'success',
            });
          } else {
            uni.showToast({
              title: res.data.message || '发布失败',
              icon: 'none',
            });
            console.error('API 返回错误:', res.data);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
          });
          console.error('API 请求失败:', err);
        },
      });
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
              title:  '批注保存成功',
              icon: 'success',
            });
          } else {
            uni.showToast({
              title:  '批注不能为空！',
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
.fD-container { 
  padding: 16px; 
}
.favorite-title { 
  font-size: 18px; 
  font-weight: bold; 
}
.favorite-author { 
  font-size: 14px; 
  color: grey; 
  margin-top: 4px; 
}

.favorite-content-box {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.favorite-content {
  font-size: 16px;
  color: #666;
  line-height: 2.5;
  justify-content: center;
}

.favorite-analysis-box {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.analysis-title{
	font-size: 16px;
	text-decoration: underline;
	line-height: 3.0;
	font-weight: bold; 
}
.favorite-analysis {
  font-size: 14px; /* 较小字体 */
  color: #444;
  width: 100%;
  height: 100px;
  line-height: 1.5;
  border: none;
  resize: none;
  overflow-y: auto; /* 使文本域可上下滚动 */
}

.bottom-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.bottom-btn {
  width: 80%;
  padding: 6px 0;
  margin-left: 10px;
  margin-right: 20px;
  background: linear-gradient(145deg, #ffffff, #efefef);
  border: none;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  color: #333;
  box-shadow: 2px 2px 8px rgba(107, 107, 107, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.bottom-btn:hover {
  background: linear-gradient(145deg, #e0e0e0, #f8f8f8);
  transform: translateY(-3px);
  box-shadow: 2px 6px 15px rgba(0, 0, 0, 0.15);
}

.bottom-btn:active {
  transform: translateY(1px);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.bottom-btn:focus {
  outline: none;
}
</style>
