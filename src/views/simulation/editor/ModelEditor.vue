<template>
  <div id="editor">
    <toolbar @grid-switch="gridSwitch" @saveAll="saveData" @change-eage="changeEage" />
    <div :style="{height:'42px'}" />
    <div class="bottom-container">
      <context-menu />
      <div id="itempannel">
        <ul>
          <li class="getItem" data-shape="adams" data-type="node" data-size="80*80">
            <span class="adams-type-icon" />ADAMS模型
          </li>
          <li class="getItem" data-shape="matlab" data-type="node" data-size="80*80">
            <span class="matlab-type-icon" />MATLAB模型
          </li>
          <li class="getItem" data-shape="c" data-type="node" data-size="80*80">
            <span class="c-type-icon" />C模型
          </li>
          <li class="getItem" data-shape="simulink" data-type="node" data-size="80*80">
            <span class="simulink-type-icon" />SIMULINK模型
          </li>
        </ul>
      </div>
      <div id="detailpannel">
        <div data-status="node-selected" class="pannel">
          <div class="pannel-title">模型详情</div>
          <div class="block-container">
            <div v-if="selectedModel && selectedModel.type === 'node'">
              <a-form layout="horizontal">
                <a-form-item label="模型名称：" :label-col="{ span: 6 }">
                  <a-input v-model="inputModelName" class="model-input" placeholder="请输入模型名" />
                </a-form-item>
                <a-form-item label="模型描述：" :label-col="{ span: 6 }">
                  <a-input class="model-input" placeholder="请输入模型描述" />
                </a-form-item>
                <a-form-item label="模型IP：" :label-col="{ span: 6 }">
                  <a-input class="model-input" placeholder="请输入IP" />
                </a-form-item>
                <a-form-item label="通信端口：" :label-col="{ span: 6 }">
                  <a-select mode="tags" class="model-input" :tokenSeparators="[',']" />
                </a-form-item>
                <a-form-item>
                  <a-button
                    class="model-button"
                    type="primary"
                    size="small"
                    style="height: 25px"
                    @click="changeModelName"
                  >确认修改</a-button>
                  <a-button
                    class="model-button"
                    type="dashed"
                    size="small"
                    style="height: 25px"
                    icon="right-circle"
                    @click="onShowInterface"
                  >查看模型输入输出</a-button>
                </a-form-item>
              </a-form>
            </div>
            <div v-if="selectedModel && selectedModel.type === 'bus'">
              <div class="bus-container">这是一条普通的仿真总线</div>
            </div>
          </div>
        </div>
        <!-- <div id="edge_detailpannel" data-status="edge-selected" class="pannel">
          <div class="pannel-title">连接线详情</div>
          <div class="block-container">在这里显示接口属性，功能开发中。。。</div>
        </div>-->
        <!-- <div id="group_detailpannel" data-status="group-selected" class="pannel">
          <div class="pannel-title">群组详情</div>
          <div class="block-container">在这里显示群组属性，功能开发中。。。</div>
        </div>-->
        <div id="canvas_detailpannel" data-status="canvas-selected" class="pannel">
          <div class="pannel-title">系统详情</div>
          <div class="block-container">
            <a-form layout="horizontal">
              <a-form-item label="系统名称：" :label-col="{ span: 6 }">
                <a-input class="model-input" placeholder="请输入系统名称" />
              </a-form-item>
              <a-form-item label="系统类型：" :label-col="{ span: 6 }">
                <a-input class="model-input" placeholder="请输入系统类型" />
              </a-form-item>
              <a-form-item label="系统描述：" :label-col="{ span: 6 }">
                <a-input class="model-input" placeholder="请输入系统描述" />
              </a-form-item>
              <a-form-item label="数据结构：" :label-col="{ span: 6 }">
                <a-button
                  type="dashed"
                  size="small"
                  style="height: 25px"
                  icon="right-circle"
                  @click="onShowDataType"
                >查看系统内数据结构</a-button>
              </a-form-item>
              <a-form-item label="系统交互" :label-col="{ span: 6 }">
                <a-button
                  type="dashed"
                  size="small"
                  style="height: 25px"
                  icon="right-circle"
                  @click="onShowGraph"
                >查看模型交互关系图</a-button>
              </a-form-item>
              <a-form-item label="人员信息：" :label-col="{ span: 6 }">
                <a-button
                  type="dashed"
                  size="small"
                  style="height: 25px"
                  icon="right-circle"
                  @click="onShowUserRevision"
                >查看系统内人员信息</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <navigator
        :cur-zoom="curZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        @change-zoom="changeZoom"
      />
      <page />
    </div>
    <DataType ref="dataModel" @close="handleDataResult" />
    <Interface ref="IOModel" @close="handleInterfaceResult" />
    <Graph ref="graphModel" @close="handleGraphResult" />
    <UserRevision ref="userModel" @close="handleUserResult" />
  </div>
</template>

<script>
// 父对象
import Editor from './Editor'
// 框架
import Navigator from '../frame/Navigator'
import Toolbar from '../frame/Toolbar'
import ContextMenu from '../frame/ContextMenu'
import Page from '../frame/Page'
// 模态框
import DataType from '../modal/DataType'
import Interface from '../modal/Interface'
import Graph from '../modal/Graph'
import UserRevision from '../modal/UserRevision'
// 模型定义
import '../RegisterItems.js'

