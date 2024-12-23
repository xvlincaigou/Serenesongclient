<template>
  <view class="container">
    <view class="drafts-list">
      <view v-if="drafts.length > 0">
        <view
          class="drafts-item"
          v-for="(draft, index) in drafts"
          :key="index"
          @click="navigateToDetail(draft)"
        >
          <view class="draft-header">
            <text class="drafts-title">
              {{ draft.cipai[0] }} · {{ draft.title }}
            </text>
            <text class="drafts-time">\n {{ formatDate(draft.created_at)}}</text> 
          </view>
        </view>
      </view>
      <view v-else class="no-drafts">
        <text>哎呀，没有草稿啊，试试去写写吧！</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userToken: '',
      drafts: [],
    };
  },
  onShow() {
    // 监听刷新草稿列表的事件
    uni.$on('refreshDrafts', this.refreshDraftList);
  },
  
  onUnload() {
    // 页面卸载时移除事件监听，避免内存泄漏
    uni.$off('refreshDrafts', this.refreshDraftList);
  },
  
  onLoad(options) {
    uni.getStorage({
      key: 'userToken',
      success: (res) => {
        this.userToken = res.data;
        // 在获取到token之后再调用fetchResults
        this.fetchResults();
      },
    });
  },
  methods: {
	refreshDraftList() {
	    this.fetchResults();  // 假设你有一个 fetchDrafts 方法来获取草稿数据
	  },
    fetchResults() {
      const baseurl = getApp().globalData.baseURL;
      uni.request({
        url: `${baseurl}/getMyWorks?token=${this.userToken}&kind=drafts`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.drafts = res.data.drafts || [];
          }
        }
      });
    },
    navigateToDetail(draft) {
      uni.navigateTo({
        url: `/pages3_write/draftDetail/draftDetail?draft=${encodeURIComponent(JSON.stringify(draft))}`,
      });
    },
	formatDate(dateString) {
	      const date = new Date(dateString);
	      const year = date.getFullYear();
	      const month = String(date.getMonth() + 1).padStart(2, '0');
	      const day = String(date.getDate()).padStart(2, '0');
	      return `${year}-${month}-${day}`;
	    },
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.drafts-list {
  padding: 16px;
}

.drafts-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drafts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drafts-title {
  font-size: 18px;
  font-weight: bold;
  color: #1b4965;
}

.drafts-time {
  font-size: 14px;
  color: #888888;
}

.no-drafts {
  padding: 12px;
  text-align: center;
  color: #999999;
}
</style>
