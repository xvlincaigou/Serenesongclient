<template>
  <view class="container">
    <view v-if="UserWork">
      <view class="UserWork-header-container">
        <text class="UserWork-title">{{ UserWork.cipai[0] }} · {{ UserWork.title }}</text>
      </view>

      <!-- 作品内容容器 -->
      <view class="UserWork-content-container">
        <view v-for="(item, index) in UserWork.content" :key="index" class="UserWork-description">
          {{ item }}
        </view>
      </view>

      <!-- 操作按钮容器 -->
      <view class="UserWork-footer-container">
        <button @click="modifyUserWork" class="button edit-button">修改作品</button>
        <button @click="featureUserWork" class="button feature-button">分享作品</button>
        <button @click="publishUserWork" class="button publish-button">{{ publishButtonText }}</button>
      </view>
    </view>

    <view v-else>
      <text class="error-message">加载作品失败，请稍后再试。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      UserWork: null, 
      token: '',
      isPublished: false,
      baseurl: getApp().globalData.baseURL, // 添加 baseurl
    };
  },
  onLoad(options) {
    const workData = options.UserWork ? JSON.parse(decodeURIComponent(options.UserWork)) : null;
    this.UserWork = workData;
    this.token = uni.getStorageSync('userToken');
  },
  computed: {
    // 计算属性，根据 UserWork.is_public 动态返回按钮文字
    publishButtonText() {
      if (this.UserWork && this.UserWork.is_public) {
        return '取消公开';
      } else {
        return '公开作品';
      }
    }
  },
  methods: {
    modifyUserWork(){
      uni.navigateTo({
        url: `/pages3_write/userWorkDetail/modifyUserWork?UserWork=${encodeURIComponent(JSON.stringify(this.UserWork))}`,
      });
    },
    featureUserWork() {
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      uni.request({
        url: `${this.baseurl}/publishDynamic`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          token: this.token,
          Type: 1,
          _id: this.UserWork._id,
          _id2: "0",
        },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: '已发布动态',
              icon: 'success',
            });
          } else {
            uni.showToast({
              title: res.data.message || '发布失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
          });
        },
      });
    },
    publishUserWork() {
      const baseurl = this.baseurl;
      if (!this.UserWork || !this.token) {
        uni.showToast({
          title: '作品信息或用户令牌缺失',
          icon: 'none'
        });
        return;
      }
    
      const newPrivacy = !this.UserWork.is_public;
      uni.request({
        url: `${baseurl}/changePrivacy`, // 不再在URL上拼接参数
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          work_id: this.UserWork._id,
          token: this.token,
          privacy: newPrivacy
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 更新本地的 is_public 状态
            this.UserWork.is_public = newPrivacy;
            uni.showToast({
              title: newPrivacy ? '作品已公开' : '作品已取消公开',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: res.data.message || '操作失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none'
          });
        }
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

.UserWork-header-container,
.UserWork-content-container {
  margin-bottom: 24px; 
  width: 90%;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
}

.UserWork-header-container {
  display: flex;
  flex-direction: column;
  gap: 4px; 
}

.UserWork-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.UserWork-content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.UserWork-description {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.UserWork-footer-container {
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

.feature-button {
  background-color: #555;
  color: #fff;
}

.publish-button {
  background-color: #555;
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
