<template>
  <a-modal
    title="数据看板"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="destroyOnClose"
    :footer="null"
    width="700px"
  >
    <div id="detail-panel" v-show="detailVisible">
      <a-button size="small" type="primary" class="data-type-btn" @click="detailAddStruct">添加新结构体</a-button>
      <a-table size="small" bordered :dataSource="detailDataSource" :columns="detailColumns">
        <template slot="detailOperation" slot-scope="text, record">
          <template>
            <a @click="editDetail(record)">编辑</a>
            <a-divider type="vertical" />
          </template>
          <a-popconfirm
            v-if="detailDataSource.length"
            title="Sure to delete?"
            @confirm="() => deleteDetail(record.key)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
        <template slot="footer">
          <span class="tooltip-icon" />说明：结构体由结构体名和若干特定数据类型的字段组成，目前不支持结构体嵌套
        </template>
      </a-table>
    </div>
    <div id="form-panel" v-show="formVisible">
      <a-form layout="horizontal">
        <a-form-item label="结构体名：" :label-col="{ span: 3 }">
          <a-input v-model="formStruct" class="form-input" />
          <a-tag class="type-tag">
            <template v-if="formType === 'add'">添加</template>
            <template v-if="formType === 'edit'">编辑</template>
            状态
          </a-tag>
        </a-form-item>
        <a-form-item label="字段信息：" :label-col="{ span: 3 }">
          <a-select
            v-model="formItemType"
            class="form-type"
            defaultValue="real"
            style="width: 120px"
          >
            <a-select-option value="real">real</a-select-option>
            <a-select-option value="int">int</a-select-option>
            <a-select-option value="bool">bool</a-select-option>
            <a-select-option value="string">string</a-select-option>
          </a-select>
          <a-input v-model="formItemName" class="form-input" />
          <a-button size="small" type="primary" class="data-type-btn" @click="formAddItem">添加一项</a-button>
        </a-form-item>
        <a-table size="small" bordered :dataSource="formDataSource" :columns="formColumns">
          <template slot="formOperation" slot-scope="text, record">
            <a-popconfirm
              v-if="formDataSource.length"
              title="Sure to delete?"
              @confirm="() => deleteForm(record.key)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form>
      <a-button size="small" type="primary" class="data-type-btn" @click="formSubmit">完成修改</a-button>
      <a-button size="small" type="danger" class="data-type-btn" @click="formAbandon">放弃修改</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "DataType",
  data() {
    return {
      visible: false,
      destroyOnClose: true,
      // detail-panel
      detailVisible: true,
      detailDataSource: [],
      detailCount: 0,
      detailColumns: [
        {
          title: "名称",
          dataIndex: "name",
          width: "40%",
          sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
          title: "描述",
          dataIndex: "description"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "20%",
          scopedSlots: { customRender: "detailOperation" }
        }
      ],
      // form-panel
      formVisible: false,
      formStruct: "",
      formItemType: "real",
      formItemName: "",
      formDataSource: [],
      formCount: 0,
      // 以下两个是和edit相关的
      formType: "",
      editKey: 0,
      formColumns: [
        {
          title: "类型",
          dataIndex: "type"
        },
        {
          title: "名称",
          dataIndex: "name",
          width: "60%"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "20%",
          scopedSlots: { customRender: "formOperation" }
        }
      ]
    };
  },
  methods: {
    begin() {
      this.visible = true;
    },
    // detail-panel
    handleCancel() {
      if (this.detailVisible === true) {
        let resultTypes = [];
        for (let i in this.detailDataSource) {
          resultTypes.push(this.detailDataSource[i].name);
        }
        this.$emit("close", resultTypes);
        this.visible = false;
      }
    },
    detailAddStruct() {
      this.formStruct = "";
      this.formItemType = "real";
      this.formItemName = "";
      this.formDataSource = [];
      this.formCount = 0;
      this.formType = "add";
      // 可视化更新
      this.detailVisible = false;
      this.formVisible = true;
    },
    editDetail(record) {
      this.formStruct = record.name;
      this.formItemType = "real";
      this.formItemName = "";
      this.formDataSource = record.content;
      this.formCount = record.currentCount;
      this.formType = "edit";
      this.editKey = record.key;
      // 可视化更新
      this.detailVisible = false;
      this.formVisible = true;
    },
    deleteDetail(key) {
      const detailDataSource = [...this.detailDataSource];
      this.detailDataSource = detailDataSource.filter(item => item.key !== key);
      //TODO 需要usage，还有删除关联没加
    },
    // form-panel
    formAddItem() {
      if (this.formItemName === "") {
        this.$notification.open({
          message: "Tip",
          description: "字段名称为空"
        });
        return;
      }
      const formDataSource = [...this.formDataSource];
      if (formDataSource.some(item => item.name === this.formItemName)) {
        this.$notification.open({
          message: "Tip",
          description: "字段名称重复"
        });
        return;
      }
      const formCount = this.formCount;
      const newData = {
        key: formCount,
        type: this.formItemType,
        name: this.formItemName
      };
      this.formDataSource = [...formDataSource, newData];
      this.formCount = formCount + 1;
      this.formItemName = "";
    },
    deleteForm(key) {
      const formDataSource = [...this.formDataSource];
      this.formDataSource = formDataSource.filter(item => item.key !== key);
    },
    formSubmit() {
      if (this.formStruct === "") {
        this.$notification.open({
          message: "Tip",
          description: "结构体名为空"
        });
        return;
      }
      if (this.formDataSource.length === 0) {
        this.$notification.open({
          message: "Tip",
          description: "结构体无数据项"
        });
        return;
      }
      const detailDataSource = [...this.detailDataSource];
      // 添加情况
      if (this.formType === "add") {
        if (detailDataSource.some(item => item.name === this.formStruct)) {
          this.$notification.open({
            message: "Tip",
            description: "结构体名重复"
          });
          return;
        }
        // 开始添加
        const detailCount = this.detailCount;
        const newData = {
          key: detailCount,
          name: this.formStruct,
          description: "a normal one",
          currentCount: this.formCount,
          content: this.formDataSource
        };
        this.detailDataSource = [...detailDataSource, newData];
        this.detailCount = detailCount + 1;
      } else if (this.formType === "edit") {
        const index = this.detailDataSource.findIndex(
          item => item.key === this.editKey
        );
        if (index === -1) {
          this.$notification.open({
            message: "Error",
            description: "editKey传递错误"
          });
          return;
        }
        if (
          detailDataSource.some(
            item => item.name === this.formStruct && item.key !== this.editKey
          )
        ) {
          this.$notification.open({
            message: "Tip",
            description: "结构体名重复"
          });
          return;
        }
        // 开始更改
        this.$set(detailDataSource[index], "name", this.formStruct);
        this.$set(detailDataSource[index], "currentCount", this.formCount);
        this.$set(detailDataSource[index], "content", this.formDataSource);
        this.detailDataSource = detailDataSource;
      } else {
        this.$notification.open({
          message: "Error",
          description: "formType错误"
        });
        return;
      }
      // 可视化更新
      this.detailVisible = true;
      this.formVisible = false;
    },
    formAbandon() {
      this.detailVisible = true;
      this.formVisible = false;
    }
  }
};
</script>

<style lang="less">
.data-type-btn {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}
#form-panel .form-input {
  width: 200px;
  margin-right: 20px;
}
#form-panel .type-tag {
  margin-left: 275px;
}
#form-panel .form-type {
  margin-right: 20px;
}
#detail-panel .tooltip-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  margin-bottom: 5px;
  background: url(../../assets/tooltip.png) no-repeat 0 center;
}
</style>
