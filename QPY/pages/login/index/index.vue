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

    // 处理服务器返回的 token 和 pingshuiyun
    processToken(data) {
      if (data && data.token) {
        console.log('Token:', data.token);
        // 存储 userToken
        uni.setStorage({
          key: 'userToken',
          data: data.token,
          success: () => {
            // 登录成功后处理 pingshuiyun
            this.checkPingshuiyun();
          },
          fail: () => {
            uni.showToast({ title: '存储 Token 失败', icon: 'none' });
          }
        });
      } else {
        uni.showToast({ title: '微信登陆失败4', icon: 'none' });
      }
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
