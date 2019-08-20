<!--
组件使用指南
组件功能：弹出框

使用方法：组件引入后，使用如下方法
        <user-model ref="model" @ok="handleSaveOk"/>
        this.$refs.model.begin(参数-传到子组件的参数，非必填)

         可自定义子组件的确认方法
         返回值结构同样为人员信息的JSON数组
-->
<template>
  <a-modal
    title="选择人员"
    :visible="memberVisible"
    @ok="clickOk"
    @cancel="handleCancel"
    width="1400px"
    :destroyOnClose="destroyOnClose"
  >
    <user-transfer ref="transfer" @ok="handleOk"/>
  </a-modal>
</template>
<script>
import UserTransfer from '@/components/admin/UserTransfer'
export default {
  name: 'UserModel',
  components: {
    UserTransfer
  },
  data () {
    return {
      // 默认关闭弹出框，未做保存操作，自动销毁操作内容
      destroyOnClose: true,
      // 弹出框可见
      memberVisible: false,
      userArr: [],
      returnUsers: [],
      returnUserids: []
    }
  },
  props: {
  },
  methods: {
    begin: function (userArr, filter) {
      this.userArr = userArr
      this.memberVisible = true
      // ref本身是作为渲染结果被创建的，在初始渲染时不能访问
      // $refs也不是响应式的，这里使用nexttick获取子组件对象
      this.$nextTick(() => {
        this.$refs.transfer.beginChooseUser(userArr, filter)
      })
    },
    handleOk (users, userids) {
      this.returnUsers = users
      this.returnUserids = userids
    },
    clickOk () {
      this.$emit('ok', this.returnUsers, this.returnUserids)
      this.memberVisible = false
    },
    /**
     * 取消操作
     */
    handleCancel () {
      this.$emit('close')
      this.memberVisible = false
    }
  }
}
</script>
