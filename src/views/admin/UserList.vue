<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="5">
        <a-card :bordered="true" title="组织树" v-show="cardvisible">
          <a-tree
            ref="orgtree"
            :treeData="orgTree"
            @select="handleClick"
          />
        </a-card>
      </a-col>
      <a-col :span="19">
        <a-card :bordered="true" title="人员信息列表" v-show="cardvisible">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="8">
                <a-col :md="7" :sm="24">
                  <a-form-item label="姓名">
                    <a-input v-model="queryParam.name"/>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-item label="状态">
                    <a-select placeholder="请选择" v-model="queryParam.inservice">
                      <a-select-option value="1">在职</a-select-option>
                      <a-select-option value="2">离职</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col> -->
                <a-col :md="7" :sm="24">
                  <a-form-item label="密级">
                    <a-select placeholder="请选择" v-model="queryParam.secretLevel">
                      <a-select-option value="30">非密</a-select-option>
                      <a-select-option value="40">一般一类</a-select-option>
                      <a-select-option value="50">一般二类</a-select-option>
                      <a-select-option value="60">重要一类</a-select-option>
                      <a-select-option value="70">重要二类</a-select-option>
                      <a-select-option value="80">核心一类</a-select-option>
                      <a-select-option value="90">核心二类</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="10" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchUser">查询</a-button>
                    <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                    <a-button style="margin-left: 30px" type="primary" @click="openEditModal('','1')" v-action:add>新增用户</a-button>
                  </span>
                </a-col>
                <!-- <a-col>
                  <a-row type="flex" justify="end">
                    <a-col>
                      <a-button type="primary" @click="searchUser">查询</a-button>
                    </a-col>
                    <a-col>
                      <a-button @click="() => queryParam = {}">重置</a-button>
                    </a-col>
                    <a-col>
                      <a-button type="primary" @click="openEditModal('','1')" v-action:add>新增用户</a-button>
                    </a-col>
                  </a-row>
                </a-col> -->
              </a-row>
              <a-row>
                <s-table
                  ref="stable"
                  size="default"
                  :columns="columns"
                  :data="loadData"
                  :alert="false"
                >
                  <span slot="action" slot-scope="text, record">
                    <template>
                      <a @click="openEditModal(record,'2')" v-action:update>编辑</a>
                      <a-divider type="vertical"/>
                    </template>
                    <template>
                      <a @click="handleDel(record)" v-action:delete>删除</a>
                    </template>
                  </span>
                </s-table>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-spin :spinning="spinning">
        <a-card :bordered="true" title="人员基础信息" v-show="editvisible">
          <a href="#" slot="extra" @click="cacenlEdit">返回</a>
          <a-form :form="editForm">
            <a-row>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="姓名"
                >
                  <a-input v-decorator="['name',{rules: [{ required: true, message: '请输入姓名' },{ max:10,message:'长度不能超过10个字'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="密级"
                >
                  <a-select placeholder="请选择" v-decorator="['secretLevel',{rules: [{ required: true, message: '请选择密级' }]}]">
                    <a-select-option value="30">非密</a-select-option>
                    <a-select-option value="40">一般一类</a-select-option>
                    <a-select-option value="50">一般二类</a-select-option>
                    <a-select-option value="60">重要一类</a-select-option>
                    <a-select-option value="70">重要二类</a-select-option>
                    <a-select-option value="80">核心一类</a-select-option>
                    <a-select-option value="90">核心二类</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="身份证号"
                >
                  <a-input
                    v-decorator="['pid',{rules: [{ required: true, message: '请输入身份证号' },{pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '身份证输入格式有误'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="性别"
                >
                  <a-select placeholder="请选择" v-decorator="['gender',{rules: [{ required: true, message: '请选择性别' }]}]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="2">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="人员排序"
                >
                  <a-input-number :min="1" :max="99999" v-decorator="['orderId']" style="width:100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="10" :offset="1">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="状态"
                >
                  <a-switch defaultChecked v-decorator="['status']"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <a-card :bordered="true" title="组织信息" v-show="editvisible">
          <a-row>
            <a-col :span="10" :offset="1">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="所属组织"
              >
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                  :treeData="OrgTreeSelects"
                  treeDefaultExpandAll
                  allowClear
                  @change="onChange"
                  style="width:100%"
                  :value="orgid"
                ></a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end">
            <a-col>
              <a-button type="primary" @click="saveUserInfo">保存</a-button>
            </a-col>
          </a-row>
        </a-card>
        <!-- <a-card :bordered="true" title="角色信息" v-show="editvisible">
          <a-row>
            <a-col :span="10" :offset="1">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="选择角色"
              >
                <Role-checked :values="rolechecked" @changerolecheck="changerolecheck"></Role-checked>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end">
            <a-col>
              <a-button type="primary" @click="saveUserInfo">保存</a-button>
            </a-col>
          </a-row>
        </a-card> -->
      </a-spin>
    </a-row>
  </div>
