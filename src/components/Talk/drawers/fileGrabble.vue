<template>
  <div>
    <a-tabs size="small" @change="handleTabsChange">
      <a-tab-pane tab="我的上传" key="1">
        <a-table
          size="small"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="myFile"
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
        <a-pagination simple class="pageStyle" :total="total_myfile" @change="handleChange_myfile"/>
      </a-tab-pane>
      <a-tab-pane tab="我的审批" :disabled="!isGroupOwner" key="2">
        <a-table
          size="small"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="myApprovalFile"
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
              <a-divider type="vertical" />
              <a-popconfirm title="请确认是否审批通过该文件?" @confirm="confirmPass(record)" okText="是" cancelText="否">
                <a href="#">通过</a>
              </a-popconfirm>
              <!-- <a-divider type="vertical" />
              <a @click="reject(record)">驳回</a> -->
            </template>
          </span>
        </a-table>
        <a-pagination simple class="pageStyle" :total="total_myapproval" @change="handleChange_myApproval"/>
      </a-tab-pane>
      <a-tab-pane tab="已审批" key="3">
        <a-table
          size="small"
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="approvaledFile"
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
        <a-pagination simple class="pageStyle" :total="total_approvaled" @change="handleChange_approvaled"/>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="审批驳回"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-input v-model="rejectReason" placeholder="请填写驳回原因"/>
    </a-modal>
  </div>
</template>
<script>
import { setFileApproveFLg, groupFileListByMe, groupFileListByPass, groupFileListByOwner } from '@/api/talk.js'
import api from '@/api/talk'
export default {
  name: 'FileGrabble',
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
      // 数据加载样式
      loading: false,
      // 我的上传
      myFile: [],
      // 我的审批
      myApprovalFile: [],
      // 已审批
      approvaledFile: [],
      total_myfile: 0,
      total_myapproval: 0,
      total_approvaled: 0,
      // 群主
      isGroupOwner: true,
      visible: false,
      fileId: '',
      rejectReason: '',
      // 表头
      columns: [
        {
          title: '文件名',
          width: '100px',
          dataIndex: 'fileName'
        },
        {
          title: '上传者',
          dataIndex: 'reviser'
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
    loadData () {
      this.loading = true
      this.loadMyfile()
      this.loadMyApproval()
      this.loadApprovaled()
    },
    /**
     * 加载我的上传文件
     */
    loadMyfile (params) {
      let options = {
        userId: this.$store.getters.userId,
        groupId: this.contactId
      }
      options = Object.assign(options, params)
      groupFileListByMe(options).then(res => {
        this.myFile = res.result.data
        this.total_myfile = res.result.totalCount
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      ).finally(() => {
        this.loading = false
      })
    },
    /**
     * 加载我的审批文件
     */
    loadMyApproval (params) {
      let options = {
        userId: this.$store.getters.userId,
        groupId: this.contactId
      }
      options = Object.assign(options, params)
      groupFileListByOwner(options).then(res => {
        this.myApprovalFile = res.result.data
        this.total_myapproval = res.result.totalCount
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      ).finally(() => {
        this.loading = false
      })
    },
    /**
     * 加载已审批文件
     */
    loadApprovaled (params) {
      let options = {
        userId: this.$store.getters.userId,
        groupId: this.contactId
      }
      options = Object.assign(options, params)
      groupFileListByPass(options).then(res => {
        this.approvaledFile = res.result.data
        this.total_approvaled = res.result.totalCount
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      ).finally(() => {
        this.loading = false
      })
    },
    /**
     * 分页
     */
    handleChange_myfile (page, pageSize) {
      this.loadMyfile({
        size: pageSize,
        page: page
      })
    },
    handleChange_myApproval (page, pageSize) {
      this.loadMyApproval({
        size: pageSize,
        page: page
      })
    },
    handleChange_approvaled (page, pageSize) {
      this.loadApprovaled({
        size: pageSize,
        page: page
      })
    },
    /**
     * 审批通过
     */
    confirmPass (record) {
      const options = {
        userId: this.$store.getters.userId,
        fileId: record.fileId + ','
      }
      setFileApproveFLg(options).then(res => {
        this.$notification['success']({
          message: '审批通过',
          duration: 2
        })
        this.loadData()
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      )
    },
    /**
     * 审批驳回
     */
    reject (record) {
      this.fileId = record.fileId
      this.visible = true
    },
    handleOk () {
      // this.fileId this.rejectReason
      // 回调函数
      // this.loadData()
      this.visible = false
    },
    handleCancel (e) {
      this.visible = false
    },
    /**
     * 切换面板的回调
     */
    handleTabsChange (activeKey) {
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
