<template>
  <view class="container">
    <view v-if="UserWork">
      <view class="UserWork-header-container">
        <text class="UserWork-title">{{ UserWork.cipai[0] }} · {{ UserWork.title }}</text>
      </view>

      <!-- 作品内容容器 -->
      <view class="UserWork-content-container">
        <view v-for="(item, index) in contentArray" :key="index" class="UserWork-description">
            {{ item }}
          </view>
      </view>

      <!-- 操作按钮容器 -->
      <view class="UserWork-footer-container">
        <button @click="deleteUserWork" class="button delete-button">修改作品</button>
        <button @click="featureUserWork" class="button feature-button">推荐作品</button>
      </view>
    </view>

    <view v-else>
      <text class="error-message">加载作品失败，请稍后再试。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      UserWork: null, 
	  token:'',
	  formatData:{
	  		  format:{
	  			  author:'',
	  			  desc: '',
	  			  sketch: '',
	  			  tunes: []
	  		  }
	  },
	  contentArray : [],
    };
  },
  onLoad(options) {
    const workData = options.UserWork ? JSON.parse(decodeURIComponent(options.UserWork)) : null;
    this.UserWork = workData;
	this.token = uni.getStorageSync('userToken');
	this.fetchFormatData(this.UserWork.cipai[0], this.UserWork.cipai[1]);
  },
  methods: {
    fetchFormatData(cipaiName, formatNum) {
      let baseurl = getApp().globalData.baseURL;
      const url = `${baseurl}/getFormat?cipai_name=${encodeURIComponent(cipaiName)}&format_num=${formatNum}`;
      uni.request({
        url: url,
        method: 'GET',
        success: (res) => {
          console.log('Data received:', res.data); // 打印返回的数据
          this.formatData = res.data;
          console.log('tunes:', this.formatData.format.tunes);
    	  this.getContentArray();
    	  console.log('cicontent',this.contentArray);
        },
        fail: (err) => {
          console.error('Failed to fetch data:', err); // 打印错误信息
        }
      });
    },
    getContentArray() {
        let contentStr = '';
        // 遍历填词框的每一行
        this.formatData.format.tunes.forEach((tune, index) => {
          // 获取每个 tune 的文本内容
          const tuneContent = this.UserWork.content[index] || '';
          // 将 tuneContent 添加到 content 字符串中
          contentStr += tuneContent;
          
          // 根据 rhythm（韵、句、读）添加标点符号
          if (tune.rhythm === '读') {
            contentStr += '、';  // "读" 音节之间用 "、"
          } else if (tune.rhythm === '句') {
            contentStr += '，';  // "句" 用逗号 "，"
          } else if (tune.rhythm === '韵') {
            contentStr += '。';  // "韵" 用句号 "。"
          }
        });
    
        // 使用正则表达式根据标点符号分割 content 字符串
        let contentArray = contentStr.split(/([，。、])/).filter(item => item.trim() !== '');
    
        // 将标点符号加入到每一项的后面
        for (let i = 0; i < contentArray.length; i++) {
          // 如果当前项是标点符号，前一个元素拼接上标点符号
          if (['、', '，', '。'].includes(contentArray[i])) {
            contentArray[i - 1] += contentArray[i];
            contentArray.splice(i, 1);  // 删除标点符号
            i--;  // 由于删除了元素，需要调整索引
          }
        }
        this.contentArray = contentArray;
      },
	  featureUserWork(){},//发布逻辑
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

.UserWork-header-container,
.UserWork-content-container {
  margin-bottom: 24px; 
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

.UserWork-header-container {
  display: flex;
  flex-direction: column;
  gap: 4px; 
}

.UserWork-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.UserWork-content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.UserWork-description {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.UserWork-footer-container {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.button {
  padding: 5px 20px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #333;
  color: #fff;
}

.delete-button {
  background-color: #555;
  color: #fff;
}

.feature-button {
  background-color: #777;
  color: #fff;
}

.button:hover {
  background-color: #111;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
}
</style>
