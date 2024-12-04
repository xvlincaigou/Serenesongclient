<template>
  <view class="container">
    <!-- 显示 cipaiName -->
    <text class="cipai-name">{{ cipaiName }}</text>
    
    <!-- 横线下的 ciTitle 输入框 -->
    <view class="ci-title-container">
      <view class="underline"></view>
      <input 
        class="ci-title-input" 
        placeholder="请输入词的题目" 
        v-model="ciTitle" 
        @input="onCiTitleInput"
      />
    </view>
    
    <!-- 渲染填词框按行分组 -->
    <view class="fill-words-container">
      <view 
        v-for="(line, lineIndex) in lines" 
        :key="lineIndex" 
        class="line"
      >
        <!-- 清空按钮 -->
        <button 
          class="clear-button" 
          @click="clearLine(lineIndex)"
        >
        </button>

        <view 
          v-for="(tune, index) in line" 
          :key="index" 
          class="tune-box-container"
        >
          <view class="tune-label">
            <text :class="{'bold-tune': tune.rhythm === '韵'}">{{ tune.tune }}</text>
          </view>
          <view 
            class="tune-box" 
            :style="{ 'border-color': tune.rhythm === '韵' ? '#555' : '#d3d3d3' }"
          >
            <input 
              class="tune-input" 
              v-model="ciContent[globalIndex(lineIndex, index)]" 
              @input="onTuneInput(globalIndex(lineIndex, index), $event)"
              @focus="focusedIndex = globalIndex(lineIndex, index)"
            />
          </view>
          <!-- 添加标点符号 -->
          <text v-if="tune.rhythm === '读'">、</text>
          <text v-else-if="tune.rhythm === '句'">，</text>
          <text v-else-if="tune.rhythm === '韵'">。</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <button class="bottom-btn" @click="addToCollection">加入作品集</button>
      <button class="bottom-btn" @click="addToDrafts">放入草稿箱</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  token: '',
      cipaiName: '',
      formatNum: 0,
      formatData: {
        format: {
          author: '',
          desc: '',
          sketch: '',
          tunes: []
        }
      },
      ciTitle: '',
      ciContent: [], // 用于保存填词框中的内容
      focusedIndex: null, // 当前聚焦的填字框索引
      maxItemsPerLine: 10, // 每行最多的元素数量（9个填词框+1个标点符号）
      tempInput: [], // 临时存储当前输入的每个字符
    };
  },
  computed: {
    // 将tunes按行分组，每行最多maxItemsPerLine个元素
    lines() {
      const lines = [];
      let currentLine = [];
      this.formatData.format.tunes.forEach((tune) => {
        currentLine.push(tune);
        if (tune.rhythm === '句' || tune.rhythm === '韵' || currentLine.length === this.maxItemsPerLine) {
          // 填满一行或遇到换行标识
          lines.push(currentLine);
          currentLine = [];
        }
      });
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      return lines;
    },
  },
  onLoad(options) {
    // 接收传递过来的参数
    this.cipaiName = decodeURIComponent(options.cipai_name) || '';
    this.formatNum = options.format_num || 0;
	this.token = uni.getStorageSync('userToken');
    console.log('cipaiName:', this.cipaiName);
    // 发起请求获取数据
    this.fetchFormatData(this.cipaiName, this.formatNum);
  },
  methods: {
    globalIndex(lineIndex, index) {
      // 计算在 ciContent 中的全局索引
      let count = 0;
      for (let i = 0; i < lineIndex; i++) {
        count += this.lines[i].length;
      }
      return count + index;
    },
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
          // 初始化 ciContent 数组，长度与填词框一致
          this.ciContent = Array(this.formatData.format.tunes.length).fill('');
          this.tempInput = Array(this.ciContent.length).fill(''); // 初始化临时储存器
        },
        fail: (err) => {
          console.error('Failed to fetch data:', err); // 打印错误信息
        }
      });
    },
    onCiTitleInput(e) {
      this.ciTitle = e.detail.value;
      // 这里可以添加其他逻辑，例如保存ciTitle
    },
    onTuneInput(index, event) {
      const inputValue = event.detail.value;
      
      // 更新 tempInput 为当前输入框的内容
      this.tempInput[index] = inputValue.split(''); // 每个字符单独存储

      console.log('Temp storage after input change:', this.tempInput);

      // 处理输入文字：如果有输入内容，就逐个填入相应的填词框
      if (this.tempInput[index].length > 0) {
        for (let i = 0; i < this.tempInput[index].length; i++) {
          const targetIndex = index + i;
          if (targetIndex < this.ciContent.length) {
            this.$set(this.ciContent, targetIndex, this.tempInput[index][i]);
          } else {
            break;
          }
        }
      } else {
        // 删除内容：如果删除时，删除一个字符
        if (inputValue === '') {
          // 删除时的逻辑：删除一个字，光标跳到前一个框
          this.$set(this.ciContent, index, '');
          this.focusedIndex = index - 1 >= 0 ? index - 1 : 0;
        }
      }
      console.log('Updated ciContent:', this.ciContent);
    },
    // 清空整行
    clearLine(lineIndex) {
      const startIndex = this.globalIndex(lineIndex, 0);
      const endIndex = this.globalIndex(lineIndex, this.lines[lineIndex].length - 1);
      for (let i = startIndex; i <= endIndex; i++) {
        this.$set(this.ciContent, i, '');
        this.$set(this.tempInput, i, ''); // 清空临时储存器中的对应位置
      }
      console.log('Temp storage after line cleared:', this.tempInput);
    },
  addToCollection() {
    if (!this.checkContentCompleted()) {
      return;  // 如果没有完成创作，直接返回
    }
  
    const contentArray = this.getContentArray();
    const draftData = {
      title: this.ciTitle || '未命名',  // 词的标题，默认为 '未命名'
      cipai: [this.cipaiName],  // 词牌名数组
      is_public: false,  // 默认不公开
      content: contentArray,  // 作为数组的内容
      prologue: '',  // 前言为空
      tags: []  // 标签为空
    };
  
    const requestData = {
      token: this.token,
      draft: draftData
    };
  
    const baseurl = getApp().globalData.baseURL;
  
    uni.request({
      url: `${baseurl}/putIntoDrafts`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: requestData,
      success: (res) => {
        if (res.data.message === 'Draft saved successfully') {
          // 获取返回的 draft_id
          const draftID = res.data.draft_id;
  
          // 调用 turnToFormal API，将草稿转为正式作品
          uni.request({
            url: `${baseurl}/turnToFormal`,
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            data: {
              token: this.token,
              draftID: draftID
            },
            success: (formalRes) => {
              if (formalRes.data.message === 'Work saved successfully') {
                // 提示用户加入作品集成功
                uni.showToast({
                  title: '已成功加入作品集',
                  icon: 'success'
                });
              } else {
                // 转为正式作品失败
                uni.showToast({
                  title: '加入作品集失败，请重试',
                  icon: 'none'
                });
              }
            },
            fail: (formalErr) => {
              // 请求失败处理
              uni.showToast({
                title: '失败，请检查网络',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: (err) => {
        // 请求失败处理
        uni.showToast({
          title: '失败，请检查网络',
          icon: 'none'
        });
      }
    });
  },

    addToDrafts() {
	  const contentArray = this.getContentArray();
	  console.log('contentArr:', contentArray);
      const draftData = {
		  title: this.ciTitle || '未命名', 
		  cipai: [this.cipaiName], 
		  is_public: false, 
		  content: contentArray,
		  prologue: '',
		  tags: []
		};
	  const requestData = {
		  token: this.token,
		  draft: draftData
	  };
	  console.log('Request Data:', JSON.stringify(requestData));
	  const baseurl = getApp().globalData.baseURL;
	        uni.request({
	          url: `${baseurl}/putIntoDrafts`,
	          method: 'POST',
			  data:requestData,
	          success: (res) => {
	            if (res.data.message === 'Draft saved successfully') {
	              uni.showToast({
	                title: '草稿保存成功',
	                icon: 'success'
	              });
	            } else {
	              uni.showToast({
	                title: '保存失败，请重试',
	                icon: 'none'
	              });
	            }
	          },
	          fail: () => {
	            uni.showToast({
	              title: '请求失败，请检查网络',
	              icon: 'none'
	            });
	          }
	        });
    },
	getContentArray() {
	    let contentStr = '';
	
	    // 遍历填词框的每一行
	    this.formatData.format.tunes.forEach((tune, index) => {
	      // 获取每个 tune 的文本内容
	      const tuneContent = this.ciContent[index] || '';
	      
	
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
	
	    return contentArray;
	  },
	  // 检查 ciContent 是否完全创作完成
	    checkContentCompleted() {
	      // 检查 this.ciContent 中是否有空字符串
	      for (let i = 0; i < this.ciContent.length; i++) {
	        if (!this.ciContent[i].trim()) {
	          uni.showToast({
	            title: '你的词还没创作完成，不能加入作品集哦！',
	            icon: 'none'
	          });
	          return false;  // 返回 false，表示内容不完整
	        }
	      }
	      return true;  // 所有内容都填写完成，返回 true
	    },
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
  overflow-y: auto; /* 允许上下滚动 */
  padding: 20px; /* 添加内边距以防止内容紧贴边缘 */
}

.cipai-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.ci-title-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.underline {
  height: 1px;
  background-color: #000;
  margin-bottom: 5px;
}

.ci-title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  padding: 5px 0;
  text-align: center;
}

.fill-words-container {
  width: 100%;
}

.line {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  position: relative;
}

.tune-box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 5px;
  position: relative;
}

.tune-label {
  margin-bottom: 5px;
}

.bold-tune {
  font-weight: bold;
}

.tune-box {
  width: 40px;
  height: 40px;
  border: 1px solid;
  box-sizing: border-box;
  margin-bottom: 2px;
}

.tune-input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 18px;
}

/* 清空按钮样式 */
.clear-button {
  background-color: #d3d3d3;
  color: white;
  width: 15px;
  height: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%); /* 按钮垂直居中 */
}

/* 底部按钮样式 */
.bottom-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.bottom-btn {
  background-color: #d3d3d3;
  color: black;
  width: 35%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .tune-box {
    width: 30px;
    height: 30px;
  }
}
</style>
