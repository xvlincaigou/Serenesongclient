<!-- index.vue -->
<template>
  <view class="container">
    <!-- 好友列表 -->
    <scroll-view scroll-x="true" class="friend-list">
      <view class="friend-list-container">
        <view v-for="(friend, index) in friends" :key="index" class="friend-item">
          <image :src="friend.avatar" class="friend-avatar" @click="viewFriend(friend)"></image>
          <text class="friend-name">{{ friend.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 动态和作品的标签 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'allPost'}" @click="selectTab('allPost')">全部动态</text>
      <text :class="{active: selectedTab === 'friendPost'}" @click="selectTab('friendPost')">词友动态</text>
    </view>

    <!-- 根据选择的标签显示内容 -->
    <scroll-view v-if="selectedTab === 'allPost'" class="content" scroll-y="true">
      <view v-for="(apost, index) in allPosts" :key="index" class="post-container">
        <!-- 发动态的人的头像和昵称 -->
        <view class="post-header">
          <image :src="apost.avatar" class="post-avatar"></image>
          <view class="post-info">
            <text class="post-nickname">{{ apost.nickname }}</text>
            <view class="post-meta">
              <text class="post-category">{{ apost.category }}</text>
              <text class="post-time">{{ apost.date }}</text>
            </view>
          </view>
        </view>
        <!-- 动态内容 -->
        <view class="post" @click="viewPost(apost)">
          <!-- 动态标题和内容 -->
          <view v-if="apost.title">
            <text class="post-title">{{ apost.title }}\n</text>
            <text class="post-content">{{ apost.content }}</text>
          </view>
          <view v-else>
            <text class="post-content">{{ apost.content }}</text>
          </view>
        </view>
        <!-- 动态操作按钮 -->
        <view class="post-actions">
          <button @click.stop="share(apost)">分享 1788</button>
          <button @click.stop="comment(apost)">评论 5000+</button>
          <button @click.stop="love(apost)" :style="{backgroundColor: apost.liked ? 'red' : 'white', color: apost.liked ? 'white' : 'grey'}">点赞 1w+</button>
        </view>
      </view>
    </scroll-view>

    <!-- 词友动态 -->
    <scroll-view v-else class="content" scroll-y="true">
      <view v-for="(fpost, index) in friendPost" :key="index" class="post-container">
        <!-- 发动态的人的头像和昵称 -->
        <view class="post-header">
          <image :src="fpost.avatar" class="post-avatar"></image>
          <view class="post-info">
            <text class="post-nickname">{{ fpost.nickname }}</text>
            <view class="post-meta">
              <text class="post-category">{{ fpost.category }}</text>
              <text class="post-time">{{ fpost.date }}</text>
            </view>
          </view>
        </view>
        <!-- 动态内容 -->
        <view class="post" @click="viewPost(fpost)">
          <!-- 动态标题和内容 -->
          <view v-if="fpost.title">
            <text class="post-title">{{ fpost.title }}\n</text>
            <text class="post-content">{{ fpost.content }}</text>
          </view>
          <view v-else>
            <text class="post-content">{{ fpost.content }}</text>
          </view>
        </view>
        <!-- 动态操作按钮 -->
        <view class="post-actions">
          <button @click.stop="share(fpost)">分享 2000+</button>
          <button @click.stop="comment(fpost)">评论 40</button>
          <button @click.stop="love(fpost)" :style="{backgroundColor: fpost.liked ? 'red' : 'white', color: fpost.liked ? 'white' : 'grey'}">点赞 953</button>
        </view>
      </view>
    </scroll-view>

    <!-- 悬浮的蓝色圆形按钮 -->
    <button class="floating-button" @click="createPost()">
      <text class="plus-icon">+</text>
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: 'allPost',  // 默认选择的标签
      friends: [
        { name: '好友1', avatar: '/static/dialog/avatar0.png' },
        { name: '好友2', avatar: '/static/dialog/avatar0.png' },
        { name: '好友3', avatar: '/static/dialog/avatar0.png'},
        { name: '好友4', avatar: '/static/dialog/avatar0.png' },
        { name: '好友5', avatar: '/static/dialog/avatar0.png'},
        { name: '好友6', avatar: '/static/dialog/avatar0.png' },
      ],
      allPosts: [
        {
          title: "钗头凤--陆游",
          content: "酥手为何而红？",
          date: "2023-12-18",
          avatar: '/static/dialog/avatar0.png',
          nickname: '用户1',
          category: '词评',
          liked: false,
          detail: "红酥手，黄縢酒，满城春色宫墙柳。",
        },
        {
          title: "春夜喜雨",
          content: "好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。\n野径云俱黑，江船火独明。\n晓看红湿处，花重锦官城。",
          date: "2024-4-5",
          avatar: '/static/dialog/avatar0.png',
          nickname: '用户2',
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "将进酒",
          content: "君不见，黄河之水天上来，奔流到海不复回。",
          date: "2024-6-9",
          avatar: '/static/dialog/avatar0.png',
          nickname: '用户3',
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "",
          content: "《七律·长征》真是一首好诗！在这首诗中，伟人用极高的革命乐观主义精神和极高的大无畏精神，绘就了一幅“红军不怕远征难”的壮阔画卷，时至今日，依然令人深受感动、备受鼓舞。",
          date: "2024-10-18",
          avatar: '/static/dialog/avatar0.png',
          nickname: '用户4',
          category: '观点',
          liked: false,
          detail: "",
        },
        {
          title: "长恨歌--白居易",
          content: "",
          date: "2024-11-5",
          avatar: '/static/dialog/avatar0.png',
          nickname: '用户5',
          category: '推荐',
          liked: false,
          detail: "汉皇重色思倾国，御宇多年求不得。",
        },
      ],
      friendPost: [
        {
          title: "蝶恋花·庭院深深深几许",
          content: "庭院深深深几许，杨柳堆烟，帘幕无重数。",
          date: "2024-11-03",
          avatar: '/static/dialog/avatar0.png',
          nickname: '好友A',
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "青玉案·元夕",
          content: "东风夜放花千树，更吹落、星如雨。",
          date: "2024-11-07",
          avatar: '/static/dialog/avatar0.png',
          nickname: '好友B',
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "水调歌头--苏轼",
          content: "是怀月，亦是怀人。\n是怀子由，更是怀自己。",
          date: "2024-11-11",
          avatar: '/static/dialog/avatar0.png',
          nickname: '好友C',
          category: '词评',
          liked: false,
          detail: "明月几时有，把酒问青天。\n不知天上宫阙，今夕是何年？",
        }
      ]
    };
  },
  methods: {
      selectTab(tab) {
        this.selectedTab = tab;
      },
      viewPost(post) {
        // 根据post的内容构建跳转链接
        const params = `title=${encodeURIComponent(post.title)}&date=${post.date}&content=${encodeURIComponent(post.content)}&avatar=${encodeURIComponent(post.avatar)}&nickname=${encodeURIComponent(post.nickname)}&category=${encodeURIComponent(post.category)}&detail=${encodeURIComponent(post.detail)}`;
        uni.navigateTo({ url: `/pages2_community/postDetail/postDetail?${params}` });
      },
      share(item) {
        // 分享逻辑
        uni.showToast({
          title: '分享逻辑',
          icon: 'none',
          duration: 3000
        });
      },
      comment(item) {
        // 根据item的内容构建跳转链接
        const params = `title=${encodeURIComponent(item.title)}&date=${item.date}&content=${encodeURIComponent(item.content)}&avatar=${encodeURIComponent(item.avatar)}&nickname=${encodeURIComponent(item.nickname)}&category=${encodeURIComponent(item.category)}&detail=${encodeURIComponent(item.detail)}`;
        uni.navigateTo({ url: `/pages2_community/postDetail/postDetail?${params}` });
      },
      love(item) {
        // 点赞逻辑
        item.liked = !item.liked;
      },
      viewFriend(friend) {
        // 查看好友资料逻辑
        const params = `name=${encodeURIComponent(friend.name)}&avatar=${encodeURIComponent(friend.avatar)}`;
        uni.navigateTo({ url: `/pages2_community/friendProfile/friendProfile?${params}` });
      },
      createPost() {
        // 创建新帖子逻辑
        uni.navigateTo({ url: `/pages2_community/createPost/createPost` });
      }
    }
  };
