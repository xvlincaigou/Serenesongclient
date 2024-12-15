<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input
        placeholder="搜索词牌,也试试搜索词和词人寻找灵感!"
        v-model="searchText"
        @focus="isFocused = true"
        @blur="handleBlur"
        autocomplete="on"
      />
    
      <!-- 搜索结果下拉框 -->
      <view class="search-dropdown" v-if="isFocused && searchText">
        <view
          class="dropdown-item"
          v-for="(item, index) in searchOptions"
          :key="index"
          @click="navigateToList(item.option)"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐词牌展示区域 -->
    <view class="recommendation-container">
      <view class="title-container">
        <view class="triangle" @click="showRefreshLogic">今日推荐词牌</view>
      </view>

      <!-- 词牌矩形展示 -->
      <view class="tags-container">
        <view class="tag-item" v-for="tag in displayTags" :key="tag.name" @click="navigateToDetail(tag.name)">
          <view class ="tag-o"></view>
		  <view class="tag-title">{{ tag.name }}</view>
		  <view class ="tag-line"></view>
          <view class="tag-description">{{ tag.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      searchText: '',
      isFocused: false,
      tags: [
       { name: '满江红', description: '激昂深沉\n英雄气概\n人生感悟' },
       { name: '清平乐', description: '简洁明快\n安静和谐\n悠闲自得' },
       { name: '江城子', description: '节奏鲜明\n春日风光\n离别情愁' },
       { name: '念奴娇', description: '旋律婉转\n情感细腻\n思念爱恋' },
       { name: '浣溪沙', description: '短小精悍\n轻松愉快\n美好瞬间' },
       { name: '虞美人', description: '感伤悲哀\n失恋痛苦\n告别离愁' },
       { name: '菩萨蛮', description: '异域风情\n爱情缠绵\n美人多姿' },
       { name: '蝶恋花', description: '婉约细腻\n爱情离愁\n情感缠绵' },
       { name: '西江月', description: '清新流畅\n抒情言志\n自然风光' },
       { name: '青玉案', description: '格调高雅\n怀古思今\n情感深沉' },
       { name: '满庭芳', description: '深情款款\n追忆往昔\n感慨人生' },
       { name: '渔家傲', description: '豪放洒脱\n江湖风情\n壮志凌云' },
       { name: '采桑子', description: '轻盈优美\n田园风光\n思乡之情' },
       { name: '临江仙', description: '缠绵悱恻\n思念故人\n月夜情怀' },
       { name: '一剪梅', description: '感慨人生\n离别相思\n孤独寂寞' },
       { name: '雨霖铃', description: '离愁别绪\n秋夜凄美\n情深意长' },
       { name: '定风波', description: '乐观豁达\n人生哲理\n旷达胸襟' },
       { name: '南乡子', description: '清丽婉约\n思乡情怀\n风景描写' },
       { name: '行香子', description: '绚丽多彩\n描绘自然\n抒情言志' },
       { name: '卜算子', description: '简洁凝练\n深情款款\n真挚情感' },
       { name: '鹧鸪天', description: '乡愁情怀\n岁月沧桑\n人生感悟' },
       { name: '浪淘沙', description: '豪迈奔放\n历史感慨\n时光流逝' },
       { name: '玉楼春', description: '青春年华\n爱情喜悦\n美好憧憬' },
       { name: '忆江南', description: '怀念故乡\n风景优美\n思乡之情' },
       { name: '点绛唇', description: '短小精致\n情感浓烈\n含蓄隽永' },
       { name: '诉衷情', description: '深情告白\n思念之情\n情深意切' },
       { name: '破阵子', description: '雄壮豪迈\n战争场景\n英雄气概' },
       { name: '好事近', description: '喜悦心情\n美好祝愿\n幸福憧憬' },
       { name: '醉花阴', description: '秋日思念\n细腻感伤\n孤独寂寞' },
       { name: '相见欢', description: '离合悲欢\n情感纠葛\n相思之苦' },
       { name: '武陵春', description: '春日景象\n思念故人\n感慨人生' },
       { name: '贺新郎', description: '雄浑壮阔\n抱负理想\n人生豪情' },
       { name: '望海潮', description: '壮美风光\n豪情壮志\n胸怀天下' },
       { name: '玉蝴蝶', description: '优美浪漫\n爱情憧憬\n情感缠绵' }
      ],
      filteredResults: [],
	  displayTags: []
    };
  },
  computed: {
    searchOptions() {
      if (!this.searchText) return [];
      return [
        { label: `与"${this.searchText}"有关的词人`, option: 'author' },
        { label: `与"${this.searchText}"有关的词`, option: 'ci' },
        { label: `与"${this.searchText}"有关的词牌`, option: 'cipai' },
      ];
    },
  },
  methods: {
	// 搜索逻辑
	navigateToList(option) {
	  uni.navigateTo({
	    url: `/pages1_search/searchresultList/searchresultList_${option}?keyword=${this.searchText}`,
	  });
	},
	handleBlur() {
	  setTimeout(() => {
	    this.isFocused = false;
	  }, 100);
	},
	// 所有推荐的逻辑
	
	showRefreshLogic() {
		 this.refreshRecommendations(); // 更新推荐列表
		 uni.showToast({
		   title: '已刷新今日推荐',
		   icon: 'none',
		   duration: 2000
		 });
	},
	
	refreshRecommendations() {
         const shuffled = [...this.tags].sort(() => 0.5 - Math.random());
         this.displayTags = shuffled.slice(0, 6); // 随机选择8个词牌
    },
	
     navigateToDetail(name) {
	  this.fetchCipaiDetails(name).then(cipai => {
		const cipaiDetail = {
		  name: name,
		  desc: cipai.desc,
		  formats: cipai.formats
		};
		uni.navigateTo({
		  url: `/pages_info/info_cipai/info_cipai?cipai=${encodeURIComponent(JSON.stringify(cipaiDetail))}`
		});
	  }).catch(error => {
		console.error('Failed to fetch cipai details:', error);
		uni.showToast({
		  title: '获取数据失败，请稍后再试',
		  icon: 'none'
		});
	  });
	},
	fetchCipaiDetails(name) {
	  return new Promise((resolve, reject) => {
		uni.request({
		  url: `http://124.221.16.68:8080/search?keyword=${encodeURIComponent(name)}&option=cipai`,
		  method: 'GET',
		  success: (res) => {
			if (res.statusCode === 200 && res.data.matched_cipai[name]) {
			  resolve(res.data.matched_cipai[name]);
			} else {
			  reject(new Error('No data found'));
			}
		  },
		  fail: (err) => {
			reject(err);
		  }
		});
	  });
	}
	},
	mounted() {
       this.refreshRecommendations(); // 组件挂载时调用，确保一开始就有随机词牌显示
     }
   };
