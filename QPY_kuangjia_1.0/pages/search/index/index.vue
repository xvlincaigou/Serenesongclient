<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input
        placeholder="搜索诗人、诗词、词牌"
        v-model="searchText"
        @focus="isFocused = true"
        @blur="handleBlur"
        autocomplete="on"
      />

      <!-- 搜索结果下拉框 -->
      <view class="search-dropdown" v-if="isFocused && searchText && filteredResults.length">
        <view
          class="dropdown-item"
          v-for="(result, index) in filteredResults"
          :key="index"
          @click="navigateToDetail(result)"
        >
          <text>{{ result.title }}</text>
        </view>、
      </view>
    </view>

    <!-- 每日推荐 -->
    <view class="daily-recommendation">
      <image class="recommendation-image" :src="recommendation.image" mode="widthFix" />
      <text class="recommendation-text">{{ recommendation.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      isFocused: false,
      recommendation: {
        text: "蝶恋花·暖雨晴风初破冻\n宋代：李清照\n暖雨晴风初破冻，柳眼梅腮，已觉春心动。\n酒意诗情谁与共？泪融残粉花钿重。\n乍试夹衫金缕缝，山枕斜欹，枕损钗头凤。\n独抱浓愁无好梦，夜阑犹剪灯花弄。",
        image: "/static/search/commit.png"
      },
      results: [
        { title: "李白", subtitle: "唐代浪漫主义诗人，被后世誉为'诗仙'，其诗歌以豪放、奔放著称，代表作有《将进酒》、《床前明月光》等。", type: "poet" },
        { title: "杜甫", subtitle: "唐代伟大的现实主义诗人，以其深刻的社会内容和艺术成就被尊称为'诗圣'，作品多反映时代生活和人民疾苦。", type: "poet" },
        { title: "苏轼", subtitle: "宋代杰出的文学家、思想家及书画家，政治生涯多舛，但在文学上有卓越成就，尤其擅长词，如《念奴娇·赤壁怀古》。", type: "poet" },
        { title: "白居易", subtitle: "唐代诗人，以内容明白易懂、情感真挚广泛著称于世，致力于使诗歌与民众生活紧密联系。", type: "poet" },
        { title: "李清照", subtitle: "宋代女诗人和词人，以才情与悲剧个人生活著称，被后世誉为'词中之后'，代表作有《声声慢》、《如梦令》等。", type: "poet" },
        { title: "王维", subtitle: "唐代诗人、画家，其诗以清新、含蓄见长，兼有山水田园之美，与孟浩然并称为'王孟'。", type: "poet" },
        { title: "李商隐", subtitle: "唐代著名诗人，诗风以艳丽深沉而知名，擅长写作七言绝句，被誉为晚唐诗歌的典范。", type: "poet" },
        { title: "辛弃疾", subtitle: "南宋著名词人，以豪放派代表人物著称，作品情感奔放激昂，常表现对国家和民族的热爱。", type: "poet" },
        { title: "陆游", subtitle: "南宋时期爱国诗人，作品表现了对抗金人入侵的爱国热情，晚年作品多感时伤世、表达个人悲凉情绪。", type: "poet" },
        { title: "杜牧", subtitle: "唐代著名诗人，擅长七言绝句，作品多感时伤事，兼具儒家的忧患意识和道家的隐逸思想。", type: "poet" },
        { title: "王昌龄", subtitle: "唐代著名边塞诗人，与高适并称，其诗多描写战争的悲壮与将士的忧愁，如《出塞》等。", type: "poet" },
        { title: "陶渊明", subtitle: "东晋时期的诗人，被后世尊为田园诗的开创者，以其隐逸生活和崇尚自然的诗风闻名，代表作《桃花源记》。", type: "poet" },
        { title: "孟浩然", subtitle: "唐代山水田园诗人，与王维齐名，其诗作多表现出与自然景物融为一体的意境。", type: "poet" },
        { title: "柳宗元", subtitle: "唐代文学家，政治家，因直言进谏被贬，晚年创作了大量反映社会现实和自然美的散文和诗歌。", type: "poet" },
        { title: "韩愈", subtitle: "唐代文学革新的领军人物，倡导古文运动，强调文以载道，作品兼具文学性与哲学性，有《师说》、《马说》等散文名作。", type: "poet" },
        { title: "贺知章", subtitle: "唐代初期诗人，以简洁明快的风格和对日常生活的细致观察著称，代表作《咏柳》。", type: "poet" },
        { title: "王勃", subtitle: "唐代杰出的文学家，与杨炯、卢照邻、骆宾王并称初唐四杰，以《滕王阁序》的辞赋闻名。", type: "poet" },
      
        { title: "满江红", subtitle: "激昂慷慨的词牌名，常用以表达壮志未酬的情感，辛弃疾的《满江红·写怀》是代表作。", type: "cipai" },
        { title: "念奴娇·赤壁怀古", subtitle: "苏轼的名作，以赤壁之战为背景，抒发了对古人英雄的怀念以及对战争的反思。", type: "cipai" },
        { title: "虞美人", subtitle: "表达离别之情的词牌名，由南唐后主李煜所创，多用于表达失落与哀愁。", type: "cipai" },
        { title: "水调歌头", subtitle: "苏轼所作，尤以《明月几时有》一词传唱至今，歌颂中秋月夜的圆满与人间的团圆愿景。", type: "cipai" },
        { title: "青玉案", subtitle: "辛弃疾所作的词牌名，词作多表达对国事的关切与个人壮志的表达，典型作品有《元夕》。", type: "cipai" },
        { title: "声声慢", subtitle: "李清照的代表作之一，以其细腻的笔触和深沉的情感，表达了对逝去美好时光的缅怀与哀思。", type: "cipai" },
        { title: "雨霖铃", subtitle: "柳永的著名词作，以其凄美的旋律和对爱情失落的深刻表达，传达了作者的哀愁与无奈。", type: "cipai" },
        { title: "浣溪沙", subtitle: "一种流行于宋代的词牌，常用于写景咏情，风格轻快活泼，适合抒发柔情蜜意。", type: "cipai" },
      
        { title: "将进酒", subtitle: "李白的名作，诗中以酒为媒，表达了诗人对人生自由奔放的追求与豪放的人生态度。", type: "poem" },
        { title: "静夜思", subtitle: "李白的短诗，描绘了夜晚思乡的情景，通过简洁的语言展现了诗人对家乡的深切思念。", type: "poem" },
        { title: "早发白帝城", subtitle: "李白的著名山水诗，以壮丽的山水描写和悠扬的情感，展现了早晨的白帝城的壮观景色。", type: "poem" },
        { title: "春望", subtitle: "杜甫的名篇，通过对战后荒凉景象的描述，表达了诗人对国破家亡的深切痛感。", type: "poem" },
        { title: "茅屋为秋风所破歌", subtitle: "杜甫的反映个人生活苦难与社会现实的作品，通过对破败茅屋的描写，喻示社会的动荡不安。", type: "poem" },
        { title: "登鹳雀楼", subtitle: "王之涣的短诗，以鹳雀楼广阔的视野为背景，表达了诗人高远的志向和对未来的憧憬。", type: "poem" },
        { title: "游子吟", subtitle: "孟郊的短诗，以母子之情为主题，深情地表达了母亲对远行儿子的关切与牵挂。", type: "poem" },
        { title: "枫桥夜泊", subtitle: "张继的古典诗作，通过对寒夜泊船景象的描绘，反映了诗人旅途中的孤独与凄清。", type: "poem" },
        { title: "黄鹤楼", subtitle: "崔颢的古典诗作，通过黄鹤楼的历史变迁来抒发诗人对人世沧桑的感慨。", type: "poem" },
        { title: "滕王阁序", subtitle: "王勃的散文，以其华丽的辞藻和深邃的思想，描写了滕王阁的壮丽与历史背景。", type: "poem" },
        { title: "桃花源记", subtitle: "陶渊明的代表作，描绘了一个理想化的避世乐土，象征着人们对美好生活的向往。", type: "poem" }
      ]


    };
  },
  computed: {
    filteredResults() {
      if (!this.searchText) return [];
      return this.results.filter(result =>
        result.title.includes(this.searchText)
      );
    }
  },
  methods: {
    navigateToDetail(result) {
	  uni.navigateTo({
	    url: `/pages/search/result/result?title=${encodeURIComponent(result.title)}&subtitle=${encodeURIComponent(result.subtitle)}&type=${encodeURIComponent(result.type)}`
	  });
    },
    handleBlur() {
      setTimeout(() => {
        this.isFocused = false;
      }, 100);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.search-bar {
  position: relative;
  padding: 8px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #dddddd;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: #ffffff;
}

.search-dropdown {
  position: absolute;
  top: 56px; /* 搜索框高度 + padding */
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item text {
  font-size: 16px;
  color: #333333;
}

.daily-recommendation {
  padding: 5px;
  text-align: center;
}

.recommendation-image {
  width: 100%;
  height: auto;
  margin-bottom: 25px;
}

.recommendation-text {
  font-size: 16px; 
  color: #5d5d5d;
}

</style>
