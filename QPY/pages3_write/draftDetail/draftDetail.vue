<template>
  <view class="container">
    <view v-if="draft">
      <!-- 标题容器 -->
      <view class="draft-header-container">
        <text class="drafts-title">{{ draft.cipai[0] }} · {{ draft.title }}</text>
      </view>

      <!-- 内容容器 -->
      <view class="draft-content-container">
        <view v-for="(item, index) in contentArray" :key="index" class="draft-description">
          {{ item }}
        </view>
      </view>


      <!-- 按钮容器 -->
      <view class="draft-footer-container">
        <button @click="editDraft" class="button edit-button">继续创作</button>
        <button @click="deleteDraft" class="button delete-button">删除草稿</button>
      </view>
    </view>

    <view v-else>
      <text class="error-message">加载草稿失败，请稍后再试。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      draft: null, 
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
    const draftData = options.draft ? JSON.parse(decodeURIComponent(options.draft)) : null;
    this.draft = draftData;
	this.token = uni.getStorageSync('userToken');
	this.fetchFormatData(this.draft.cipai[0], this.draft.cipai[1]);
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
	      const tuneContent = this.draft.content[index] || '';
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
    editDraft() {
      uni.navigateTo({
        url: `/pages3_write/draftDetail/continueWrite?draft=${encodeURIComponent(JSON.stringify(this.draft))}`,
      });
    },
    deleteDraft() {
        let baseurl = getApp().globalData.baseURL;
        const url = `${baseurl}/delDraft`;
        console.log('Sending request to:', url);
        console.log('Using token:', this.token);
		console.log('ciID:', this.draft._id);
        uni.request({
          url: url,
          method: 'DELETE',
          data: {
			token: this.token,
            draftID: this.draft._id, 
          },
          success: (res) => {
            console.log('Response data:', res.data);
            if (res.statusCode === 200) {
              console.log('草稿删除成功！');
			   // 显示删除成功的通知
			  uni.showToast({
				title: '删除成功',
				icon: 'success', // 显示成功图标
				duration: 1500,  // 持续时间
				success: () => {
				  // 在通知显示后延迟 0.5 秒再执行返回操作
				  setTimeout(() => {
					uni.navigateBack({
					  delta: 1,  // 返回上一个页面
					  success: () => {
						// 通知前一个页面进行刷新
						uni.$emit('refreshDrafts');  // 通过事件通知前一页刷新草稿列表
					  }
					});
				  }, 500);  // 延迟 500 毫秒（0.5 秒）
				}
			  });
            } else {
              console.error('删除失败:', res.statusCode);
            }
          },
          fail: (err) => {
            console.error('请求失败:', err);
          }
        });
      },
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

.draft-header-container,
.draft-content-container {
  margin-bottom: 24px; 
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

.draft-header-container {
  display: flex;
  flex-direction: column;
  gap: 4px; 
}

.drafts-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}


.draft-content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.draft-description {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.draft-footer-container {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.button {
  padding: 5px 30px;
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

.button:hover {
  background-color: #111;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
}
</style>
