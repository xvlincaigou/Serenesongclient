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
  methods: {
    // 处理登录按钮点击事件，进行微信授权
    login() {
      uni.login({
        provider: 'weixin',
        success: loginRes => {
          console.log('微信登录成功:', loginRes);
          uni.showToast({ title: '微信登录成功', icon: 'success' });
          this.processLogin(loginRes.code);
        },
        fail: () => {
          uni.showToast({ title: '微信登录失败', icon: 'none' });
        }
      });
    },

    // 通过微信授权码向后端发送请求处理登录
    processLogin(code) {
      uni.request({
        url: `http://124.221.16.68:8080/login?wxcode=${code}`,
        method: 'POST',
        success: response => {
          this.handleResponse(response);
        },
        fail: () => {
          uni.showToast({ title: '请求登录接口失败', icon: 'none' });
        }
      });
    },

    // 处理服务器响应
    handleResponse(response) {
      if (response.statusCode === 200) {
        this.processToken(response.data);
      } else {
        console.error('登录请求失败，状态码:', response.statusCode);
        uni.showToast({ title: '登录失败，请稍后重试', icon: 'none' });
      }
    },

    // 处理服务器返回的 token
    processToken(data) {
      if (data && data.token) {
        console.log('Token:', data.token);
        uni.setStorage({
          key: 'userToken',
          data: data.token
        });
        uni.switchTab({
          url: '/pages/search/index/index'
        });
      } else {
        uni.showToast({ title: '获取Token失败', icon: 'none' });
      }
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
