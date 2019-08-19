<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form">
          <a-row :gutter="32" type="flex">
            <a-col :span="6">
              <a-form-item label="菜单">
                <a-input v-model="queryParam.menu"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="操作类型">
                <a-select placeholder="请选择" v-model="queryParam.opt">
                  <a-select-option value="获取">获取</a-select-option>
                  <a-select-option value="添加">添加</a-select-option>
                  <a-select-option value="编辑">编辑</a-select-option>
                  <a-select-option value="删除">删除</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="操作人">
                <a-input v-model="queryParam.crtName"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>
                <a-button type="primary" style="margin-left: 15px" @click="exportData" :loading="loading" v-action:export>导出</a-button>
              </span>
            </a-col>
          </a-row>
          <a-row :gutter="32" type="flex">
            <a-col :span="6">
              <a-form-item label="主机ip">
                <a-input v-model="queryParam.crtHost"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="操作时间">
                <a-range-picker @change="onChange" v-decorator="['timerange']"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <span></span>
            </a-col>
            <a-col :span="6">
              <span style="margin-top:20px">日志容量：{{ totalCount }}/10000</span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="stable"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="false"
      >
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import { getGateLog, exportGateLog } from '@/api/admin'
export default {
  name: 'GateLogList',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单',
          dataIndex: 'menu'
        },
        {
          title: '操作类型',
          dataIndex: 'opt'
        },
        // {
        //   title: 'uri',
        //   dataIndex: 'uri'
        // },
        // {
        //   title: '创建账号',
        //   dataIndex: 'crtUser'
        // },
        {
          title: '操作人',
          dataIndex: 'crtName'
        },
        {
          title: '操作人身份证号',
          dataIndex: 'pid'
        },
        {
          title: '操作时间',
          dataIndex: 'crtTime'
        },
        {
          title: '状态',
          dataIndex: 'isSuccess',
          key: 'isSuccess',
          customRender: function (isSuccess) {
            const config = {
              '0': '失败',
              '1': '成功'
            }
            return config[isSuccess]
          }
        },
        {
          title: '主机ip',
          dataIndex: 'crtHost'
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGateLog(Object.assign(parameter, this.queryParam)).then(res => {
          this.totalCount = res.result.totalCount
          return res.result
        })
      },
      loading: false,
      dataStr: '',
      totalCount: 0,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      if (this.dataStr) {
        this.queryParam.crtTime = this.dataStr.join(',')
      }
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    /**
     * 查询项清空
     */
    resetQueryParams () {
      this.queryParam = {}
      this.form.setFieldsValue({ timerange: undefined })
    },
    onChange (date, datestr) {
      this.dataStr = datestr
    },
    /**
     * 导出数据
     */
    exportData () {
      this.loading = true
      exportGateLog().then(res => {
        this.download(res)
        this.loading = false
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      )
    },
    /**
     * 下载
     */
    download (data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute('download', '日志列表.xls')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>
