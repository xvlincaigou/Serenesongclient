<template>
  <view class="favorite-list-container">
    <!-- 展示收藏夹中的作品列表 -->
    <view v-for="(work, index) in works" :key="index" class="work-item" @click="viewWorkDetail(work)">
      <view class="work-header">
        <view class="work-info">
          <text class="work-cipai">{{ work.cipai }}\n</text>
          <text class="work-author">{{ work.author }}</text>
        </view>
        <button class="delete-button" @click.stop="removeFromCollection(work.ciID, index)">删除</button>
      </view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
	  baseurl:getApp().globalData.baseURL,
      token: "",
      collectionID: "",
      works: [],
    };
  },
  onLoad(options) {
    this.collectionID = options.collectionID;
    // 获取 token
    const token = uni.getStorageSync('userToken');
    if (token) {
      this.token = token;
      // 模拟添加作品到收藏夹
      // 请在下面调用 simulateAddWork(ciID)，并将 'your_ciID_here' 替换为实际的 ciID
      // this.simulateAddWork('6736ce5521bbb79177e5598f');
    } else {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      });
    }
  },
  onShow() {
    if (this.token) {
		this.getCollectionItems();
    }
  },
  methods: {
    // 获取收藏夹中的作品列表
    getCollectionItems() {
      uni.request({
        url: `${this.baseurl}/getAllColletionItems?collectionID=${this.collectionID}&token=${this.token}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          if (res.statusCode === 200) {
			console.log('API Response Data:', res.data);
            this.works = res.data.collectionItems.map(workItem => ({
			  ciID: workItem.ciID || workItem.CiId,
			  comment: workItem.comment || workItem.Comment,
			}));
            console.log('收藏夹内容:', this.works);
			const requests = this.works.map(item => {
				if (!item.ciID) {
				    console.error('ciID is undefined for item:', item);
				    return Promise.reject(new Error('ciID is undefined'));
				}
				return new Promise((resolve, reject) => {
					uni.request({
						url: `${this.baseurl}/getCiById?_id=${item.ciID}`,
						method: 'GET',
			            header: {
			                'Content-Type': 'application/json',
			            },
			            success: (res) => {
			                if (res.statusCode === 200) {
			                    // 合并作品信息
			                    const ciInfo = res.data;
			                    resolve({
			                        ciID: item.ciID,
			                        comment: item.comment,
			                        author: ciInfo.author,
			                        content: ciInfo.content,
			                        cipai: ciInfo.cipai ? ciInfo.cipai[0] : '',
			                    });
			                } else {
			                    reject(res);
			                }
			            },
			            fail: (err) => {
			                reject(err);
			            }
			        });
			    });
			});
			Promise.all(requests)
			    .then(results => {
			        this.works = results;
			        console.log('收藏夹内容:', this.works);
			    })
			    .catch(err => {
			        console.error('获取作品详细信息失败:', err);
			        uni.showToast({
			            title: '获取作品详细信息失败',
			            icon: 'none',
			        });
			    });
          } else {
            uni.showToast({
              title: '获取收藏夹内容失败',
              icon: 'none',
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          });
        }
      });
    },
    // 模拟添加作品到收藏夹
    simulateAddWork(ciID) {
      uni.request({
        url: `${this.baseurl}/addToCollection?collectionID=${this.collectionID}&ciID=${ciID}&token=${this.token}`,
        method: 'POST',
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: res.data.message || '添加成功',
              icon: 'success',
            });
            this.getCollectionItems(); // 更新列表
          } else {
            uni.showToast({
              title: res.data.message || '添加失败',
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
    // 从收藏夹中删除作品
    removeFromCollection(ciID, index) {
      uni.request({
        url: `${this.baseurl}/removeFromCollection?collectionID=${this.collectionID}&ciID=${ciID}&token=${this.token}`,
        method: 'POST',
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: res.data.message || '删除成功',
              icon: 'success',
            });
            // 从作品列表中移除
            this.works.splice(index, 1);
          } else {
            uni.showToast({
              title: res.data.message || '删除失败',
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
    // 点击作品，跳转到详情页
    viewWorkDetail(work) {
        uni.navigateTo({
            url: `/pages5_user/favoriteDetail/favoriteDetail?cipai=${encodeURIComponent(work.cipai)}&author=${encodeURIComponent(work.author)}&content=${encodeURIComponent(JSON.stringify(work.content))}&comment=${encodeURIComponent(work.comment)}&collectionID=${this.collectionID}&ciID=${work.ciID}&token=${this.token}`
        });
    },
  }
}
</script>

<style>
.favorite-list-container {
  padding: 16px;
}
.work-item {
  margin-bottom: 16px;
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 8px;
}
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.work-info {
  flex: 1;
}
.work-cipai {
  font-size: 16px;
  font-weight: bold;
}
.work-author {
  font-size: 14px;
  color: grey;
  margin-top: 4px;
}
.delete-button {
  background-color: transparent;
  border: none;
  color: red;
  flex-shrink: 0;
}
.work-content {
  font-size: 14px;
  color: grey;
  margin-top: 4px;
}
</style>
