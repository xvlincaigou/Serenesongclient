<template>
  <view class="container">
    <!-- 消息列表 -->
    <scroll-view scroll-y class="message-list">
      <view
        class="message"
        v-for="(msg, index) in messages"
        :key="index"
        :class="{ 'message-right': msg.isMe }"
      >
        <image :src="msg.avatar" class="avatar" :class="{ 'avatar-right': msg.isMe }" />
        <view class="message-content">
          <view class="nickname" :class="{ 'nickname-right': msg.isMe }">{{ msg.isMe ? '我' : msg.nickname }}</view>
          <view class="bubble" :class="{ 'bubble-me': msg.isMe }">{{ formatText(msg.text) }}</view>
          <view class="time">{{ msg.time }}</view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入框区域 -->
    <view class="input-area">
      <input
        v-model="inputText"
        placeholder="输入消息"
        @focus="showKeyboard = true"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage">发送</button>
      <button @click="toggleOptions">+</button>
    </view>

    <!-- 选项 -->
    <view v-if="showOptions" class="options">
      <button v-for="option in options" :key="option" @click="selectOption(option)">
        {{ option }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputText: "",
      showOptions: false,
      showKeyboard: false,
	  friendNickname: "",
	  friendAvatar: "",
      messages: [
        {
          text: "Hi there!",
          avatar: "",
          nickname: "",
          isMe: false,
          time: "10:30"
        },
        {
          text: "Hello!",
          avatar: "/static/dialog/avatar0.png",
          nickname: "我",
          isMe: true,
          time: "10:32"
        }
      ],
      options: ["作品", "收藏", "动态", "图片"]
    };
  },
  onLoad(options) {
    this.friendNickname = options.nickname || "好友";
    this.friendAvatar = options.avatar || "/static/dialog/avatar0.png";
  
    // 初始化好友消息的头像和昵称
    this.messages.forEach(msg => {
      if (!msg.isMe) {
        msg.nickname = this.friendNickname;
        msg.avatar = this.friendAvatar;
      }
    });
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    selectOption(option) {
      this.inputText = `已选择: ${option}`;
      this.showOptions = false;
    },
    sendMessage() {
      if (this.inputText.trim()) {
        this.messages.push({
          text: this.inputText,
          avatar: "/static/dialog/avatar0.png",
          nickname: "我",
          isMe: true,
          time: new Date().toLocaleTimeString()
        });
        this.inputText = "";
      }
    },
    formatText(text) {
      return text.replace(/(.{13})/g, "$1\n"); // 每13个字符换行
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.message-list {
  flex: 1;
  padding: 10px;
}
.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.message-right {
  flex-direction: row-reverse;
  margin-right: 16px;
}
.avatar {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50%;
}
.avatar-right {
  margin-right: 5px;
  margin-left: 10px;
}
.message-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}
.nickname {
  font-size: 12px;
  color: gray;
  margin-bottom: 2px;
}
.nickname-right {
  text-align: right;
}
.bubble {
  padding: 10px;
  border-radius: 10px;
  background-color: #f0f0f0;
  white-space: pre-wrap;
}
.bubble-me {
  background-color: #a0e75a;
}
.time {
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 5px;
}
.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}
input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.send-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-left: 10px;
  font-size: 5px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  margin-left: 10px;
}
.options {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #f8f8f8;
}
.options button {
  width: 70px;
  height: 70px;
  text-align: center;
  font-size: 15px;
  line-height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
