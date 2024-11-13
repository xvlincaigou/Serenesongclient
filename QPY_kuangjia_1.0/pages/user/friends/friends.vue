<template>
  <view class="friend-container">
    <view v-for="(friend, index) in friends" :key="index" class="friend-item" @click="viewFriendProfile(friend)">
      <image :src="friend.avatar" class="friend-avatar" />
      <text class="friend-name">{{ friend.name }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      friends: [
         { name: "好友A", avatar: "/static/dialog/avatar1.png" },
         { name: "好友B", avatar: "/static/dialog/avatar2.png" },
         { name: "好友C", avatar: "/static/dialog/avatar3.png" },
         { name: "好友D", avatar: "/static/dialog/avatar4.png" },
         { name: "好友E", avatar: "/static/dialog/avatar5.png" },
         { name: "好友F", avatar: "/static/dialog/avatar6.png" },
         { name: "好友G", avatar: "/static/dialog/avatar7.png" },
         { name: "好友H", avatar: "/static/dialog/avatar8.png" },
         { name: "好友I", avatar: "/static/dialog/avatar9.png" },
         { name: "好友K", avatar: "/static/dialog/avatar0.png" },
      ],
    };
  },
  methods: {
    viewFriendProfile(friend) {
      uni.navigateTo({ url: `/pages/user/friendProfile/friendProfile?name=${friend.name}&avatar=${friend.avatar}` });
    },
  },
};
</script>

<style>
.friend-container { padding: 16px; }
.friend-item { display: flex; align-items: center; margin-bottom: 16px; }
.friend-avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
.friend-name { font-size: 16px; }
</style>
