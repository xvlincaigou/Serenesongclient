<template>
  <view class="container">
    <view class="detail-header">
      <text class="header-title">{{ ci.cipai }}</text>
      <text class="author-title">\n\n {{ ci.author }}</text>
    </view>
    <view class="detail-body">
      <view class="cont-section">
        <text class="cont-text">{{ ci.content }}</text>
      </view>
    </view>
    <!-- 收藏按钮 -->
    <view class="button-container">
      <button class="favorite-button" @click="onFavoriteClick">收藏词</button>
	   <button class="review-button" @click="onReviewClick">我要写词评</button>
    </view>

    <!-- 收藏夹悬浮框 -->
    <view v-if="showModal" class="modal">
      <view class="modal-header">
		<button class="cancel-button" @click="onCancel">取消</button>
        <button class="confirm-button" @click="onConfirm">收藏</button>
      </view>
      <view class="modal-body">
        <view
          v-for="collection in collections"
          :key="collection._id"
          @click="selectCollection(collection)"
          :class="{ 'selected': selectedCollection && selectedCollection._id === collection._id }"
          class="collection-item"
        >
          {{ collection.Name }}
        </view>
        <button class="new-collection-button" @click="createNewCollection">+ 新建收藏夹</button>
        <view v-if="showCreateCollectionInput" class="new-collection-input">
          <input v-model="newCollectionName" placeholder="请输入收藏夹名称" />
          <view class="input-buttons">
			<button @click="cancelCreateNewCollection">取消</button>
            <button @click="confirmCreateNewCollection">确定</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ci: {},
      showModal: false,
      collections: [],
      selectedCollection: null,
      userToken: '',
      showCreateCollectionInput: false,
      newCollectionName: '',
	  baseurl:getApp().globalData.baseURL,
    };
  },
  onLoad(options) {
    this.ci = JSON.parse(decodeURIComponent(options.ci));
    console.log('Loaded ci object:', this.ci);
    this.ciID = this.ci._id;
    // 获取用户 token
    uni.getStorage({
      key: 'userToken',
      success: (res) => {
        this.userToken = res.data;
      },
    });
  },
  methods: {
	  
	onReviewClick() {
	  // TODO:添加处理写词评的逻辑
	},

    onFavoriteClick() {
      if (!this.userToken) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      this.showModal = true;
      this.fetchCollections();
    },
    fetchCollections() {
	  console.log(this.userToken);
      uni.request({
        url: `${this.baseurl}/getAllCollections?token=${this.userToken}`,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.collections) {
			console.log(res)
            this.collections = res.data.collections;
          } else {
            console.log('Failed to get collections:', res);
          }
        },
        fail: (err) => {
          console.log('API request failed:', err);
        },
      });
    },
    onCancel() {
      this.showModal = false;
    },
    onConfirm() {
      if (!this.selectedCollection) {
        uni.showToast({
          title: '请选择收藏夹',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/addToCollection?collectionID=${this.selectedCollection._id}&ciID=${this.ciID}&token=${this.userToken}`,
        method: 'POST',
        success: (res) => {
          if (res.statusCode == 200) {
            uni.showToast({
              title: '已收藏',
              icon: 'success',
            });
            this.showModal = false;
          } else {
            console.log('Failed to add to collection:', res);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
          console.log('API request failed:', err);
        },
      });
    },
    selectCollection(collection) {
      this.selectedCollection = collection;
    },
    createNewCollection() {
      this.showCreateCollectionInput = true;
    },
    cancelCreateNewCollection() {
      this.showCreateCollectionInput = false;
      this.newCollectionName = '';
    },
    confirmCreateNewCollection() {
      if (!this.newCollectionName.trim()) {
        uni.showToast({
          title: '请输入收藏夹名称',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/createCollection?collectionName=${encodeURIComponent(
          this.newCollectionName
        )}&token=${this.userToken}`,
        method: 'POST',
        success: (res) => {
          if (res.statusCode == 200) {
            uni.showToast({
              title: '收藏夹已创建',
              icon: 'success',
            });
            this.fetchCollections();
            this.newCollectionName = '';
            this.showCreateCollectionInput = false;
          } else {
            uni.showToast({
              title: '创建失败',
              icon: 'none',
            });
            console.log('Failed to create collection:', res);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
          console.log('API request failed:', err);
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
}

.detail-header {
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.author-title {
  font-size: 17px;
  color: #aaa;
}

.detail-body {
  width: 90%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cont-section {
  margin-top: 10px;
}

.cont-text {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}

.button-container {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.favorite-button,
.review-button {
  flex: 1;
  margin: 0 10px;
  padding: 5px 0;
  background-color: #ffffff;
  color: #555555;
  border: none;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal {
  position: fixed;
  top: 20%;
  left: 5%;
  width: 90%;
  background-color: rgba(255, 255, 255,0.95);
  border-radius: 10px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.cancel-button,
.confirm-button {
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #7a7a7a;
}

.modal-body {
  padding: 10px;
}

.collection-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.collection-item.selected {
  background-color: #f0f0f0;
}

.new-collection-button {
  width: 100%;
  padding: 3px 0;
  background-color:  rgba(248, 248, 248, 0.8);
  border: none;
  text-align: center;
  font-size: 16px;
}

.new-collection-input {
  width:95%;
  margin-top: 10px;
}

.new-collection-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.input-buttons button {
	flex: 0 1 auto;
    margin: 0 50px; 
    background-color: #ccc;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px; 
}

.input-buttons button:last-child {
  background-color: #ccc;
}

</style>
