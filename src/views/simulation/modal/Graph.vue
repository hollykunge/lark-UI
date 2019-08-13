<template>
  <a-modal
    title="系统交互图"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="destroyOnClose"
    :footer="null"
    width="700px"
  >
    <div id="panel">{{interfaceList}}</div>
  </a-modal>
</template>

<script>
export default {
  name: "Graph",
  data() {
    return {
      visible: false,
      destroyOnClose: true,
      interfaceList: []
    };
  },
  methods: {
    begin(activeDataTypes, activeModelNames, interfaceList) {
      this.interfaceList = interfaceList;
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
</style>
