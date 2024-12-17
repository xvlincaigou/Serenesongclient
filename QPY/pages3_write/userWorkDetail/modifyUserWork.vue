<template>
  <view class="container">
    <!-- cipaiName 区域添加按钮 -->
    <view class="cipai-header">
      <text class="cipai-name">{{ cipaiName }}</text>
      <view class="sidebar-toggle" @click="toggleSidebar">
        <view class="toggle-square">平</view>
      </view>
    </view>

    <!-- 侧边栏 -->
    <view class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <view class="sidebar-header">
        <text>平水韵</text>
        <view class="sidebar-close" @click="toggleSidebar">返回</view>
      </view>
      <view class="sidebar-content">
        <!-- 搜索区域 -->
        <view class="search-container">
          <input 
            class="search-input" 
            type="text"
            placeholder="请输入单个汉字"
            maxlength="1"
          />
          <button 
            class="search-button" 
            @click="performSearch"
          >
            搜索
          </button>
        </view>
        
        <!-- 提示文字 -->
        <view v-if="!hasSearched" class="search-tip">
          可输入单个汉字查询平水韵
        </view>

        <!-- 搜索结果展示区 -->
        <scroll-view 
          v-else-if="searchResults && searchResults.length > 0" 
          class="search-results" 
          scroll-y
        >
          <view 
            v-for="(result, index) in searchResults" 
            :key="index" 
            class="result-item"
          >
            <view class="result-header">
              <text class="first-level">{{ result.firstLevel }}</text>
              <text class="second-level">{{ result.secondLevel }}</text>
            </view>
            <view class="character-list">
              <text 
                v-for="(char, charIndex) in result.chars" 
                :key="charIndex"
                :class="{ 'highlight': char === searchText }"
                class="character"
              >
                {{ char }}
              </text>
            </view>
          </view>
        </scroll-view>

        <!-- 无搜索结果提示 -->
        <view v-else-if="hasSearched" class="no-result">
          未找到相关字
        </view>
      </view>
    </view>
    
    <!-- 词的标题输入区域 -->
    <view class="ci-title-container">
      <view class="underline"></view>
      <input 
        class="ci-title-input" 
        placeholder="请输入词的题目" 
        v-model="ciTitle" 
        @input="onCiTitleInput"
      />
    </view>
    
    <!-- 填词区域 -->
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
            :class="{ 'invalid-border': validationResults[globalIndex(lineIndex, index)] === false }" 
            :style="{ 'border-color': validationResults[globalIndex(lineIndex, index)] === false ? 'red' : (tune.rhythm === '韵' ? '#555' : '#d3d3d3') }"
          >
            <input 
              class="tune-input" 
              :value="ciContent[globalIndex(lineIndex, index)]"
              @input="(e) => onTuneInput(globalIndex(lineIndex, index), e)"
              @focus="onTuneFocus(globalIndex(lineIndex, index))"
              :id="'tune-input-' + globalIndex(lineIndex, index)"
            />
          </view>
          <!-- 标点符号 -->
          <text v-if="tune.rhythm === '读'">、</text>
          <text v-else-if="tune.rhythm === '句'">，</text>
          <text v-else-if="tune.rhythm === '韵'">。</text>
		  <text v-else-if="tune.rhythm === '叶'">。</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <button class="bottom-btn" @click="modifyUserWork">完成作品修改</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  UserWork:{},
      isSidebarOpen: false,
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
      ciContent: [],
      focusedIndex: 0,
      maxItemsPerLine: 10,
      tempInput: [],
      searchText: '',
      searchResults: [],
      hasSearched: false,
	  pingshuiyun: {}, 
	  validationResults: [],
    };
  },
  
  computed: {
    lines() {
      const lines = [];
      let currentLine = [];
      this.formatData.format.tunes.forEach((tune) => {
        currentLine.push(tune);
        if (tune.rhythm === '句' || tune.rhythm === '韵' || tune.rhythm === '叶' || currentLine.length === this.maxItemsPerLine) {
          lines.push(currentLine);
          currentLine = [];
        }
      });
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      return lines;
    }
  },

  onLoad(options) {
	console.log("Options received:", options);
    const UserWorkData = options.UserWork ? JSON.parse(decodeURIComponent(options.UserWork)) : {};
    
    // 检查传递的数据
    console.log("Received data:", UserWorkData);
  
    // 更新当前页面的 state
    this.UserWork = UserWorkData || {};
    this.cipaiName = UserWorkData.cipai ? UserWorkData.cipai[0] : '';
    this.formatNum = UserWorkData.cipai ? UserWorkData.cipai[1] : 0;
    this.ciTitle = UserWorkData.title || '';
    this.token = uni.getStorageSync('userToken');
    this.pingshuiyun = uni.getStorageSync('pingshuiyun') || {};
     if (UserWorkData.content && Array.isArray(UserWorkData.content)) {
            let tmp = [];
            UserWorkData.content.forEach(sentence => {
                const characters = sentence.split('').filter(char => !['，', '。', '、'].includes(char)); // 拆分每句话并过滤标点
                tmp = tmp.concat(characters);
            });
            this.ciContent = tmp;
	}
	this.fetchFormatData(this.cipaiName, this.formatNum);
  },

  
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    globalIndex(lineIndex, index) {
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
          this.formatData = res.data;
          this.tempInput = this.ciContent;
		  this.validationResults = Array(this.ciContent.length).fill(true); // 初始化验证结果
		  this.runCheck();
        },
        fail: (err) => {
          console.error('Failed to fetch data:', err);
        }
      });
    },
	
	onInputBlur(e) {
      // 保存输入值
      this.currentSearchValue = e.detail.value;
    },

    performSearch() {
      // 使用uni.createSelectorQuery获取输入值
      uni.createSelectorQuery()
        .select('.search-input')
        .fields({
          properties: ['value']
        })
        .exec(res => {
          const searchText = res[0] ? res[0].value : '';

          if (!searchText) {
            uni.showToast({
              title: '请输入要搜索的汉字',
              icon: 'none'
            });
            return;
          }

          this.hasSearched = true;
          this.searchResults = [];

          try {
            // 获取平水韵数据
            const pingshuiyun = uni.getStorageSync('pingshuiyun');
            const yunshu = uni.getStorageSync('yunshu');
            
            if (!pingshuiyun || !yunshu || !yunshu.rhymes || !yunshu.rhymes[0]) {
              console.error('数据获取失败');
              return;
            }

            // 在pingshuiyun中查找输入的汉字
            const charData = pingshuiyun.rhymes[0][searchText];
            if (!charData) {
              uni.showToast({
                title: '未找到相关字',
                icon: 'none'
              });
              return;
            }

            // 处理每个匹配的韵部信息
            const results = [];
            charData.forEach(item => {
              const tone = item.Tone;
              const rhyme = item.Rhyme;
              
              // 在yunshu中查找对应的字列表
              if (yunshu.rhymes[0][tone] && yunshu.rhymes[0][tone][rhyme]) {
                results.push({
                  firstLevel: tone,
                  secondLevel: rhyme,
                  chars: yunshu.rhymes[0][tone][rhyme]
                });
              }
            });

            this.searchResults = results;
            
            // 如果没有找到结果，显示提示
            if (results.length === 0) {
              uni.showToast({
                title: '未找到相关字',
                icon: 'none'
              });
            }
          } catch (e) {
            console.error('搜索过程出错:', e);
            uni.showToast({
              title: '搜索出错，请重试',
              icon: 'none'
            });
          }
        });
    },

    onCiTitleInput(e) {
      this.ciTitle = e.detail.value;
    },

    onTuneFocus(index) {
      this.focusedIndex = index;
    },

    // 处理输入
    onTuneInput(index, event) {
      const inputValue = event.detail.value;
      const chars = inputValue.split('');
      
      // 如果是删除操作（输入值为空）
      if (inputValue === '') {
        this.$set(this.ciContent, index, '');
        
        // 如果不是第一个输入框，将焦点移到前一个输入框
        if (index > 0) {
          this.focusedIndex = index - 1;
          this.focusNextInput(index - 1);
        }
        return;
      }

      // 处理输入的字符
      for (let i = 0; i < chars.length; i++) {
        const targetIndex = index + i;
        
        // 确保目标索引在有效范围内
        if (targetIndex < this.ciContent.length) {
          this.$set(this.ciContent, targetIndex, chars[i]);
        }
      }

      // 计算下一个焦点位置
      const nextIndex = index + chars.length;
      if (nextIndex < this.ciContent.length) {
        this.focusedIndex = nextIndex;
        this.focusNextInput(nextIndex);
      }
    },
	
	check(ciContentArray, cipai){
	  console.log('content:', ciContentArray);
      let isValid = [];
      let possibleRhythms = []; // 截止到目前位置可以使用的韵
      const tunes = cipai.format.tunes;
	  console.log('tunes:', tunes);
      
      for (let i = 0; i < ciContentArray.length; ++i) {
        const char = ciContentArray[i];
		console.log('char:', char);
        if (!char) {
          isValid.push(true);
          continue;
        }
        // 检查平仄是否符合
        const tune = this.pingshuiyun.pingze[0][char];
		console.log('tune:', tune);
        const exactTune = tunes[i]['tune'];
		console.log('exactTune:', exactTune);
		if (exactTune === '中') {
		  isValid.push(true);
		  continue;
		}
        if (tune != '多' && tune != exactTune) {
          isValid.push(false);
          continue;
        }
		console.log(this.pingshuiyun.pingze[0]);
        
        // 检查押韵是否符合
        const rhythms = this.pingshuiyun.rhymes[0][char] ? this.pingshuiyun.rhymes[0][char].map(entry => entry.Rhyme) : [];
        const rhythmType = tunes[i]['rhythm'];
        if (rhythmType && rhythmType === '韵') {
          if (rhythms.length === 0) {
            isValid.push(false);
            continue;
          }
          if (possibleRhythms.length === 0) {
            possibleRhythms = rhythms;
          } else {
            // 求交集
            const consistentRhythms = possibleRhythms.filter(rhythm => rhythms.includes(rhythm));
            if (consistentRhythms.length === 0) {
              isValid.push(false);
              continue;
            } else {
              possibleRhythms = consistentRhythms;
            }
          }
        }
        isValid.push(true);
      }
	  console.log('check:', isValid);
      return isValid;
    },
	
	runCheck() {
      this.validationResults = this.check(this.ciContent, this.formatData);
    },

    // 处理输入
    onTuneInput(index, event) {
      const inputValue = event.detail.value;
      const chars = inputValue.split('');
      
      // 更新 ciContent
      if (inputValue === '') {
        this.$set(this.ciContent, index, '');
        
        // 如果不是第一个输入框，将焦点移到前一个输入框
        if (index > 0) {
          this.focusedIndex = index - 1;
          this.focusNextInput(index - 1);
        }
      } else {
        for (let i = 0; i < chars.length; i++) {
          const targetIndex = index + i;
          if (targetIndex < this.ciContent.length) {
            this.$set(this.ciContent, targetIndex, chars[i]);
          }
        }
        const nextIndex = index + chars.length;
        if (nextIndex < this.ciContent.length) {
          this.focusedIndex = nextIndex;
          this.focusNextInput(nextIndex);
        }
      }

      // 每次输入或删除后调用 check 函数
      this.runCheck();
    },

    // 聚焦到指定索引的输入框
    focusNextInput(index) {
      // 使用 nextTick 确保 DOM 更新后再聚焦
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select(`#tune-input-${index}`).node().exec((res) => {
          if (res[0] && res[0].node) {
            res[0].node.focus();
          }
        });
      });
    },

    // 清空某一行的内容
    clearLine(lineIndex) {
      const startIndex = this.globalIndex(lineIndex, 0);
      const endIndex = this.globalIndex(lineIndex, this.lines[lineIndex].length - 1);
      
      // 清空该行所有输入框的内容
      for (let i = startIndex; i <= endIndex; i++) {
        this.$set(this.ciContent, i, '');
      }
      
      // 焦点回到该行第一个输入框
      this.focusedIndex = startIndex;
      this.focusNextInput(startIndex);
	  
	  this.runCheck();
    },

    getContentArray() {
      let contentStr = '';
    
      this.formatData.format.tunes.forEach((tune, index) => {
        const tuneContent = this.ciContent[index] || '';
        contentStr += tuneContent;
        
        if (tune.rhythm === '读') {
          contentStr += '、';
        } else if (tune.rhythm === '句') {
          contentStr += '，';
        } else if (tune.rhythm === '韵') {
          contentStr += '。';
        } else if (tune.rhythm === '叶') {
          contentStr += '。';
        }
      });
    
      let contentArray = contentStr.split(/([，。、])/).filter(item => item.trim() !== '');
    
      for (let i = 0; i < contentArray.length; i++) {
        if (['、', '，', '。'].includes(contentArray[i])) {
          contentArray[i - 1] += contentArray[i];
          contentArray.splice(i, 1);
          i--;
        }
      }
    
      return contentArray;
    },

    checkContentCompleted() {
      for (let i = 0; i < this.ciContent.length; i++) {
        if (!this.ciContent[i].trim()) {
          uni.showToast({
            title: '你的词还没创作完成，不能加入作品集哦！',
            icon: 'none'
          });
          return false;
        }
      }
      return true;
    },
	modifyUserWork() {
		
	  if (!this.checkContentCompleted()) {
		return;  // 如果没有完成创作，直接返回
	  }
	  const contentArray = this.getContentArray();
	  console.log('contentArr:', contentArray);
	  const UserWorktData = {
	    title: this.ciTitle || '未命名', 
	    cipai: [this.cipaiName, this.formatNum], 
	    is_public: false, 
	    content: contentArray,
	    prologue: '',
	    tags: []
	  };
	  const requestData = {
	    token: this.token,
		workID : this.UserWork._id,
	    work: UserWorktData
	  };
	  console.log('Request Data:', JSON.stringify(requestData));
	  const baseurl = getApp().globalData.baseURL;
	  
	  uni.request({
	    url: `${baseurl}/modifyWork`,
	    method: 'POST',
	    data: requestData,
	    success: (res) => {
	      if (res.data.message === 'Updated successfully') {
	        uni.showToast({
	          title: '创作修改成功',
	          icon: 'success',
	          duration: 1500,  // 持续时间
	          success: () => {
	            // 在通知显示后延迟 0.5 秒再执行返回操作
	            setTimeout(() => {
	              uni.switchTab({
	                url: `/pages/write/index/index`
	              });
	            }, 500);  // 延迟 500 毫秒（0.5 秒）
	          }
	        });
	      } else {
	        uni.showToast({
	          title: '修改失败，请重试',
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

  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #fefdf9;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.cipai-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}

.cipai-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.sidebar-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.toggle-square {
  width: 22px;
  height: 22px;
  text-align: center;
  color: #fff;
  background-color: #d0d0d0;
  border-radius: 10px;
}

.toggle-square:active{
	background:  linear-gradient(145deg, #defbff, #77b9ff);
}

.sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar-title{
	font-size: 16px;
	font-weight: bold; 
}

.sidebar-content {
  flex: 1;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-container {
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 10px;
}

.search-input {
  flex: 1;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 14px;
}

.search-button {
  width: auto;
  min-width: 80px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color:  #aaaaaa;
  background-color: #fefdf9;
  border: none;
  border-radius: 4px;
  padding: 0 15px;
}

.search-tip {
  color: #999;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  padding: 0 15px;
}

.search-results {
  margin-top: 15px;
  height: calc(100vh - 150px);
  padding: 0 15px;
}

.result-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.no-result {
  text-align: center;
  color: #999;
  margin-top: 20px;
  font-size: 14px;
}

.first-level {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.second-level {
  color: #666;
}

.character-list {
  line-height: 1.6;
}

.character {
  display: inline-block;
  margin-right: 8px;
  color: #333;
}

.highlight {
  color: #5677fc;
  font-weight: bold;
}

.sidebar-open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.sidebar-close {
  cursor: pointer;
  color: #666;
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

.invalid-border {
  border-color: red !important;
}

.clear-button {
  background: linear-gradient(145deg, #f0f0f0, #e4e4e4); 
  color: #333; 
  width: 6px; 
  height: 27px; 
  border: none;
  border-radius: 50%; 
  cursor: pointer;
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease; 
}

.clear-button:active {
  background:  linear-gradient(145deg, #ff5938, #ffae99); 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
}

.clear-button:before {
  content: "×"; 
  font-size: 16px;
  font-weight: bold;
}


.bottom-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.bottom-btn {
  width: 100%;
  padding: 6px 0;
  margin-left: 10px;
  margin-right: 20px;
  background: linear-gradient(145deg, #f8f8f8, #e8e8e8);
  border: none;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  color: #333;
  font-weight: 500;
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


@media (max-width: 600px) {
  .tune-box {
    width: 30px;
    height: 30px;
	border-radius: 5px;
  }
}
</style>