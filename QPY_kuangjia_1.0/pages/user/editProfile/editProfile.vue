<template>
  <view class="profile-container">
    <view class="profile-section">
      <view class="profile-avatar-wrapper">
        <image v-if="avatar" :src="avatar" class="profile-avatar" @click="changeAvatar" />
        <view v-else class="profile-avatar-placeholder" @click="changeAvatar"></view>
      </view>
      <view class="change-avatar-text" @click="changeAvatar">修改头像</view>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">名称</text>
        <input v-model="nickname" placeholder="请输入名称" class="input-box" />
      </view>

      <view class="form-item">
        <text class="label">个性签名</text>
        <input v-model="signature" placeholder="请输入个性签名" class="input-box" />
      </view>

      <view class="form-item">
        <text class="label">电话</text>
        <input v-model="phone" placeholder="请输入电话" class="input-box" />
      </view>

      <view class="form-item">
        <text class="label">邮箱</text>
        <input v-model="email" placeholder="请输入邮箱" class="input-box" />
      </view>

      <view class="options">
        <view class="option-item">
          <text>允许陌生人搜到自己</text>
          <switch :checked="allowSearch" @change="toggleAllowSearch" />
        </view>
        <view class="option-item">
          <text>允许陌生人发送好友邀请</text>
          <switch :checked="allowInvite" @change="toggleAllowInvite" />
        </view>
        <view class="option-item">
          <text>允许陌生人浏览自己主页</text>
          <switch :checked="allowViewProfile" @change="toggleAllowViewProfile" />
        </view>
      </view>

      <button class="save-button" @click="saveProfile">保存</button>
      
      <!-- 新增切换账号和退出登录按钮 -->
      <view class="action-buttons">
        <button class="switch-account-button" @click="switchAccount">切换账号</button>
        <button class="logout-button" @click="logout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      avatar: '',
      nickname: '',
      signature: '',
      phone: '',
      email: '',
      allowSearch: false,
      allowInvite: false,
      allowViewProfile: false
    };
  },
  methods: {
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.avatar = res.tempFilePaths[0];
        }
      });
    },
    saveProfile() {
      uni.showToast({ title: '资料已保存', icon: 'success' });
    },
    toggleAllowSearch(event) {
      this.allowSearch = event.detail.value;
    },
    toggleAllowInvite(event) {
      this.allowInvite = event.detail.value;
    },
    toggleAllowViewProfile(event) {
      this.allowViewProfile = event.detail.value;
    },
    switchAccount() {
      uni.showToast({ title: '切换账号功能待实现', icon: 'none' });
    },
    logout() {
      uni.showToast({ title: '退出登录功能待实现', icon: 'none' });
    }
  }
};
</script>

<style>
.profile-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.profile-avatar-wrapper {
  width: 100px;
  height: 100px;
  margin-bottom: 8px;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: grey;
}
.change-avatar-text {
  font-size: 12px;
  color: #007aff;
  text-decoration: underline;
  cursor: pointer;
}
.form {
  width: 80%;
  margin-top: 10px;
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.label {
  width: 80px;
  font-size: 14px;
  color: black;
}
.input-box {
  flex: 1;
  padding: 0;
  margin-left: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  background-color: transparent;
}
.options {
  margin-top: 30px;
}
.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}
.save-button {
  width: 100px;
  padding: 6px;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 40px;
  margin-bottom: 30px;
}
.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  width: 100%;
}
.switch-account-button {
  width: 100px;
  padding: 6px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}
.logout-button {
  width: 100px;
  padding: 6px;
  background-color: #ff3b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}
</style>
