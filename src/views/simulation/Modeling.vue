<template>
  <model-editor :flow-data="data" />
</template>

<script>
import ModelEditor from "./editor/ModelEditor";

export default {
  components: { ModelEditor },
  data() {
    return {
      data: {
        nodes: [
          {
            shape: "bus",
            type: "bus",
            x: 500,
            y: 300,
            id: "2efd998c",
            index: 0
          }
        ]
      }
    };
  }
};
</script>
<style lang="less">
</style>