</template>
<script>
import STable from '@/components/table/'
import RoleChecked from '@/components/admin/RoleChecked'
import { setTimeout } from 'timers'
import { getUserPage, adduser, updateuser, deluser, getOrgTree, saveuserRole, getUserRole } from '@/api/admin'
export default {
  name: 'UserList',
  components: {
    STable,
    RoleChecked
  },
  data () {
    return {
      expandedKeys: ['key-01'],
      // 查询参数
      queryParam: {},
      // 默认不显示编辑页面
      visible: false,
      cardvisible: true,
      editvisible: false,
      // 编辑页面信息传递
      userinfo: {},
      // 响应式布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16, offset: 1 }
      },
      editForm: this.$form.createForm(this),
      // 表头
      columns: [
        {
          title: '出入证号',
          dataIndex: 'empCode'
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
        },
        {
          title: '身份证号',
          dataIndex: 'pid'
        },
        {
          title: '状态',
          dataIndex: 'status'
        }
        // {
        //   title: '操作',
        //   width: '120px',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserPage(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      orgTree: [],
      OrgTreeSelects: [],
      // 用户对应角色
      rolechecked: [],
      editType: '',
      dataSource: [],
      // 绑定树选择的值
      orgid: '',
      orgname: '',
      spinning: false
    }
  },
  created () {
    // 获取树形组织信息
    getOrgTree({ 'parentTreeId': 'root' }).then(res => {
      this.orgTree = res.result.data
      this.OrgTreeSelects = this.genernateTree(res.result.data)
    })
  },
  methods: {
    /**
     * 处理后台返回值 替换名字 id=>key label=>title
     * 处理与树型绑定值冲突问题
     */
    genernateTree (value) {
      value.forEach(item => {
        // item.value = item.key
        item.value = item.id + 'select'
        item.title = item.label
        item.key = item.id
        if (item.children && item.children.length) {
          this.genernateTree(item.children)
        }
      })
      return value
    },
    /**
     * 点击树节点刷新人员信息
     */
    handleClick (item, e) {
      this.queryParam = {
        'orgCode': item[0]
      }
      this.$refs.stable.refresh(true)
    },
    /**
     * 查询用户信息
     */
    searchUser () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    /**
     * 保存用户对应角色
     */
    saveUserRole (userId) {
      return saveuserRole(
        { 'userId': userId, 'roles': this.rolechecked.join(',') }
      ).then(
        res => {
          if (res.status === 200) {
            this.editvisible = false
            this.cardvisible = true
            this.$notification['success']({
              message: '操作成功',
              duration: 2
            })
            // 关闭编辑框
            this.editvisible = false
            this.cardvisible = true
            // 刷新员工列表
            this.$refs.stable.refresh(true)
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
        })
      ).finally(() => {
        this.spinning = false
      })
    },
    /**
     * 保存修改内容
     * TODO 三个请求不在前台嵌套调用，无法做事务处理，是否由后台统一接口
     */
    saveUserInfo () {
      const _this = this
      this.editForm.validateFields((err, values) => {
        // 除了用户基础信息必填项限制，在这里加，且需要有对应的提醒信息
        values.orgCode = _this.orgid === undefined ? '' : _this.orgid.replace('select', '')
        values.orgName = _this.orgname[0] || ''
        if (!err) {
          _this.spinning = true
          if (_this.editType === '1') {
            return adduser(
              values
            ).then(
              res => {
                if (res.status === 200) {
                  _this.saveUserRole(res.result.id)
                } else {
                  _this.$notification['error']({
                    message: res.message,
                    duration: 4
                  })
                }
              }
            ).catch((err) => {
              if (err || err.response || err.response) {
                _this.$notification['error']({
                  message: err.response.data.message,
                  duration: 4
                })
              }
            }).finally(() => {
              _this.spinning = false
            })
          } else {
            values.id = _this.userinfo.id
            return updateuser(
              values
            ).then(
              res => {
                if (res.status === 200) {
                  // 保存用户角色信息调用新请求
                  _this.saveUserRole(values.id)
                } else {
                  _this.$notification['error']({
                    message: res.message,
                    duration: 4
                  })
                }
              }
            ).catch((err) => {
              if (err || err.response || err.response) {
                _this.$notification['error']({
                  message: err.response.data.message,
                  duration: 4
                })
              }
            }).finally(() => {
              _this.spinning = false
            })
          }
        }
      })
    },
    /**
     * 编辑页取消按钮
     */
    cacenlEdit () {
      this.editvisible = false
      this.cardvisible = true
      this.$notification['info']({
        message: '取消操作',
        duration: 2
      })
    },
    /**
     * 打开编辑用户信息弹出框
     */
    openEditModal (item, type) {
      this.editType = type
      // edit
      if (type === '2') {
        // 拷贝选中信息内容到userinfo
        this.userinfo = Object.assign({}, item)
        setTimeout(() => {
          this.editForm.setFieldsValue({
            name: this.userinfo.name,
            inservice: this.userinfo.inservice,
            secretLevel: this.userinfo.secretLevel,
            pid: this.userinfo.pid,
            status: this.userinfo.status === '启用',
            gender: this.userinfo.gender,
            orderId: this.userinfo.orderId
          })
        }, 0)
        this.orgid = item.orgCode === undefined ? '' : item.orgCode + 'select'
        this.editvisible = true
        this.cardvisible = false
        return getUserRole({ 'id': item.id }).then(res => {
          if (res.result.data.length > 0) {
            this.rolechecked = res.result.data.map(role => role.id)
          }
        })
      } else {
        // add
        setTimeout(() => {
          this.editForm.setFieldsValue({
            name: '',
            inservice: '',
            secretLevel: '',
            pid: '',
            status: true,
            gender: '',
            orderId: ''
          })
        }, 0)
        this.orgid = ''
        this.orgname = ''
        this.rolechecked = []
        this.editvisible = true
        this.cardvisible = false
      }
    },
    /**
     * 单条删除用户信息
     */
    handleDel (item) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确认要删除 ${item.name} 的信息吗?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.spinning = true
          // 在这里调用删除接口
          return deluser(
            item.id
          ).then(
            res => {
              if (res.status === 200) {
                _this.$refs.stable.refresh(true)
                _this.$notification['success']({
                  message: '删除成功',
                  duration: 2
                })
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
            _this.spinning = false
          })
        },
        onCancel: () => {
          _this.$notification['info']({
            message: '取消删除操作',
            duration: 4
          })
        }
      })
    },
    changerolecheck (value) {
      this.rolechecked = value
    },
    /**
     * change事件
     */
    onChange (value, name) {
      this.orgid = value
      this.orgname = name
    }
  }
}
</script>
