<template>
  <div>
    <ul class="faces">
      <li v-for="item in faceList" :key="item">
        <img :src="faceMap[item]" @click="insertFace(item)"/>
      </li>
    </ul>
    <div class="clear"></div>
  </div>
</template>
<script>

export default {
  name: 'Faces',
  components: {},
  data () {
    return {
      faceList: [
        '[微笑]', '[嘻嘻]', '[哈哈]', '[可爱]', '[可怜]', '[挖鼻]', '[吃惊]', '[害羞]',
        '[挤眼]', '[闭嘴]', '[鄙视]', '[爱你]', '[泪]', '[偷笑]', '[亲亲]', '[生病]',
        '[太开心]', '[白眼]', '[右哼哼]', '[左哼哼]', '[嘘]', '[衰]', '[委屈]', '[吐]',
        '[哈欠]', '[抱抱]', '[怒]', '[疑问]', '[馋嘴]', '[拜拜]', '[思考]', '[汗]',
        '[困]', '[睡]', '[钱]', '[失望]', '[酷]', '[色]', '[哼]', '[鼓掌]',
        '[晕]', '[悲伤]', '[抓狂]', '[黑线]', '[阴险]', '[怒骂]', '[互粉]', '[心]',
        '[伤心]', '[猪头]', '[熊猫]', '[兔子]', '[ok]', '[耶]', '[good]', '[NO]',
        '[赞]', '[来]', '[弱]', '[草泥马]', '[神马]', '[囧]', '[浮云]', '[给力]',
        '[围观]', '[威武]', '[奥特曼]', '[礼物]', '[钟]', '[话筒]', '[蜡烛]', '[蛋糕]'
      ]
    }
  },
  computed: {
    faceMap () {
      const arr = {}
      this.faceList.forEach((item, index) => {
        arr[item] = '/face/' + (index + 1) + '.png'
      })
      return arr
    }
  },
  methods: {
    insertFace: function (item) {
      this.$emit('insertFace', item)
    }
  }
}
</script>

<style scoped lang="less">
.faces {
  width: 30.5rem;
  padding-inline-start: 0px;
  list-style: none;
  background-color: #ffffff;
  border: 1px solid #f0f5ff;
  display: block;
  height: 25rem;
  li {
    width: 3rem;
    height: 3rem;
    display: inline-block;
    padding: 4px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
