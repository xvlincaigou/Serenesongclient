<template>
  <view class="t-login">
    <!-- 显示拉长的正方形图片 -->
    <image class="img-a" src="/static/login/qpy.png"></image>
    <!-- 标题和副标题 -->
    <view class="title">清平乐</view>
    <view class="subtitle">清平以作，乐律而歌</view>
    <!-- 登录按钮 -->
    <button @tap="login">登 录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pingshuiyun: null, // 已有变量 pingshuiyun
      yunshu: null // 新增变量 yunshu
    };
  },
  methods: {
    // 处理登录按钮点击事件，进行微信授权
    login() {
      uni.login({
        provider: 'weixin',
        success: loginRes => {
          console.log('请求信息：', loginRes);
          this.processLogin(loginRes.code);
        },
        fail: () => {
          uni.showToast({ title: '微信登录失败1', icon: 'none' });
        }
      });
    },

    // 通过微信授权码向后端发送请求处理登录
    processLogin(code) {
      let baseurl = getApp().globalData.baseURL;
      console.log('是否取到全局变量：', baseurl);
      uni.request({
        url: `${baseurl}/login?wxcode=${code}`,
        method: 'POST',
        success: response => {
          this.handleResponse(response);
        },
        fail: () => {
          uni.showToast({ title: '微信登录失败2', icon: 'none' });
        }
      });
    },

    // 处理服务器响应
    handleResponse(response) {
      if (response.statusCode === 200) {
        uni.showToast({ title: '微信登录成功', icon: 'success' });
        this.processToken(response.data);
      } else {
        console.error('登录请求失败，目前状态码:', response.statusCode);
        uni.showToast({ title: '微信登录失败3', icon: 'none' });
      }
    },

    // 处理服务器返回的 token
    processToken(data) {
      if (data && data.token) {
        console.log('Token:', data.token);
        // 存储 userToken
        uni.setStorage({
          key: 'userToken',
          data: data.token,
          success: () => {
            // 存储 token 成功后调用 getPersonalID 接口获取 personal_id
            this.fetchPersonalID(data.token);
			this.fetchSubscribers(data.token);
			this.fetchSubscribedTo(data.token);
          },
          fail: () => {
            uni.showToast({ title: '存储 Token 失败', icon: 'none' });
          }
        });
      } else {
        uni.showToast({ title: '微信登陆失败4', icon: 'none' });
      }
    },

    // 新增：根据 token 获取 personal_id 并存储
    fetchPersonalID(token) {
	  let baseurl = getApp().globalData.baseURL;
      uni.request({
        url: `${baseurl}/getPersonalID?token=${token}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.personal_id) {
            // 存储 personal_id
			console.log('id:', res.data.personal_id);
            uni.setStorage({
              key: 'personal_id',
              data: res.data.personal_id,
              success: () => {
                console.log('personal_id:', res.data.personal_id);
                // personal_id 获取并存储完成后，继续检查 pingshuiyun
                this.checkPingshuiyun();
              },
              fail: () => {
                uni.showToast({ title: '存储 personal_id 失败', icon: 'none' });
              }
            });
          } else {
            console.error('获取 personal_id 失败，状态码:', res.statusCode);
            uni.showToast({ title: '获取 personal_id 失败', icon: 'none' });
          }
        },
        fail: () => {
          console.error('getPersonalID API 请求失败');
          uni.showToast({ title: '请求 personal_id 失败', icon: 'none' });
        }
      });
    },

    // 检查 pingshuiyun 是否存在于本地存储
    checkPingshuiyun() {
      uni.getStorage({
        key: 'pingshuiyun',
        success: res => {
          if (res.data) {
            this.pingshuiyun = res.data;
            console.log('pingshuiyun:', this.pingshuiyun);
            // pingshuiyun 处理完成后，继续检查 yunshu
            this.checkYunshu();
          } else {
            // 如果 pingshuiyun 为空，调用 API 获取
            this.fetchPingshuiyun();
          }
        },
        fail: () => {
          // 如果获取失败，调用 API 获取
          this.fetchPingshuiyun();
        }
      });
    },

    // 调用 API 获取 pingshuiyun 并存储
    fetchPingshuiyun() {
      let baseurl = getApp().globalData.baseURL;
      uni.request({
        url: `${baseurl}/getRhymes`,
        method: 'GET',
        success: response => {
          if (response.statusCode === 200 && response.data) {
            this.pingshuiyun = response.data;
            // 存储 pingshuiyun
            uni.setStorage({
              key: 'pingshuiyun',
              data: this.pingshuiyun,
              success: () => {
                console.log('pingshuiyun:', this.pingshuiyun);
                // pingshuiyun 获取并存储完成后，继续检查 yunshu
                this.checkYunshu();
              },
              fail: () => {
                uni.showToast({ title: '存储平水韵失败', icon: 'none' });
              }
            });
          } else {
            console.error('getRhymes API 失败，状态码:', response.statusCode);
            uni.showToast({ title: '获取平水韵失败', icon: 'none' });
          }
        },
        fail: () => {
          console.error('getRhymes API 请求失败');
          uni.showToast({ title: '获取平水韵失败', icon: 'none' });
        }
      });
    },

    // 检查 yunshu 是否存在于本地存储
    checkYunshu() {
      uni.getStorage({
        key: 'yunshu',
        success: res => {
          if (res.data) {
            this.yunshu = res.data;
            console.log('yunshu:', this.yunshu);
            // yunshu 处理完成后，跳转页面
            this.redirectToSearch();
          } else {
            // 如果 yunshu 为空，调用 API 获取
            this.fetchYunshu();
          }
        },
        fail: () => {
          // 如果获取失败，调用 API 获取
          this.fetchYunshu();
        }
      });
    },

    // 调用 API 获取 yunshu 并存储
    fetchYunshu() {
      let baseurl = getApp().globalData.baseURL;
      uni.request({
        url: `${baseurl}/getYunshu`,
        method: 'GET',
        success: response => {
          if (response.statusCode === 200 && response.data) {
            this.yunshu = response.data;
            
            // 预处理韵书数据
            const processedData = this.preprocessYunShuData(this.yunshu.rhymes[0]);
            
            // 存储原始韵书数据
            uni.setStorage({
              key: 'yunshu',
              data: this.yunshu,
              success: () => {
                console.log('yunshu:', this.yunshu.rhymes);
                
                // 存储预处理后的数据
                uni.setStorage({
                  key: 'processedYunShu',
                  data: processedData,
                  success: () => {
                    console.log('Processed yunshu data stored');
                    this.redirectToSearch();
                  },
                  fail: () => {
                    uni.showToast({ title: '存储预处理数据失败', icon: 'none' });
                  }
                });
              },
              fail: () => {
                uni.showToast({ title: '存储韵书失败', icon: 'none' });
              }
            });
          } else {
            console.error('getYunshu API 失败，状态码:', response.statusCode);
            uni.showToast({ title: '获取韵书失败', icon: 'none' });
          }
        },
        fail: () => {
          console.error('getYunshu API 请求失败');
          uni.showToast({ title: '获取韵书失败', icon: 'none' });
        }
      });
    },

    // 新增：预处理韵书数据的方法
    preprocessYunShuData(rawData) {
      const processed = {};
      
      // 遍历处理数据，去除 _id 字段
      for (const [key, value] of Object.entries(rawData)) {
        if (key === '_id') continue;
        
        if (typeof value === 'object' && value !== null) {
          processed[key] = value;
        }
      }
      
      return processed;
    },
	fetchSubscribedTo(token) {
	  let baseurl = getApp().globalData.baseURL;
	  uni.request({
	    url: `${baseurl}/getSubscribedTo?token=${token}`,
	    method: 'GET',
	    success: res => {
	      if (res.statusCode === 200 && res.data) {
	        let subscribedToData = [];
	
	        // 检查 res.data.subscribed_to 是否为 null
	        if (res.data.subscribed_to === null) {
	          subscribedToData = [];  // 若为 null，则存入空数组
	        } else if (res.data.subscribed_to && res.data.subscribed_to.length > 0) {
			  console.log('check1:', res.data.subscribed_to);
	          res.data.subscribed_to.forEach(item => {
	            if (item.ID) {
	                subscribedToData.push(item.ID);
	            }
	          });
	        }
	
	        // 存储处理后的数据
	        uni.setStorage({
	          key: 'subscribedTo',
	          data: subscribedToData,
	          success: () => {
	            console.log('用户关注列表存储成功');
	            console.log('关注:', subscribedToData);
	          },
	          fail: () => {
	            uni.showToast({ title: '存储关注列表失败', icon: 'none' });
	          }
	        });
	
	      } else {
	        console.error('获取关注列表失败，状态码:', res.statusCode);
	        uni.showToast({ title: '获取关注列表失败', icon: 'none' });
	      }
	    },
	    fail: () => {
	      console.error('获取关注列表请求失败');
	      uni.showToast({ title: '请求关注列表失败', icon: 'none' });
	    }
	  });
	},


	fetchSubscribers(token) {
	    let baseurl = getApp().globalData.baseURL;
	    uni.request({
	        url: `${baseurl}/getSubscribers?token=${token}`,
	        method: 'GET',
	        success: res => {
	          if (res.statusCode === 200 && res.data) {
				let subscribersData = [];
					
				if (res.data.subscribers === null) {
				  subscribersData = [];  // 若为 null，则存入空数组
				} else if (res.data.subscribers && res.data.subscribers.length > 0) {
				  console.log('check2:', res.data.subscribers);
				  res.data.subscribers.forEach(item => {
				    if (item.ID) {
				        subscribersData.push(item.ID);
				    }
				  });
				}
				
	            uni.setStorage({
	              key: 'subscribers',
	              data: subscribersData,
	              success: () => {
	                console.log('用户粉丝列表存储成功');
					console.log('粉丝:', subscribersData);
	              },
	              fail: () => {
	                uni.showToast({ title: '存储粉丝列表失败', icon: 'none' });
	              }
	            });
	          } else {
	            console.error('获取粉丝列表失败，状态码:', res.statusCode);
	            uni.showToast({ title: '获取粉丝列表失败', icon: 'none' });
	          }
	        },
	        fail: () => {
	          console.error('获取粉丝列表请求失败');
	          uni.showToast({ title: '请求粉丝列表失败', icon: 'none' });
	        }
	    });
	},

    // 跳转到搜索页面
    redirectToSearch() {
      uni.switchTab({
        url: '/pages/search/index/index'
      });
    }
  }
};
</script>

<style>
/* 样式保持不变 */
.t-login {
  width: 100%;
  margin: 0 auto;
  font-size: 28rpx;
  color: #000;
  text-align: center;
}

.img-a {
  width: 100%;
  height: auto; /* 高度根据宽度调整 */
  aspect-ratio: 1; /* 维持1:1的长宽比 */
}

.title {
  font-size: 35px;
  color: #000;
  font-weight: bold;
  margin-top: 30px;
}

.subtitle {
  font-size: 32rpx;
  color: #aaaaaa;
  margin-top: 10px;
  margin-bottom: 40rpx;
}

button {
  width: 80%;
  font-size: 28rpx;
  background: #5677fc;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
  margin: 0 auto;
}
</style>
