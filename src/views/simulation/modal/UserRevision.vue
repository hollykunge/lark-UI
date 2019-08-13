<template>
  <a-modal
    title="人员及修改历史图"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="destroyOnClose"
    :footer="null"
    width="700px"
  >
    <div id="panel">
      <a-timeline mode="alternate">
        <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item color="green">Solve initial network problems 2015-09-01</a-timeline-item>
        <a-timeline-item>
          <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </a-timeline-item>
        <a-timeline-item color="red">Network problems being solved 2015-09-01</a-timeline-item>
        <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item>
          <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />Technical testing 2015-09-01
        </a-timeline-item>
      </a-timeline>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "UserRevision",
  data() {
    return {
      visible: false,
      destroyOnClose: true
    };
  },
  methods: {
    begin() {
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
