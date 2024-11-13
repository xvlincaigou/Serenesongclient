<template>
  <view class="container">
    <!-- 搜索框和添加好友按钮 -->
    <view class="search-bar">
      <input placeholder="搜索好友" v-model="searchText" />
      <button class="add-btn" @click="navigateTo('addFriend')">+</button>
    </view>

    <!-- 好友列表 -->
    <scroll-view scroll-y class="friend-list">
      <view class="friend-item" v-for="(friend, index) in filteredFriends" :key="index" @click="navigateToChat(friend)">
        <image class="avatar" :src="friend.avatar" />
        <view class="info">
          <text class="nickname">{{ friend.nickname }}</text>
          <text class="last-message">{{ truncatedMessage(friend.lastMessage) }}</text>
          <text class="time">{{ friend.time }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      friends: [
        { nickname: "苏轼", avatar: "/static/dialog/avatar1.png", lastMessage: "大江东去浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。", time: "10:30" },
        { nickname: "辛弃疾", avatar: "/static/dialog/avatar2.png", lastMessage: "青山遮不住，毕竟东流去。江晚正愁余，山深闻鹧鸪。", time: "11:00" },
        { nickname: "柳永", avatar: "/static/dialog/avatar3.png", lastMessage: "东南形胜", time: "12:15" },
        { nickname: "晏殊", avatar: "/static/dialog/avatar4.png", lastMessage: "一曲新词酒一杯", time: "14:05" },
        { nickname: "李清照", avatar: "/static/dialog/avatar5.png", lastMessage: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。", time: "15:30" },
        { nickname: "陆游", avatar: "/static/dialog/avatar6.png", lastMessage: "[图片]", time: "16:45" },
        { nickname: "李白", avatar: "/static/dialog/avatar7.png", lastMessage: "故人西辞黄鹤楼", time: "17:45" },
        { nickname: "杜甫", avatar: "/static/dialog/avatar8.png", lastMessage: "风急天高猿啸哀", time: "17:00" },
        { nickname: "许霖", avatar: "/static/dialog/avatar9.png", lastMessage: "软工前端写完了吗！！", time: "0:00" }
      ]
    };
  },
  computed: {
    filteredFriends() {
      if (!this.searchText) return this.friends;
      return this.friends.filter(friend =>
        friend.nickname.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },
  methods: {
    navigateTo(page) {
      uni.navigateTo({ url: `/pages/${page}/${page}` });
    },
    navigateToChat(friend) {
      uni.navigateTo({
        url: `/pages/dialog/chat/chat?nickname=${encodeURIComponent(friend.nickname)}&avatar=${encodeURIComponent(friend.avatar)}`
      });
    },
    truncatedMessage(message) {
      return message.length > 20 ? message.slice(0, 16) + "…" : message;
    }
  }
};
</script>

<style scoped>
.container { background-color: #f8f8f8; height: 100vh; }
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 10;
}
input {
  flex: 1;
  padding: 8px;
  border: none;
  background-color: #ffffff;
}
.add-btn {
  font-size: 18px;
  color: #333333;
  margin-left: 8px;
}

.friend-list {
  height: calc(800px); /* 调整高度，保证最多显示7个好友 */
  overflow-y: auto;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eeeeee;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 12px;
  margin-left: 12px;
  flex-shrink: 0;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.nickname {
  font-size: 16px;
  color: #333333;
  margin-bottom: 4px;
}
.last-message {
  font-size: 14px;
  color: #888888;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.time {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  color: #aaaaaa;
  margin-right: 12px;
}
</style>
