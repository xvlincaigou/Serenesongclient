<template>
  <view class="profile-container">
      
    <view class="avatarUrl">
      <button
        class="avabutton"
        type="balanced"
        open-type="chooseAvatar"
        @chooseavatar="onChooseavatar"
      >
        <image :src="avatarUrl" class="refreshIcon"></image>
      </button>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">名称</text>
        <input
          type="nickname"
		  :value="nickname"
          @blur="bindblur"
          placeholder="请输入新昵称"
          class="input-box"
          @input="bindinput"
        />
      </view>

      <view class="form-item">
        <text class="label">个性签名</text>
        <input
          v-model="signature"
          placeholder="请输入个性签名"
          class="input-box"
        />
      </view>

      <button
        class="save-button"
        @click="saveProfile"
        :disabled="isSaving"
      >
        {{ isSaving ? '保存中...' : '保存' }}
      </button>
      
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      token: '',
      avatarUrl:
        'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickname: '',
      signature: '',
      avatarData: '',
      isSaving: false, // 用于控制保存按钮状态
    };
  },
  onLoad(option) {
    this.token = uni.getStorageSync('userToken') || '';
    this.token = uni.getStorageSync('userToken') || '';
        if (this.token) {
          this.getUserID();
	}
  },
  methods: {
	getUserID() {
	      uni.request({
	        url: `https://sss.xulincaigou.online/getPersonalID?token=${this.token}`,
	        method: 'GET',
	        success: (res) => {
	          if (res.statusCode === 200 && res.data) {
	            this.user_id = res.data.personal_id;
	            this.getUserInfo();
	          }
	        }
	      });
	},
	getUserInfo() {
	  uni.request({
		url: `https://sss.xulincaigou.online/getUserInfo?user_id=${this.user_id}&token=${this.token}`,
		method: 'GET',
		success: (res) => {
		  if (res.statusCode === 200 && res.data) {
			this.avatarUrl = 'data:image/png;base64,' + res.data.avatar;
			this.nickname = res.data.name;
			this.signature = res.data.signature;
			this.avatarData = res.data.avatar;
		  }
		}
	  });
	},
    bindblur(e) {
      this.nickname = e.detail.value; // 获取昵称
    },
    bindinput(e) {
      this.nickname = e.detail.value; // 处理输入
    },
    async onChooseavatar(e) {
      console.log('选择的头像信息:', e.detail);
      if (e.detail.avatarUrl) {
        this.avatarUrl = e.detail.avatarUrl;
        await this.convertImageToBase64(this.avatarUrl);
      };
	  console.log("token",this.token,"name",this.nickname,"avatar",this.avatarData,"sig",this.signature);
    },
    convertImageToBase64(url) {
      return new Promise((resolve, reject) => {
        // 获取图片信息
        uni.getImageInfo({
          src: url,
          success: (res) => {
            // 读取文件为Base64
            const fs = uni.getFileSystemManager();
            fs.readFile({
              filePath: res.path,
              encoding: 'base64',
              success: (fileRes) => {
                this.avatarData = fileRes.data;
                resolve();
              },
              fail: (err) => {
                console.error('读取文件失败:', err);
                reject(err);
              },
            });
          },
          fail: (err) => {
            console.error('获取图片信息失败:', err);
            reject(err);
          },
        });
      });
    },
    async saveProfile() {
		
      if (!this.nickname.trim()) {
        uni.showToast({
          title: '昵称不能为空',
          icon: 'none',
        });
        return;
      }

      this.isSaving = true; // 开始保存，禁用按钮
      uni.showLoading({
        title: '保存中...',
      });

      try {
        const response = await this.sendSaveRequest();
        if (response.statusCode === 200 ) {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                uni.switchTab({
                  url: `/pages/user/index/index`
                });
              }, 500);
            }
          });
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'none',
          });
        }
      } catch (error) {
        console.error('保存资料时出错:', error);
        uni.showToast({
          title: '保存失败，请稍后重试',
          icon: 'none',
        });
      } finally {
        this.isSaving = false; // 恢复按钮状态
        uni.hideLoading();
      }
    },
    sendSaveRequest() {
	  console.log("token",this.token,"name",this.nickname,"avatar",this.avatarData,"sig",this.signature);
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://sss.xulincaigou.online/saveUserInfo',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
          },
          data: {
            token: this.token,
            name: this.nickname,
            avatar: this.avatarData,
            signature: this.signature,
          },
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
  },
};
</script>

<style>
.profile-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatarUrl {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 限定按钮的宽度和高度，并防止其扩展 */
.avabutton {
  display: inline-block; /* 或者使用 display: flex; */
  width: 150px;
  height: 150px;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer; /* 提示用户这是一个可点击的元素 */
  overflow: hidden; /* 防止内容溢出 */
}

.refreshIcon {
  width: 100%;
  height: 100%;
  border-radius: 0%;
  object-fit: cover;
}

.form {
  width: 80%;
  margin-top: 40px;
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
.save-button:disabled {
  background-color: #f0f0f0;
  color: #a0a0a0;
  border-color: #d0d0d0;
  cursor: not-allowed;
}
</style>
