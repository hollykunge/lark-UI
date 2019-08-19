/**
 * websocket接口类
 */
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { ONLINE_STATUS } from '@/utils/constants'
import { messagePopup } from '@/utils/client'

/** ws连通 */
const handleWsOpen = () => {
  // 请求研讨相关的数据
  store.dispatch('GetTalkMap')
  store.dispatch('GetRecentContacts')
  store.dispatch('GetGroupList')
  store.dispatch('GetContactsTree')

  // 设置在线状态为已连接
  store.commit('SET_ONLINE_STATE', ONLINE_STATUS.ONLINE)
}

/** 处理私聊和群组消息 */
const handleMessage = (data) => {
  // 自己发送的消息，不处理
  if (data.fromId === store.getters.userId) return
  store
    .dispatch('UpdateTalkMap', { direction: 'receive', message: data })
    .then(() => {
      store.dispatch('UpdateRecentContacts', {
        ...data.contactInfo,
        reOrder: true,
        addUnread: true
      })
    })
    .catch(error => {
      console.log(error)
      const key = `talk${Date.now()}`
      notification.warning({
        message: '消息同步出错',
        description: '研讨消息同步出错，点击同步按钮重新同步',
        duration: null,
        btn: (h) => {
          return h('a-button', {
            props: {
              type: 'primary',
              size: 'small',
              icon: 'reload'
            },
            on: {
              click: () => {
                store.dispatch('GetTalkMap')
                  .then(() => {
                    store.dispatch('GetRecentContacts')
                  })
                  .then(() => notification.close(key))
              }
            }
          }, '同步')
        },
        key
      })
    })
  // 向客户端发送提醒
  messagePopup(data)
}
// 处理创建群组的消息
const handleCreateGroup = (data) => {
  // 接收到创建群组的消息-->更新最近联系人-->更新群组列表
  const {
    groupId,
    groupName,
    groupImg,
    levels
  } = data.zzGroup
  store
    .dispatch('UpdateRecentContacts', {
      id: groupId,
      name: groupName,
      avatar: groupImg,
      secretLevel: levels,
      memberNum: data.userList.length,
      isGroup: true,
      reOrder: true,
      addUnread: false
    })
    .then(() => {
      store.dispatch('GetGroupList')
    })
    .catch(error => {
      console.log(error)
      const key = `talk${Date.now()}`
      notification.warning({
        message: '有新的群组',
        description: '新增群组同步出错，点击手动同步',
        duration: null,
        btn: (h) => {
          return h('a-button', {
            props: {
              type: 'primary',
              size: 'small',
              icon: 'reload'
            },
            on: {
              click: () => {
                store.dispatch('GetRecentContacts')
                  .then(() => {
                    store.dispatch('GetGroupList')
                  })
                  .then(() => notification.close(key))
              }
            }
          }, '同步')
        },
        key
      })
    })
}
// 处理消息确认信息
const handleMessageAck = (received) => {
  // 删除定时任务 同时移出发送队列
  store.commit('DEL_TIMING_TASK', received.oId)
  // 判断消息是否发送成功
  if (received.status === 200) {
    // 发送成功 更新消息id
    store.commit('RESET_MESSAGE_ID', received)
  }
  if (received.status === 201) {
    // 发送失败 添加到失败列表
    store.commit('ADD_FAIL_SET', received.oId)
  }
}

class SocketApi {
  /**
   * 构造函数
   * @param {String} wsProtocol 接口协议
   * @param {String} ip ip地址
   * @param {Sting} port 接口号
   * @param {String} paramStr 加在url后面的请求参数，形如：?id=12
   * @param {String} param 作为tio.ws对象的参数，由业务自己使用，框架不使用
   * @param {Number} heartbeatTimeout 心跳时间 单位：毫秒
   * @param {Number} reconnInterval 重连间隔时间 单位：毫秒
   * @param {String} binaryType 返回websocket连接所传输二进制数据的类型
   */
  constructor ({ wsProtocol, ip = '127.0.0.1', port = '9326', paramStr, param, heartbeatTimeout = 50000, reconnInterval = 1000, binaryType = 'arraybuffer' } = {}) {
    this.wsProtocol = wsProtocol
    this.ip = ip
    this.port = port
    this.url = 'ws://' + this.ip + ':' + this.port
    this.binaryType = binaryType

    if (paramStr) {
      this.url += '?' + paramStr
    }
    this.param = param
    this.heartbeatTimeout = heartbeatTimeout
    this.reconnInterval = reconnInterval
    this.heartbeatSendInterval = heartbeatTimeout / 2
  }

  /**
   * 最后一次通信时间
   */
  lastInteractionTime () {
    const len = arguments.length
    if (len === 1) {
      this.lastInteractionTimeValue = arguments[0]
    }
    return this.lastInteractionTimeValue
  }

  /**
   * 建立websocket连接
   * @param {String} userId 用户id
   */
  connect (userId) {
    userId = userId || store.getters.userId
    const ws = new WebSocket(this.url + '?userId=' + userId)
    // 设置在线状态为连接中
    store.commit('SET_ONLINE_STATE', ONLINE_STATUS.LANDING)
    this.ws = ws

    ws.binaryType = this.binaryType

    const self = this

    // 已经建立websocket连接
    ws.onopen = openEvent => {
      self.lastInteractionTime(new Date().getTime())
      handleWsOpen()
      // 定时发送心跳
      self.pingIntervalId = setInterval(() => {
        self.ping(self)
      }, self.heartbeatSendInterval)
    }

    // 收到websocket消息
    ws.onmessage = messageEvent => {
      console.log(messageEvent)
      const time = new Date()
      const received = JSON.parse(messageEvent.data)
      switch (received.code) {
        // 处理消息 更新消息缓存-->最近联系人列表
        case 0:
          handleMessage(received.data)
          break
        case 1:
          handleMessage(received.data)
          break
        case 10:
          handleCreateGroup(received.data)
          break
        case 4:
          // 创建群组时给服务端返回code为4的数据
          this.ws.send(messageEvent.data)
          break
        case 11:
          handleMessageAck(received)
          break
        default:
          break
      }

      self.lastInteractionTime(time.getTime())
    }

    // websocket连接关闭
    ws.onclose = closeEvent => {
      clearInterval(self.pingIntervalId)
      // 设置在线状态为已断开
      store.commit('SET_ONLINE_STATE', ONLINE_STATUS.OFFLINE)
      // 重连的处理逻辑
      self.reconn()
    }

    ws.onerror = errorEvent => {
      self.close(4001, '连接出现错误')
      // 出错的处理逻辑
      // ···
    }

    return ws
  }

  /**
   * 重连websocket
   */
  reconn () {
    const self = this
    setTimeout(() => {
      self.ws = self.connect()
    }, self.reconnInterval)
  }

  /**
   * 心跳
   */
  ping () {
    const iv = new Date().getTime() - this.lastInteractionTime()

    if ((this.heartbeatSendInterval + iv) >= this.heartbeatTimeout) {
      this.ws.send('心跳内容')
    }
  }

  /**
   * 发送数据
   * @param {Object} data 发送的数据
   */
  send (data) {
    this.ws.send(data)
  }

  /**
   * 关闭websocket连接
   * @param {Number} code 关闭原因代码
   * @param {String} reason 关闭原因描述
   */
  close (code, reason) {
    // 设置登录状态为正在断开
    store.commit('SET_ONLINE_STATE', ONLINE_STATUS.EXITING)

    if (this.ws) {
      this.ws.close(code, reason)
    }
  }

  /**
   * 获取websocket连接状态
   */
  readyState () {
    return this.ws.readyState
  }
}

export default SocketApi
