<template>
  <view class="container">
    <view v-if="draft">
      <!-- 标题容器 -->
      <view class="draft-header-container">
        <text class="drafts-title">{{ draft.cipai[0] }} · {{ draft.title }}</text>
      </view>

      <!-- 内容容器 -->
      <view class="draft-content-container">
        <view class="draft-description">{{ draft.content[0] }}</view>
      </view>

      <!-- 按钮容器 -->
      <view class="draft-footer-container">
        <button @click="editDraft" class="button edit-button">编辑草稿</button>
        <button @click="deleteDraft" class="button delete-button">删除草稿</button>
        <button @click="promoteToOfficial" class="button promote-button">转正草稿</button>
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
      draft: null, // 保存草稿的详细信息
    };
  },
  onLoad(options) {
    const draftData = options.draft ? JSON.parse(decodeURIComponent(options.draft)) : null;
    this.draft = draftData;
  },
  methods: {
    editDraft() {
      uni.navigateTo({
        url: `/pages3_write/write/write?draft=${encodeURIComponent(JSON.stringify(this.draft))}`,
      });
    },
    deleteDraft() {
      uni.showModal({
        title: '删除草稿',
        content: '确定删除此草稿吗？',
        success: (res) => {
          if (res.confirm) {
            const baseurl = getApp().globalData.baseURL;
            const userToken = uni.getStorageSync('userToken');
            uni.request({
              url: `${baseurl}/deleteDraft?token=${userToken}`,
              method: 'POST',
              data: { draftId: this.draft.id },
              success: (response) => {
                if (response.statusCode === 200) {
                  uni.showToast({
                    title: '草稿删除成功',
                    icon: 'success',
                  });
                  uni.navigateBack();
                } else {
                  uni.showToast({
                    title: '删除失败',
                    icon: 'none',
                  });
                }
              },
              fail: (err) => {
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none',
                });
              },
            });
          }
        },
      });
    },
    promoteToOfficial() {
      uni.showModal({
        title: '转正草稿',
        content: '确定将此草稿转正为正式作品吗？',
        success: (res) => {
          if (res.confirm) {
            const baseurl = getApp().globalData.baseURL;
            const userToken = uni.getStorageSync('userToken');
            uni.request({
              url: `${baseurl}/promoteToOfficial?token=${userToken}`,
              method: 'POST',
              data: { draftId: this.draft.id },
              success: (response) => {
                if (response.statusCode === 200) {
                  uni.showToast({
                    title: '草稿转正成功',
                    icon: 'success',
                  });
                  uni.navigateBack();
                } else {
                  uni.showToast({
                    title: '转正失败',
                    icon: 'none',
                  });
                }
              },
              fail: (err) => {
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none',
                });
              },
            });
          }
        },
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
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.draft-footer-container {
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

.promote-button {
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
