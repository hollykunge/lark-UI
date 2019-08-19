<template>
  <!-- 聊天记录的抽屉 -->
  <a-drawer
    :title="activeOption.drawerName"
    placement="right"
    :wrapStyle="{marginTop: '64px',overflow: 'auto', paddingBottom: '108px'}"
    :width="width"
    :closable="false"
    @close="onClose"
    :visible="visibleMode(activeOption.drawerType)"
    destroyOnClose
  >
    <history-msg v-if="activeOption.drawerType=='talkHistory'" :contactId="contactId" :isGroup="isGroup"></history-msg><!-- 聊天内容 -->
    <user-file-grabble v-else-if="activeOption.drawerType=='userFile'" :contactId="contactId"></user-file-grabble><!-- 一对一对话文件 -->
    <file-grabble v-else-if="activeOption.drawerType=='groupFile'" :contactId="contactId"></file-grabble><!-- 群文件 -->
    <team-member v-else-if="activeOption.drawerType=='teamMember'" :contactId="contactId"></team-member><!-- 组成员 -->
    <talk-setting v-else-if="activeOption.drawerType=='moreInfo'" :contactId="contactId"></talk-setting><!-- 群组信息 -->
  </a-drawer>
</template>
<script>
import historyMsg from './messageGrabble.vue'
import fileGrabble from './fileGrabble.vue'
import userFileGrabble from './UserFileGrabble.vue'
import teamMember from './TeamMember'
import talkSetting from './TalkSetting'
export default {
  name: 'TalkDrawer',
  components: {
    historyMsg,
    fileGrabble,
    userFileGrabble,
    teamMember,
    talkSetting
  },
  props: {
    activeOption: {
      type: Object,
      required: true
    },
    contactId: {
      type: String,
      default: '',
      required: true
    },
    isGroup: {
      type: String,
      default: '',
      required: false
    },
    width: {
      type: String,
      default: '500px',
      required: false
    }
  },
  data () {
    return {
      // 聊天框操作选项
      config: ['talkHistory', 'groupFile', 'userFile', 'moreInfo', 'personMoreInfo', 'teamMember']
    }
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.visible = false
      this.$emit('closeDrawer')
    },
    visibleMode (type) {
      return this.config.includes(type)
    }
  }
}
</script>
<style lang="less" scoped>
  body{
    .ant-drawer .ant-drawer-content {
      width: 100%;
      height: 92%;
    }
  }
  .ant-drawer .ant-drawer-content {
    width: 100%!important;
    height: 92%!important;
}
</style>