</script>

<style>
.container {
  padding: 16px;
  position: relative;
}

/* 好友列表样式 */
.friend-list {
  overflow-x: auto;
  margin-bottom: 16px;
}

.friend-list-container {
  display: flex;
  flex-direction: row;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  margin-right: 16px;
}

.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}

.friend-name {
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
}

/* 标签样式 */
.tabs {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
}

.tabs text {
  flex: 1;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: black;
}

.active {
  border-bottom: 2px solid black;
}

/* 内容样式 */
.content {
  max-height: 2000px;
  overflow-y: auto;
  padding: 0px;
  font-size: 10px;
}

/* 单个动态容器 */
.post-container {
  margin-bottom: 20px;
}

/* 发动态的人的信息 */
.post-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
}

.post-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.post-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.post-nickname {
  font-size: 16px;
}

.post-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.post-category {
  font-size: 12px;
  color: grey;
  margin-right: 8px;
}

.post-time {
  font-size: 12px;
  color: grey;
}

/* 动态内容样式 */
.post {
  background-color: #f0f0f0;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  word-break: break-word;
}

.post-content {
  font-size: 14px;
  color: grey;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  max-width: 100%;
}

/* 操作按钮样式 */
.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.post-actions button {
  font-size: 12px;
  color: grey;
  background-color: white;
  border: none;
}

/* 悬浮按钮样式 */
.floating-button {
  position: fixed;
  bottom: 60px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #fadbff;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.plus-icon {
  color: #fff;
  font-size: 36px;
}
</style>
