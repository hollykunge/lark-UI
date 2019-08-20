<template>
  <div>
    <a-row>
      <a-col>
        <a-input-search
          placeholder="输入要搜索内容"
          @search="onSearch"
          enterButton
          type="text"
          v-model="searchVal"
          style="margin-bottom: 20px;width: 70%"
        />
        <a-button style="margin-left:20px" icon="plus" v-if="isGroupOwner" @click="addMember">新增成员</a-button>
      </a-col>
    </a-row>
    <a-table
      size="small"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="userList"
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
          <a @click="removeMember(record)">移出群组</a>
        </template>
      </span>
    </a-table>
    <!-- <a-pagination simple class="pageStyle" :total="total" @change="handleTableChange"/> -->
    <user-model ref="model" :operations="['添加']" @ok="handleSaveOk"/>
  </div>
</template>
<script>
import { getGroupMembersPage, addMember, removeMember } from '@/api/talk.js'
import UserModel from '@/components/admin/UserTransferModel'
import { FILE_SERVER_IP } from '@/utils/constants'
import { mapGetters } from 'vuex'
export default {
  name: 'TeamMember',
  components: {
    UserModel
  },
  props: {
    contactId: {
      type: String,
      default: '',
      required: true
    },
    secretLevel: {
      type: Number,
      required: true
    }
  },
  mounted () {
    this.loadData()
  },
  computed: {
    ...mapGetters(['userPId'])
  },
  created () {
    if (this.isGroupOwner) {
      this.columns.push({
        title: '操作',
        width: '100px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      })
    }
  },
  data () {
    return {
      searchVal: '',
      // 数据加载样式
      loading: false,
      userList: [],
      // 初始信息
      userList_org: [],
      total: 0,
      // 群主
      isGroupOwner: true,
      // 表头
      columns: [
        {
          title: '',
          width: '50px',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '密级',
          dataIndex: 'secretLevel',
          key: 'secretLevel',
          customRender: function (secretLevel) {
            const config = {
              '30': '非密',
              '40': '一般一类',
              '50': '一般二类',
              '60': '重要一类',
              '70': '重要二类',
              '80': '核心一类',
              '90': '核心二类'
            }
            return config[secretLevel]
          }
        },
        {
          title: '组织机构',
          dataIndex: 'orgName'
        }
      ],
      secretListMap: new Map([
        [60, [60, 70, 80, 90]],
        [40, [40, 50, 60, 70, 80, 90]],
        [30, [30, 40, 50, 60, 70, 80, 90]]
      ])
    }
  },
  methods: {
    /**
     * 搜索
     */
    onSearch () {
      if (this.searchVal) {
        this.userList = this.userList_org.filter(item => item.name.indexOf(this.searchVal) > -1)
      } else {
        this.userList = this.userList_org
      }
    },
    loadData () {
      this.loading = true
      const params = {}
      params.groupId = this.contactId
      getGroupMembersPage(params).then(res => {
        this.userList_org = res.result.data
        this.userList = this.userList_org
        if (this.searchVal) {
          this.onSearch()
        }
        // this.total = res.result.totalCount
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
    /**
     * 退出群组
     */
    removeMember (record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `请确认是否将${record.name}退出群组?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.loading = true
          return removeMember(
            { 'groupId': _this.contactId, 'userId': record.id }
          ).then(
            res => {
              if (res.status === 200) {
                _this.$notification['success']({
                  message: '操作成功',
                  duration: 2
                })
                _this.loadData()
              } else {
                _this.$notification['error']({
                  message: res.message,
                  duration: 4
                })
              }
            }
          ).catch(() =>
            _this.$notification['error']({
              message: '出现异常，请联系系统管理员',
              duration: 4
            })
          ).finally(() => {
            _this.loading = false
          })
        },
        onCancel: () => {
          _this.$notification['info']({
            message: '取消操作',
            duration: 4
          })
        }
      })
    },
    /**
     * 新增成员
     */
    addMember () {
      this.$refs.model.begin(this.userList, {
        secretLevels: this.secretListMap.get(this.secretLevel).join(),
        exPid: this.userPId
      })
    },
    /**
     * 新增成员确认
     */
    handleSaveOk (users, userids) {
      this.loading = true
      addMember({ 'groupId': this.contactId, 'userIds': userids.join(',') }).then(
        res => {
          if (res.status === 200) {
            this.$notification['success']({
              message: '操作成功',
              duration: 2
            })
            this.loadData()
          } else {
            this.$notification['error']({
              message: res.message,
              duration: 4
            })
          }
        }
      ).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        }).finally(() => {
          this.loading = false
        })
      )
    },
    /**
     * 获取头像地址
     */
    getAvartarSrc (src) {
      return FILE_SERVER_IP + src
    }
  }
}
</script>
<style lang="less" scoped>
.onlineStyle {
  color: #f56a00;
  background-color: #fde3cf
}
.outlineStyle {
  color:white;
  background-color: #a19ead
}
.pageStyle {
  margin-top: 10px;
  margin-left: 350px;
}
</style>
