<template>
  <a-modal
    title="接口看板"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="destroyOnClose"
    :footer="null"
    width="700px"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane id="overview-panel" tab="接口信息" key="1">
        <a-form layout="horizontal">
          <a-form-item label="模型名称：" :label-col="{ span: 3 }">{{modelName}}</a-form-item>
          <a-form-item label="添加输出：" :label-col="{ span: 3 }">
            <a-select
              v-model="formItemType"
              class="form-type"
              defaultValue="real"
              style="width: 120px"
            >
              <a-select-option
                v-for="(item, index) in activeDataTypes"
                :key="index"
                :value="item"
              >{{item}}</a-select-option>
            </a-select>
            <a-input v-model="formItemName" class="form-input" />
            <a-button size="small" type="primary" @click="formAddItem">添加一项</a-button>
          </a-form-item>
          <a-table size="small" bordered :dataSource="formDataSource" :columns="formColumns">
            <template slot="formOperation" slot-scope="text, record">
              <a-popconfirm
                v-if="formDataSource.length"
                title="Sure to delete?"
                @confirm="() => deleteForm(record)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </a-form>
      </a-tab-pane>
      <a-tab-pane id="subscribe-panel" tab="订阅输入" key="2">
        <a-table
          size="small"
          bordered
          :defaultExpandAllRows="true"
          :columns="subColumns"
          :dataSource="subDataSource"
          :rowSelection="{ selectedRowKeys: selectedRowKeys,
                            getCheckboxProps: getCheckboxProps, 
                            onChange: onSelectChange, 
                            onSelect: onSelect, 
                            onSelectAll: onSelectAll
                             }"
        >
          <template slot="footer">
            <span class="tooltip-icon" />说明：订阅的数据行为灰色，模型名所在行和本模型输出接口所在行不可订阅
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
export default {
  name: "Interface",
  data() {
    return {
      visible: false,
      destroyOnClose: true,
      // 传入参数
      modelName: "",
      activeDataTypes: [],
      activeModelNames: [],
      interfaceList: [],
      // overview-panel
      formItemType: "real",
      formItemName: "",
      formColumns: [
        {
          title: "类别",
          dataIndex: "category",
          width: "15%",
          sorter: (a, b) => a.category.localeCompare(b.category)
        },
        {
          title: "数据类型",
          dataIndex: "type",
          width: "20%",
          sorter: (a, b) => a.type.localeCompare(b.type)
        },
        {
          title: "名称",
          dataIndex: "name",
          width: "30%",
          sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
          title: "描述",
          dataIndex: "description",
          width: "25%"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
          scopedSlots: { customRender: "formOperation" }
        }
      ],
      // input-panel
      subColumns: [
        { title: "全部选择/全部取消", dataIndex: "name", key: "name" },
        { title: "数据类型", dataIndex: "type", key: "type" }
      ],
      selectedRowKeys: [],
      getCheckboxProps: record => ({
        props: {
          disabled: record.status === "father" || record.status === "self",
          name: record.name
        }
      }),
      // 打勾的事onChange已经做了，这里更新表就可以了
      onSelect: (record, selected, selectedRows) => {
        if (selected) {
          // 开始添加
          const newData = {
            key: record.name,
            type: record.type,
            name: record.name,
            description: "this is a normal input",
            modelName: this.modelName,
            category: "input"
          };
          this.interfaceList = [...this.interfaceList, newData];
        } else {
          this.interfaceList = this.interfaceList.filter(
            item =>
              item.name !== record.name || item.modelName !== this.modelName
          );
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected) {
          for (let i in this.interfaceList) {
            const item = this.interfaceList[i];
            const already = this.formDataSource.some(
              dsItem => dsItem.name === item.name
            );
            if (
              item.modelName !== this.modelName &&
              item.category === "output" &&
              !already
            ) {
              const newData = {
                key: item.name,
                type: item.type,
                name: item.name,
                description: "this is a normal input",
                modelName: this.modelName,
                category: "input"
              };
              this.interfaceList = [...this.interfaceList, newData];
            }
          }
        } else {
          this.interfaceList = this.interfaceList.filter(
            ifItem =>
              ifItem.modelName !== this.modelName || ifItem.category !== "input"
          );
        }
      }
    };
  },
  computed: {
    // 接口信息列表显示本模型所有接口
    formDataSource() {
      return this.interfaceList.filter(
        item => item.modelName === this.modelName
      );
    },
    // 订阅列表显示系统内所有的output
    subDataSource() {
      let subDataSource = [];
      let count = 0;
      for (let i in this.activeModelNames) {
        const modelName = this.activeModelNames[i];
        let newData = {
          // 这个key不能是模型名，因为模型名有可能和接口名重复
          key: count,
          name: modelName,
          status: "father",
          type: "",
          children: []
        };
        for (let j in this.interfaceList) {
          if (this.interfaceList[j].category === "input") {
            continue;
          }
          if (this.interfaceList[j].modelName === modelName) {
            let innerData = {
              // 所有接口名不重复且不为数字
              key: this.interfaceList[j].name,
              name: this.interfaceList[j].name,
              type: this.interfaceList[j].type
            };
            if (modelName === this.modelName) {
              innerData.status = "self";
            }
            newData.children.push(innerData);
          }
        }
        count = count + 1;
        subDataSource = [...subDataSource, newData];
      }
      return subDataSource;
    }
  },
  methods: {
    begin(modelName, activeDataTypes, activeModelNames, interfaceList) {
      this.visible = true;
      this.modelName = modelName;
      this.activeDataTypes = [
        "real",
        "int",
        "bool",
        "string",
        ...activeDataTypes
      ];
      this.activeModelNames = activeModelNames;
      this.interfaceList = interfaceList;
      // 初始化表格
      this.formItemType = "real";
      this.formItemName = "";
      // 初始化订阅
      for (let i in this.interfaceList) {
        let item = this.interfaceList[i];
        if (item.modelName === this.modelName && item.category === "input") {
          this.selectedRowKeys.push(item.key);
        }
      }
    },
    handleCancel() {
      this.$emit("close", this.interfaceList);
      this.modelName = "";
      this.activeDataTypes = [];
      this.activeModelNames = [];
      this.interfaceList = [];
      this.selectedRowKeys = [];
      this.visible = false;
    },
    formAddItem() {
      if (this.formItemName === "") {
        this.$notification.open({
          message: "Tip",
          description: "接口名称为空"
        });
        return;
      }
      const targetItem = this.interfaceList.find(
        item => item.name === this.formItemName && item.category === "output"
      );
      if (targetItem !== undefined) {
        this.$notification.open({
          message: "Tip",
          description: "接口名称重复，重复模型名：" + targetItem.modelName
        });
        return;
      }
      // 开始添加
      const newData = {
        // 自己订阅的和自己输出的，需要自己不能订阅自己
        key: this.formItemName,
        type: this.formItemType,
        name: this.formItemName,
        description: "this is a normal output",
        modelName: this.modelName,
        category: "output"
      };
      this.interfaceList = [...this.interfaceList, newData];
      this.formItemName = "";
    },
    deleteForm(record) {
      if (record.category === "input") {
        this.interfaceList = this.interfaceList.filter(
          item => item.key !== record.key || item.modelName !== this.modelName
        );
        this.selectedRowKeys = this.selectedRowKeys.filter(
          item => item !== record.key
        );
      } else {
        // TODO 考虑加usage
        this.interfaceList = this.interfaceList.filter(
          item => item.key !== record.key
        );
        this.$notification.open({
          message: "Tip",
          description: "删除了一项输出接口及订阅它的所有输入接口"
        });
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      // selectedRowKeys和onChange是实现打勾项的基础
      // 如果不用selectedRowKeys，默认点了能打勾
      // 但如果要用，需要在这里进行一次冗余刷新
      this.selectedRowKeys = selectedRowKeys;
      // console.log("change " + this.selectedRowKeys);
    }
  }
};
</script>
<style lang="less">
#overview-panel .form-input {
  width: 200px;
  margin-right: 20px;
}
#overview-panel .form-type {
  margin-right: 20px;
}
#subscribe-panel .tooltip-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  margin-bottom: 5px;
  background: url(../../assets/tooltip.png) no-repeat 0 center;
}
</style>
