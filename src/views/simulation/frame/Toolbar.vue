<template>
  <div id="toolbar">
    <i data-command="undo" class="command iconfont icon-undo" title="撤销" />
    <i data-command="redo" class="command iconfont icon-redo" title="重做" />
    <span class="separator" />
    <i data-command="copy" class="command iconfont icon-copy-o" title="复制" />
    <i data-command="paste" class="command iconfont icon-paster-o" title="粘贴" />
    <i data-command="delete" class="command iconfont icon-delete-o" title="删除" />
    <span class="separator" />
    <i data-command="zoomIn" class="command iconfont icon-zoom-in-o" title="放大" />
    <i data-command="zoomOut" class="command iconfont icon-zoom-out-o" title="缩小" />
    <i data-command="autoZoom" class="command iconfont icon-fit" title="适应画布" />
    <i data-command="resetZoom" class="command iconfont icon-actual-size-o" title="实际尺寸" />
    <span class="separator" />
    <i data-command="toBack" class="command iconfont icon-to-back" title="层级后置" />
    <i data-command="toFront" class="command iconfont icon-to-front" title="层级前置" />
    <span class="separator" />
    <!-- <i data-command="multiSelect" class="command iconfont icon-select" title="多选" />
    <i data-command="addGroup" class="command iconfont icon-group" title="成组" />
    <i data-command="unGroup" class="command iconfont icon-ungroup" title="解组" />
    <span class="separator" />-->
    <i class="label_text">线条类型：</i>
    <a-select defaultValue="line" style="width: 80px" size="small" @change="handleChangeLineType">
      <a-select-option value="line">直线</a-select-option>
      <a-select-option value="flow-smooth">圆线</a-select-option>
      <a-select-option value="flow-polyline-round">折线</a-select-option>
    </a-select>
    <span class="separator" />
    <i class="label_text">网格开关：</i>
    <a-switch size="small" v-model="isGridOn" @change="onChangeGrid" />
    <span class="separator" />
    <a-button
      type="primary"
      icon="save"
      size="small"
      style="width: 70px"
      @click="$emit('saveAll')"
    >保存</a-button>
    <span class="separator" />
    <a-tooltip placement="bottom">
      <template slot="title">
        <span>
          1.从画面左侧拖动模型进入中间建模区域；
          2.模型下方具有输出连接点；
          3.总线上具有输入连接点；
          4.连接输出点和输入点；
          5.点击空白处设置系统详情和数据结构；
          6.点击模型设置模型属性和输入输出；
          7.可通过点击总线查看模型交互关系图。
        </span>
      </template>
      <span class="tooltip-icon" />使用说明
    </a-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "toolbar",
      isGridOn: false
    };
  },
  watch: {},
  methods: {
    handleChangeLineType(value) {
      this.$emit("change-eage", value);
    },
    onChangeGrid() {
      this.$emit("grid-switch", this.isGridOn);
    }
  }
};
</script>

<style lang="less">
#toolbar {
  padding: 6px 0px;
  width: 100%;
  border: 1px solid #e9e9e9;
  height: 42px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
  text-align: left;
}
#toolbar *::before {
  font-size: 16px !important;
}
#toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}
#toolbar .icon-select.disable {
  background: #eeeeee;
}
#toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
#toolbar .command {
  width: 27px;
  height: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 0px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}
#toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
#toolbar .command:hover {
  cursor: pointer;
  border: 1px solid #e9e9e9;
}
#toolbar .disable:hover {
  cursor: default;
  border: 1px solid rgba(2, 2, 2, 0);
}
#toolbar .label_text {
  font-family: Microsoft Yahei;
  font-size: 14px;
  font-style: normal;
}
#toolbar .tooltip-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  margin-bottom: 5px;
  background: url(../../assets/tooltip.png) no-repeat 0 center;
}
</style>
