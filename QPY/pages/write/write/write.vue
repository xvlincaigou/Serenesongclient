<template>
  <view class="container">
    <text>正在加载词牌信息...</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cipaiName: '',
      formatNum: 0
    };
  },
  onLoad(options) {
    // 接收传递过来的参数
    this.cipaiName = options.cipai_name || '';
    this.formatNum = options.format_num || 0;
    // 发起请求获取数据
    this.fetchFormatData(this.cipaiName, this.formatNum);
  },
  methods: {
    fetchFormatData(cipaiName, formatNum) {
	  let baseurl = getApp().globalData.baseURL;
      const url = `${baseurl}/getFormat?cipai_name=${cipaiName}&format_num=${formatNum}`;
      uni.request({
        url: url,
        method: 'GET',
        success: (res) => {
          console.log('Data received:', res.data); // 打印返回的数据
        },
        fail: (err) => {
          console.error('Failed to fetch data:', err); // 打印错误信息
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
}
</style>