export default {
  props: {
    flowData: {
      type: Object
    }
  },
  extends: Editor,
  components: {
    Navigator,
    Toolbar,
    ContextMenu,
    Page,
    DataType,
    Interface,
    Graph,
    UserRevision
  },
  data() {
    return {
      temp: '仿真台建模模块',
      // 模型名输入框
      inputModelName: '',
      // 模型名管理
      activeModelNames: [],
      // 数据结构名管理
      activeDataTypes: [],
      // 接口管理
      interfaceList: []
    }
  },
  mounted() {
    const page = this.page
    page.changeAddEdgeModel({
      // 初始化线条类型
      shape: 'line'
    })
    page.on('hoveranchor:beforeaddedge', ev => {
      // 输入锚点不可以连出边
      if (ev.anchor.type === 'input') {
        ev.cancel = true
      }
    })
    page.on('dragedge:beforeshowanchor', ev => {
      // 只允许目标锚点是输入，源锚点是输出，才能连接
      if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
        ev.cancel = true
      }
      // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
      if (ev.dragEndPointType === 'target' && page.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
        ev.cancel = true
      }
      // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
      if (ev.dragEndPointType === 'source' && page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
        ev.cancel = true
      }
    })
    page.read(this.flowData)
  },
  watch: {
    // 保证选中模型时输入框跟随
    selectedModel(value) {
      const name = value.label
      if (name !== undefined) {
        this.inputModelName = name
      } else {
        this.inputModelName = ''
      }
    }
  },
  methods: {
    // toolbar里的方法接口实现
    gridSwitch(checked) {
      this.toggleGrid(checked)
    },
    saveData() {
      // console.log(JSON.stringify(this.page.save()));
    },
    changeEage(type) {
      this.page.changeAddEdgeModel({
        shape: type
      })
    },
    // 模型改名
    changeModelName() {
      const newName = this.inputModelName
      if (newName === '') {
        this.$notification.open({
          message: 'Tip',
          description: '输入空字符'
        })
        return
      }
      if (newName.includes(' ')) {
        this.$notification.open({
          message: 'Tip',
          description: '包含非法字符'
        })
        return
      }
      const oldName = this.selectedModel.label
      if (oldName === newName) {
        this.$notification.open({
          message: 'Tip',
          description: '未改名'
        })
        return
      }
      // 肯定是改了名了
      if (this.activeModelNames.includes(newName)) {
        this.$notification.open({
          message: 'Tip',
          description: '名称与其他模型重复'
        })
        return
      }
      // 这下能改了
      this.selectedModel.label = newName
      this.updateGraph('label', this.selectedModel.label)
      if (oldName !== undefined) {
        // 非初次命名，即改名
        this.activeModelNames = this.activeModelNames.filter(item => item !== oldName)
        for (let i in this.interfaceList) {
          const item = this.interfaceList[i]
          if (item.modelName === oldName) {
            this.$set(this.interfaceList[i], 'modelName', newName)
          }
        }
      }
      this.activeModelNames.push(newName)
    },
    // 数据模态框显示
    onShowDataType() {
      this.$refs.dataModel.begin()
    },
    // 数据模态框结束
    handleDataResult(resultTypes) {
      this.activeDataTypes = resultTypes
    },
    // 接口模态框显示
    onShowInterface() {
      if (this.selectedModel.label === undefined || this.selectedModel.label === '') {
        this.$notification.open({
          message: 'Tip',
          description: '模型名称为空'
        })
      } else {
        this.$refs.IOModel.begin(
          this.selectedModel.label,
          this.activeDataTypes,
          this.activeModelNames,
          this.interfaceList
        )
      }
    },
    // 接口模态框结束
    handleInterfaceResult(interfaceList) {
      this.interfaceList = interfaceList
    },
    // 交互图模态框显示
    onShowGraph() {
      this.$refs.graphModel.begin(this.activeDataTypes, this.activeModelNames, this.interfaceList)
    },
    // 交互图模态框结束
    handleGraphResult() {},
    // 用户历史模态框显示
    onShowUserRevision() {
      this.$refs.userModel.begin()
    },
    // 用户历史模态框结束
    handleUserResult() {}
  }
}
</script>
<style lang="less">
#itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 2px solid #e6e9ed;
  text-align: left;
}
#itempannel ul {
  padding: 0px;
  padding-left: 0px;
}
#itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 190px;
  height: 50px;
  line-height: 300%;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
  font-size: 15px;
  font-family: Microsoft Yahei;
}
#itempannel .adams-type-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(../../assets/adamsSmall.png) no-repeat 0 center;
}
#itempannel .matlab-type-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(../../assets/matlabSmall.png) no-repeat 0 center;
}
#itempannel .c-type-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(../../assets/cSmall.png) no-repeat 0 center;
}
#itempannel .simulink-type-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(../../assets/simulinkSmall.png) no-repeat 0 center;
}
#itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

#detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 300px;
  border-left: 2px solid #e6e9ed;
}
#detailpannel .pannel {
  display: none;
}
#detailpannel .block-container {
  padding: 16px 0px;
  text-align: left;
}
#detailpannel .bus-container {
  margin-left: 70px;
}
#detailpannel .model-input {
  width: 210px;
  margin-right: 10px;
}
#detailpannel .model-button {
  margin-right: 15px;
  float: right;
}
.bottom-container {
  position: relative;
}
.pannel-title {
  height: 35px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
  font-size: 15px;
  font-family: Microsoft Yahei;
}
</style>
