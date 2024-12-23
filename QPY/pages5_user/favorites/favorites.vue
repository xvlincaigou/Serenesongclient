<template>
  <view class="favorite-container">
    <!-- 创建收藏夹的弹窗 -->
    <view v-if="showCreateModal" class="modal-overlay">
      <view class="modal-content">
        <!-- 输入框 -->
        <view class="input-container">
          <input v-model="newCollectionName" placeholder="请输入收藏夹标题" />
        </view>
        <!-- 按钮区域 -->
        <view class="button-container">
          <button class="modal-button" @click="confirmCreateCollection">创建</button>
          <button class="modal-button" @click="cancelCreateCollection">取消</button>
        </view>
      </view>
    </view>
    <!-- 收藏列表 -->
    <view v-for="(favorite, index) in favorites" :key="index" class="favorite-item">
      <view class="favorite-header">
        <text class="favorite-title" @click="viewFavoriteList(favorite.collectionID)">{{ favorite.collectionName }}</text>
        <button class="delete-button" @click.stop="deleteCollection(favorite.collectionID, index)">删除</button>
      </view>
    </view>
	<button @click="createCollection" class = "create-button">创建收藏夹</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  baseurl:getApp().globalData.baseURL,
      token: "",
      favorites: [],
      showCreateModal: false,
      newCollectionName: "",
    };
  },
  created() {
    this.getTokenAndCollections();
  },
  // 当页面显示时，刷新收藏夹列表
  onShow() {
    this.getAllCollections();
  },
  methods: {
    // 获取token并获取收藏夹列表
    getTokenAndCollections() {
      // 获取存储的token
      const token = uni.getStorageSync('userToken');
      if (token) {
        this.token = token;
        // 获取收藏夹列表
        this.getAllCollections();
      } else {
        // 处理未获取到token的情况
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
      }
    },
    // 获取全部收藏夹
    getAllCollections() {
      uni.request({
        url: `${this.baseurl}/getAllCollections?token=${this.token}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 映射服务器返回的数据，统一属性名
            this.favorites = res.data.collections.map(collection => ({
              collectionID: collection._id || collection.collectionID,
              collectionName: collection.Name || collection.collectionName,
              description: collection.description || '',
            }));
          } else {
            uni.showToast({
              title: '获取收藏夹失败',
              icon: 'none',
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
        },
      });
    },
    // 打开创建收藏夹弹窗
    createCollection() {
      this.showCreateModal = true;
    },
    // 确认创建收藏夹
    confirmCreateCollection() {
      if (!this.newCollectionName) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/createCollection?collectionName=${this.newCollectionName}&token=${this.token}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 根据服务器返回的数据结构，进行判断
            let collectionID = '';
            let collectionName = this.newCollectionName;
    
            // 情况1：服务器返回
            if (res.data.collectionID) {
              collectionID = res.data.collectionID;
            }
            // 情况2：服务器返回新创建的收藏夹对象
            else if (res.data._id || res.data.collectionID) {
              collectionID = res.data._id || res.data.collectionID;
              collectionName = res.data.Name || res.data.collectionName || collectionName;
            }
            // 情况3：其他结构
            else {
              // 无法获取 collectionID，处理错误
              uni.showToast({
                title: '创建失败，未返回收藏夹ID',
                icon: 'none',
              });
              return;
            }
    
            // 更新收藏夹列表
            this.favorites.push({
              collectionID,
              collectionName,
            });
            this.showCreateModal = false;
            this.newCollectionName = '';
            uni.showToast({
              title: '创建成功',
              icon: 'success',
            });
			this.getAllCollections();
          } else {
            uni.showToast({
              title: '创建失败',
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
    // 取消创建收藏夹
    cancelCreateCollection() {
      this.showCreateModal = false;
      this.newCollectionName = "";
    },
    // 查看收藏夹详情
    viewFavoriteList(collectionID) {
      uni.navigateTo({
        url: `/pages5_user/favoriteList/favoriteList?collectionID=${collectionID}`,
      });
    },
    // 删除收藏夹
    deleteCollection(collectionID, index) {
      uni.request({
        url: `${this.baseurl}/deleteCollection?collectionID=${collectionID}&token=${this.token}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
            });
            // 更新收藏夹列表
            this.favorites.splice(index, 1);
			this.getAllCollections();
          } else {
            uni.showToast({
              title: res.data.message || '删除失败',
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
.favorite-container {
  padding: 16px;
}
.create-button {
  margin-bottom: 16px;
  background-color: #fff;
  padding: 8px;
  border-radius: 12px;
  color: #999;
  box-shadow: 2px 2px 3px rgba(0,0,0,0.1);
}
.create-button:active {
  background-color: #c4c4c4; 
  transform: translateY(2px);
}
.favorite-item {
  margin-bottom: 16px;
  background-color: #fff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 2px 2px 3px rgba(0,0,0,0.1);
}
.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.favorite-title {
  margin-left: 7px;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
}
.delete-button {
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: #a6a6a6;
  flex-shrink: 0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 添加 z-index，使其在最上层 */
}
.modal-content {
  width: 80%;
  background-color:  rgba(254, 253, 249, 0.9);
  padding: 16px;
  border-radius: 8px;
}
.input-container {
  margin-bottom: 12px;
}
.input-container input {
  width: 95%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.button-container {
  display: flex;
  gap:16px;
  justify-content: 2;
}
.modal-button {
  width: 48%;
  padding: 3px 0;
  margin-left: 0px;
  margin-right: 0px;
  background: linear-gradient(145deg, #eaeaea, #fefdf9);
  border: 1px solid #ddd;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  box-shadow: 2px 2px 8px rgba(107, 107, 107, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}
.modal-button:active {
  background: linear-gradient(145deg, #d8d8d8, #c8c8c8); 
  transform: translateY(2px);
}
</style>