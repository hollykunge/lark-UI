<template>
  <div id="navigator">
    <div class="pannel-title">建模概览</div>
    <div id="minimap" />
    <div id="zoom-slider">
      <a-slider
        v-model="curZoomValue"
        :min="minZoom"
        :max="maxZoom"
        :step="0.01"
        :tipFormatter="formatter"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    curZoom: {
      type: Number
    },
    minZoom: {
      type: Number
    },
    maxZoom: {
      type: Number
    }
  },
  data() {
    return {
      curZoomValue: this.curZoom
    };
  },
  watch: {
    curZoomValue: _.throttle(function(value) {
      this.$emit("change-zoom", value);
    }, 100)
  },
  methods: {
    formatter(value) {
      return `${(value * 100).toFixed(0)}%`;
    }
  }
};
</script>
<style lang="less">
#navigator {
  width: 300px;
  height: 282px;
  position: absolute;
  border: 2px solid #e9e9e9;
  bottom: 0px;
  right: 0px;
  z-index: 3;
}
#zoom-slider {
  padding: 0px 5px;
}
</style>
