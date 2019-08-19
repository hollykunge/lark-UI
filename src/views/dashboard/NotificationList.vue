<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row type="flex" justify="end" :gutter="8">
            <a-col :span="10">
              <a-form-item label="通知标题">
                <a-input v-model="queryParam.title" placeholder="请在此输入..." />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="密级">
                <a-select placeholder="请选择" v-model="queryParam.secretLevel">
                  <a-select-option value="30">非密</a-select-option>
                  <a-select-option value="40">秘密</a-select-option>
                  <a-select-option value="60">机密</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="消息类型">
                <a-select placeholder="请选择" v-model="queryParam.type">
                  <a-select-option value="admin">管理员公告</a-select-option>
                  <a-select-option value="system">系统消息</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-button-group>
                <a-button @click="search">查询</a-button>
                <a-button @click="() => queryParam = {}">重置</a-button>
              </a-button-group>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table ref="stable" size="default" :columns="columns" :data="loadData" :alert="false"></s-table>
    </a-card>
  </div>
</template>
<script>
import STable from '@/components/table/'
import { getNoticePage } from '@/api/workplace'
export default {
  name: 'NotificationList',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      type: '',
      // 设置上传的请求头部，IE10 以上有效
      headers: {
        authorization: 'authorization-text'
      },
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '内容',
          dataIndex: 'content'
        },
        {
          title: '密级',
          dataIndex: 'secretLevel',
          key: 'secretLevel',
          customRender: function (secretLevel) {
            const config = {
              '30': '非密',
              '40': '秘密',
              '60': '机密'
            }
            return config[secretLevel]
          }
        },
        {
          title: '消息类型',
          dataIndex: 'type',
          key: 'type',
          customRender: function (type) {
            const config = {
              admin: '管理员公告',
              system: '系统消息'
            }
            return config[type]
          }
        },
        {
          title: '发布时间',
          dataIndex: 'sendTime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getNoticePage(Object.assign(parameter, this.queryParam, { 'orgCode': this.userInfo.orgCode })).then(res => {
          return res.result
        })
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    }
  }
}
</script>