</script>


<style scoped>
.container {
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-bar {
  width:100%;
  position: relative;
}

input {
  width: 95%;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 12px;
  background-color: #ffffff;
}

.search-dropdown {
  position: absolute;
  top: 42px; 
  left: 2px;
  right: 2px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  max-height: 200px;
  border-radius: 2px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item text {
  font-size: 16px;
  color: #333333;
}

.search-results {
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
}

.result-item {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.recommendation-container {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-top: 40px;
  position: relative;
}

.title-container {
  display: flex;
  justify-content: center;
  margin-up: 25px;
  margin-bottom: 20px;
}

.triangle {
  width: 150px;
  height: 40px;
  background-color: #eaeaea;
  text-align: center;
  font-size: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tag-item {
  width: 50px;
  height: 170px;
  margin:12px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tag-o{
	width: 12px;
	height: 12px;
	margin-left:19px;
	margin-bottom: 8px;
	background-color: #ececec;
	border-radius:6px;
}
.tag-title {
  font-size: 14px;
  font-weight: bold;
}
.tag-line{
	width:50px;
	height: 1px;
	background-color: #a8a8a8;
	margin-top: 8px;
	margin-bottom: 18px;
}
.tag-description {
  font-size: 12px;
  color: #666;
  line-height: 25px;
  overflow: hidden;
}
</style>
