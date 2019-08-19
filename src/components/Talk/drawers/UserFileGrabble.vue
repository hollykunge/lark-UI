<template>
  <div>
    <div style="width: 100%">
      <a-input-search
        placeholder="输入要搜索内容"
        @search="onSearch"
        enterButton
        type="text"
        v-model="searchVal"
        style="margin-bottom: 20px; width: 100%"
      />
    </div>
    <a-table
      size="small"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="fileList"
      :loading="loading"
      :pagination="false"
    >
      <span slot="icon" slot-scope="text, record">
        <template>
          <a-avatar :src="getAvartarSrc(record.avartar)" :class="{'onlineStyle':record.online=='1','outlineStyle':record.online!='1'}">{{ record.name.substr(0, 4) }}</a-avatar>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a :href="genDownLoadPath(record.fileId)" download>下载</a>
        </template>
      </span>
    </a-table>
    <a-pagination simple class="pageStyle" :total="total" @change="handleTableChange"/>
  </div>
</template>
<script>
import { getPrivateFile } from '@/api/talk.js'
import api from '@/api/talk'
export default {
  name: 'UserFileGrabble',
  components: {
  },
  props: {
    contactId: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      searchVal: '',
      // 数据加载样式
      loading: false,
      fileList: [],
      // 初始信息
      fileList_org: [],
      total: 0,
      // 表头
      columns: [
        {
          title: '文件名',
          dataIndex: 'fileName'
        },
        {
          title: '上传者',
          dataIndex: 'reviserName'
        },
        {
          title: '密级',
          width: '50px',
          dataIndex: 'levels',
          key: 'levels',
          customRender: function (levels) {
            const config = {
              '30': '非密',
              '40': '秘密',
              '60': '机密'
            }
            return config[levels]
          }
        },
        {
          title: '上传时间',
          dataIndex: 'time'
        },
        {
          title: '操作',
          width: '50px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {
  },
  mounted () {
    this.loadData()
  },
  methods: {
    /** 生成下载路径 */
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId
    },
    /**
     * 搜索
     */
    onSearch () {
      if (this.searchVal) {
        this.fileList = this.fileList_org.filter(item => item.fileName.indexOf(this.searchVal) > -1)
      } else {
        this.fileList = this.fileList_org
      }
    },
    loadData () {
      this.loading = true
      const options = {
        userId: this.$store.getters.userId,
        receiver: this.contactId
      }
      getPrivateFile(options).then(res => {
        this.fileList_org = res.result.data
        this.fileList = this.fileList_org
        if (this.searchVal) {
          this.onSearch()
        }
        this.total = res.result.totalCount
        this.loading = false
      })
    },
    /**
     * 分页
     */
    handleTableChange (page, pageSize) {
      this.onSearch({
        pageSize: pageSize,
        pageNo: page
      })
    },
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style lang="less">
.pageStyle {
  margin-top: 10px;
  margin-left: 250px;
}
</style>
