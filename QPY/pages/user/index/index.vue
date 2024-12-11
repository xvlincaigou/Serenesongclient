<template>
  <view class="container">
    <!-- Profile Section -->
    <view class="section">
      <view class="avatar-wrapper">
        <image v-if="avatar" :src="avatar" @click="changeAvatar" class="avatar" />
        <view v-else class="avatar-placeholder" @click="changeAvatar"></view>
      </view>
      <view class="stats">
        <view class="stat-item" @click="navigateToWork()">
          <text class="stat-label">创作</text>
          <text class="stat-number">{{ creationCount }}</text>
        </view>
        <view class="stat-item" @click="navigateTo('favorites')">
          <text class="stat-label">收藏</text>
          <text class="stat-number">{{ favoritesCount }}</text>
        </view>
        <view class="stat-item" @click="navigateTo('friends')">
          <text class="stat-label">词友</text>
          <text class="stat-number">{{ friendsCount }}</text>
        </view>
      </view>
    </view>
    <view class="info">
      <text class="name">无尘\n</text>
      <text class="email">qingpingle@google.com\n</text>
      <text class="signature">个性签名...</text>
    </view>

    <!-- Edit Profile Button -->
    <button class="edit-profile" @click="navigateTo('editProfile')">修改资料</button>

    <!-- Tabs for 动态 and 作品 -->
    <view class="tabs">
      <text :class="{active: selectedTab === 'dynamic'}" @click="selectTab('dynamic')">我的动态</text>
      <text :class="{active: selectedTab === 'works'}" @click="selectTab('works')">代表作品</text>
    </view>

    <!-- Content Displayed Based on Tab Selection -->
    <scroll-view v-if="selectedTab === 'dynamic'" class="content" scroll-y="true">
      <view v-for="(post, index) in dynamicPosts" :key="index">
        <!-- Display post time outside of the post box -->
        <!-- 发动态的人的头像和昵称 -->
        <view class="post-header">
          <image :src="avatar" class="post-avatar"></image>
          <view class="post-info">
            <text class="post-nickname">{{ name }}</text>
            <view class="post-meta">
              <text class="post-category">{{ post.category }}</text>
              <text class="post-time">{{ formatDate(post.date) }}</text>
            </view>
          </view>
        </view>
        <!-- 动态内容 -->
        <view class="post" @click="viewPost(post)">
          <!-- 动态标题和内容 -->
          <view v-if="post.title">
            <text class="post-title">{{ post.title }}\n</text>
            <text class="post-content">{{ post.content }}</text>
          </view>
          <view v-else>
            <text class="post-content">{{ post.content }}</text>
          </view>
        </view>
        <!-- 动态操作按钮 -->
        <view class="post-actions">
          <button @click.stop="share(post)">分享 1788</button>
          <button @click.stop="comment(post)">评论 5000+</button>
          <button @click.stop="love(post)" :style="{backgroundColor: post.liked ? 'red' : 'white', color: post.liked ? 'white' : 'grey'}">点赞 1w+</button>
        </view>
      </view>
    </scroll-view>

    <scroll-view v-else class="content" scroll-y="true">
      <view class="UserWorks-list">
        <view v-if="publicUserWorks.length > 0">
          <view
            class="UserWorks-item"
            v-for="(work, index) in publicUserWorks"
            :key="index"
            @click="viewWork(work)"
          >
            <view class="UserWorks-header">
              <text class="UserWorks-title">
                {{ work.cipai[0] }} · {{ work.title }}
              </text>
              <text class="UserWorks-time">{{ formatDate(work.created_at) }}</text>
            </view>
          </view>
        </view>
        <view v-else class="no-UserWorks">
          <text>哎呀，没有公开的作品，试试去创作吧！</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseurl: getApp().globalData.baseURL,
      avatar: '',  // 默认未选择头像
      name: "我",
      favoritesCount: 0,       // 收藏数量
      creationCount: 0,        // 创作数量
      friendsCount: 0,         // 词友数量
      selectedTab: 'dynamic',  // 默认选择的标签
      token: "",
      userWorks: [],            // 用户所有作品
      dynamicPosts: [
        {
          title: "钗头凤--陆游",
          content: "酥手为何而红？",
          date: "2023-12-18",
          category: '词评',
          liked: false,
          detail: "红酥手，黄縢酒，满城春色宫墙柳。",
        },
        {
          title: "春夜喜雨",
          content: "好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。\n野径云俱黑，江船火独明。\n晓看红湿处，花重锦官城。",
          date: "2024-4-5",
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "将进酒",
          content: "君不见，黄河之水天上来，奔流到海不复回。",
          date: "2024-6-9",
          category: '作品',
          liked: false,
          detail: "",
        },
        {
          title: "",
          content: "《七律·长征》真是一首好诗！在这首诗中，伟人用极高的革命乐观主义精神和极高的大无畏精神，绘就了一幅“红军不怕远征难”的壮阔画卷，时至今日，依然令人深受感动、备受鼓舞。",
          date: "2024-10-18",
          category: '观点',
          liked: false,
          detail: "",
        },
        {
          title: "长恨歌--白居易",
          content: "",
          date: "2024-11-5",
          category: '推荐',
          liked: false,
          detail: "汉皇重色思倾国，御宇多年求不得。",
        },
      ]
    };
  },
  computed: {
    // 计算公开的作品
    publicUserWorks() {
      return this.userWorks.filter(work => work.is_public);
    }
  },
  onShow() {
    this.getFavoritesCount(); // 获取收藏数量
    this.getWorksCount();     // 获取作品数量
    this.fetchResults();      // 获取所有作品
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
    navigateTo(page) {
      uni.navigateTo({ url: `/pages5_user/${page}/${page}` });
    },
    navigateToWork() {
      uni.navigateTo({
        url: `/pages3_write/userWorkList/userWorkList`
      });
    },
    getFavoritesCount() {
      const token = uni.getStorageSync('userToken');
      if (token) {
        this.token = token;
        console.log('token:', token);
        uni.request({
          url: `${this.baseurl}/getCollectionItemCount?token=${this.token}`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              console.log('收藏数量:', res.data.count);
              this.favoritesCount = res.data.count;
            } else {
              uni.showToast({
                title: '获取收藏数失败',
                icon: 'none',
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: '请求失败',
              icon: 'none',
            });
          }
        });
      } else {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
      }
    },
    getWorksCount() {
      const token = uni.getStorageSync('userToken');
      if (token) {
        this.token = token;
        uni.request({
          url: `${this.baseurl}/getMyWorks?token=${this.token}&kind=UserWorks`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              console.log('作品:', res.data.UserWorks.length);
              this.creationCount = res.data.UserWorks.length;
            } else {
              uni.showToast({
                title: '获取作品数失败',
                icon: 'none',
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: '请求失败',
              icon: 'none',
            });
          }
        });
      } else {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
      }
    },
    fetchResults() {
      if (!this.token) {
        this.token = uni.getStorageSync('userToken');
      }
      if (!this.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        return;
      }
      const baseurl = this.baseurl;
      console.log('Fetching user works with token:', this.token);
      uni.request({
        url: `${baseurl}/getMyWorks?token=${this.token}&kind=UserWorks`,
        method: 'GET',
        success: (res) => {
          console.log('API response:', res);
          if (res.statusCode === 200 && res.data) {
            this.userWorks = res.data.UserWorks || [];
            console.log('获取到的所有作品:', this.userWorks);
          } else {
            console.error('API error:', res);
            uni.showToast({
              title: '获取作品失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          console.error('API request failed:', err);
          uni.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
          });
        },
      });
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    viewPost(post) {
      uni.navigateTo({
        url: `/pages5_user/postDetail/postDetail?title=${encodeURIComponent(post.title)}&date=${post.date}&content=${encodeURIComponent(post.content)}&avatar=${encodeURIComponent(this.avatar)}&nickname=${encodeURIComponent(this.name)}&category=${encodeURIComponent(post.category)}&detail=${encodeURIComponent(post.detail)}`
      });
    },
    share(item) {
      uni.showToast({
        title: '分享逻辑',
        icon: 'none',
        duration: 3000
      });
    },
    comment(item) {
      uni.navigateTo({
        url: `/pages5_user/postDetail/postDetail?title=${encodeURIComponent(item.title)}&date=${item.date}&content=${encodeURIComponent(item.content)}&avatar=${encodeURIComponent(this.avatar)}&nickname=${encodeURIComponent(this.name)}&category=${encodeURIComponent(item.category)}&detail=${encodeURIComponent(item.detail)}`
      });
    },
    love(item) {
      item.liked = !item.liked;
    },
    viewWork(work) {
      uni.navigateTo({ 
        url: `/pages3_write/userWorkDetail/userWorkDetail?UserWork=${encodeURIComponent(JSON.stringify(work))}` 
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
  background-color: #ffffff;
  min-height: 100vh;
}

/* Existing styles for profile, stats, etc. */

.section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar-wrapper {
  width: 100px;
  height: 100px;
  margin-right: 10px;
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: grey;
}
.info {
  margin-top: 10px;
}
.name {
  font-size: 18px;
  font-weight: bold;
}
.email {
  font-size: 14px;
  color: grey;
}
.signature {
  font-size: 12px;
  color: grey;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-left: 30px;
  margin-right: 30px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  margin-left: 10px;
}
.stat-label {
  font-size: 14px;
  text-align: center;
}
.stat-number {
  font-size: 14px;
  text-align: center;
  margin-top: 4px;
}

.edit-profile {
  width: 100%;
  margin: 12px 0;
  padding: 10px 0;
  font-size: 14px;
  background-color: white;
  color: black;
  border: 1px solid grey;
  border-radius: 4px;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
  border-bottom: 1px solid darkgray;
}
.tabs text {
  flex: 1;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
  color: black;
  cursor: pointer;
}
.active {
  border-bottom: 2px solid black;
  font-weight: bold;
}

.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0px;
  margin-right: 50px;
  font-size: 14px;
}

/* Existing styles for dynamic posts */
.post-container {
  margin-bottom: 20px;
}
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
.post {
  background-color: #f0f0f0;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
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
  margin-bottom: 20px;
  cursor: pointer;
}

/* 新增的 UserWorks 样式 */
.UserWorks-item {
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.UserWorks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.UserWorks-title {
  font-size: 18px;
  font-weight: bold;
  word-break: break-word;
}

.UserWorks-time {
  font-size: 14px;
  color: #888888;
}

.no-UserWorks {
  padding: 12px;
  text-align: center;
  color: #999999;
}

/* 按钮悬停效果 */
button:hover {
  background-color: #e0e0e0;
}
</style>
