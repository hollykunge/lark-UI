/**
 * 研讨状态模块
 */
import Vue from 'vue'
import { getGroupList,
  getContactsTree,
  getRecentContacts,
  getTalkMap } from '@/api/talk'
import { Tweet, RecentContact, SocketMessage } from '@/utils/talk'
import { ONLINE_STATUS } from '@/utils/constants'
import { format } from '@/utils/util'

/**
 * 设置置顶状态
 * @param {String} id 联系人id
 * @param {Array} recentContacts 最近联系人列表
 * @returns {Boolean}
 */
function setIsTop (recentContacts, id) {
  const contactItems = recentContacts.filter(item => item.id === id)
  if (contactItems.length) return contactItems[0].isTop
  else return false
}

/**
 * 设置免打扰状态
 * @param {String} id 联系人id
 * @param {Boolean} isGroup 是否为群组
 * @param {Array} groupList 群组列表
 * @returns {Boolean}
 */
function setIsMute (groupList, isGroup, id) {
  if (isGroup) {
    const groupItem = groupList.filter(item => item.id === id)
    if (groupItem.length) return groupItem[0].isMute
    else return false
  } else return false
}

/**
 * 设置未读消息数量
 * @param {Array} recentContacts 最近联系人
 * @param {String} id 联系人id
 * @param {Boolean} addUnread 增加未读消息数
 * @param {String} currentId 当前激活研讨的id
 * @returns {Boolean}
 */
function setUnreadNum (recentContacts, id, addUnread, currentId) {
  if (id === currentId) return 0
  if (addUnread) {
    const recentItem = recentContacts.filter(item => item.id === id)
    if (recentItem.length) {
      return recentItem[0].unreadNum + 1
    } else return 1
  } else return 0
}

/**
 * 设置最近联系人项中消息的相关信息
 * @param {Map} talkMap 存储研讨消息的Map
 * @param {String} id 联系人id
 * @param {Object} recentContact 要处理的项
 */
function setMessageInfo (id, talkMap, recentContact) {
  if (talkMap.has(id)) {
    const talkList = talkMap.get(id)
    if (talkList.length) {
      recentContact.time = format(
        new Date(talkList[talkList.length - 1].time),
        'hh:mm')
      recentContact.sender = talkList[talkList.length - 1].username
      recentContact.lastMessage = talkList[talkList.length - 1].content

      // TODO: @功能以后再说
      recentContact.atMe = false
    } else {
      recentContact.time = ''
      recentContact.lastMessage = {}
      recentContact.sender = ''
      recentContact.atMe = false
    }
  } else {
    recentContact.time = ''
    recentContact.lastMessage = {}
    recentContact.sender = ''
    recentContact.atMe = false
  }
}

/**
 * 向研讨服务同步未读消息数
 * @param {Boolean} online 是否在线
 * @param {String} reviser 接收者
 * @param {String} sender 发送者
 */
function syncUnread2Server (newUnreasNum, online, reviser, sender) {
  // TODO: 连接断开，添加提醒
  if (!online || newUnreasNum !== 0) return
  const socketMessage = new SocketMessage({
    code: 9,
    data: {
      reviser: reviser,
      sender: sender
    }
  }).toString()
  Vue.prototype.SocketGlobal.send(socketMessage)
}

/**
 * 格式化联系人结构树
 * @param {Array} target 目标数组
 * @param {Array} todoList 待处理数组
 */
function formatTree (target, todoList) {
  todoList.forEach(function (element) {
    let newItem = {}
    if (element.scopedSlotsTitle === 'orgNode') {
      // 处理组织节点
      newItem = {
        key: element.id,
        title: element.title,
        parentId: element.parentId,
        icon: 'folder',
        online: false,
        scopedSlots: {
          title: 'orgNode'
        },
        children: formatTree([], element.children)
      }
    } else if (element.scopedSlotsTitle === 'userNode') {
      // 处理用户节点
      newItem = {
        key: element.key,
        title: element.title,
        parentId: '',
        icon: element.icon,
        online: element.online,
        scopedSlots: {
          title: 'userNode'
        },
        children: []
      }
    }
    target.push(newItem)
  })
  return target
}

const talk = {
  state: {
    /** 用户的在线状态 @/utils/constants.js->ONLINE_STATUS */
    onlineState: 3,
    /** 最新联系人列表 */
    recentContacts: [],
    /** 群组列表 */
    groupList: [],
    /** 联系人树 */
    contactsTree: [],
    /** 存储研讨消息的Map */
    talkMap: new Map(),
    /** 当前研讨页面的相关信息 */
    currentTalk: {},
    /** 草稿Map */
    draftMap: new Map(),
    // *****消息可靠性相关*****
    /** 发送中的消息 Map<messageId, slotIndex> */
    sendingMap: new Map(),
    /** 发送失败的消息 Set<messageId> */
    failSet: new Set(),
    // *****超时定时器相关*****
    /** 循环队列，长度=超时时间+1 */
    listLoop: new Array(7),
    /** 循环队列的当前位置 */
    currentSlotIndex: 1,
    /** 定时器标识 */
    messageTimer: 0
  },

  mutations: {
    SET_ONLINE_STATE (state, onlineState) {
      state.onlineState = onlineState
    },
    SET_RECENT_CONTACTS (state, recentContacts) {
      state.recentContacts = recentContacts
    },
    SET_GROUP_LIST (state, groupList) {
      state.groupList = groupList
    },
    SET_CONTACTS_TREE (state, contactsTree) {
      /*
      const { id, parentId, title } = contactsTree[0]
      const newTree = [{
        key: id,
        parentId: parentId,
        title: title,
        scopedSlots: {
          title: 'orgNode'
        },
        children: formatTree([], contactsTree[0].children)
      }]
      */
      // 直接显示到三级单位(二部、二十三所)
      const newTree = formatTree([], contactsTree[0].children[0].children)
      state.contactsTree = newTree
    },
    /**
     * 更新talkMap
     * @param {Object} talkMapObject 赋值数组
     * {
     *    fromServer: true,
     *    talkMapData: [['123', {}, {}], ['123', {}, {}]] 或者
     *                 [['123', [{}, {}]], ['123', [{}, {}]]]
     * }
     */
    SET_TALK_MAP (state, talkMapObject) {
      const { talkMap } = state
      if (talkMapObject.fromServer) {
        talkMapObject.talkMapData.forEach(function (item) {
          talkMap.set(item[0], item.slice(1))
        })
      } else {
        talkMapObject.talkMapData.forEach(function (item) {
          if (item[1] instanceof Array) {
            talkMap.set(item[0], item[1])
          }
        })
      }
      state.talkMap = new Map(talkMap)
    },
    /**
     * 将消息id重设为与服务端一致
     * @param {Object} data {oId, nId, contactId}
     */
    RESET_MESSAGE_ID (state, data) {
      const messageList = state.talkMap.get(data.contactId)
      if (messageList) {
        const index = messageList.findIndex(item =>
          item.id === data.oId
        )
        if (index > -1) {
          messageList[index].id = data.nId
        }
      }
    },
    /**
     * 设置当前研讨相关信息
     * @param {String} id 联系人ID
     */
    SET_CURRENT_TALK (state, id) {
      const index = state.recentContacts.findIndex(element =>
        element.id === id
      )
      if (index > -1) {
        // 更新当前研讨
        const {
          id, name, avatar, secretLevel, memberNum, isGroup
        } = state.recentContacts[index]
        state.currentTalk = {
          id, name, avatar, secretLevel, memberNum, isGroup
        }
      }
    },
    /**
     * 更新draftMap
     * @param {Object} state talk状态
     * @param {Array} draft 赋值数组[id, message]
     */
    SET_DRAFT_MAP (state, draft) {
      state.draftMap.set(draft[0], draft[1])
    },
    /**
     * 新增发送中的消息
     * @param {Object} item [messageId, slotIndex]
     */
    SET_SENDING_MAP (state, item) {
      state.sendingMap = new Map(state.sendingMap.set(
        item[0], item[1]
      ))
    },
    /**
     * 移除发送中的信息
     * @param {String} messageId 消息id
     */
    DEL_SENDING_MAP (state, messageId) {
      const { sendingMap } = state
      sendingMap.delete(messageId)
      state.sendingMap = new Map(sendingMap)
    },
    /**
     * 新增发送失败的消息
     * @param {String} messageId 消息id
     */
    ADD_FAIL_SET (state, messageId) {
      state.failSet = new Set(state.failSet.add(messageId))
    },
    /**
     * 移除发送失败的消息
     * @param {String} messageId 消息id
     */
    DEl_FAIL_SET (state, messageId) {
      const { failSet } = state
      failSet.delete(messageId)
      state.failSet = new Set(failSet)
    },
    /**
     * 设置定时器
     * @param {Number} timer 定时器
     */
    SET_MESSAGE_TIMER (state, timer) {
      state.messageTimer = timer
    },
    /**
     * 设置循环队列的当前位置
     * @param {Number} index 新位置标识
     */
    SET_CURRENT_SLOT_INDEX (state, index) {
      state.currentSlotIndex = index
    },
    /**
     * 清除循环队列中对应的插槽
     * @param {Number} slotIndex 插槽序号
     */
    CLEAR_LIST_LOOP_SLOT (state, slotIndex) {
      // 这里未进行数据类型的判断
      // 使用该方法前需要进行判断
      state.listLoop[slotIndex].clear()
    },
    /**
     * 增加定时任务 (考虑做成action)
     * @param {String} messageId 消息id
     */
    ADD_TIMING_TASK (state, messageId) {
      const { sendingMap } = state
      // 如果循环队列中已存在该uid，需要先干掉，重新计时
      let slotIndex = sendingMap.get(messageId)
      if (typeof slotIndex !== 'undefined') {
        state.listLoop[slotIndex].delete(messageId)
      }
      // 将该uid重现添加到循环队列中
      // 周期7，新插入的置入当前的后一个（即，6s后可以扫描到它）
      // 更新map中这个uid的最新slotIndex
      slotIndex = state.currentSlotIndex - 1
      const index = slotIndex < 0 ? 6 : slotIndex
      state.listLoop[index] = state.listLoop[index]
        ? state.listLoop[index].add(messageId)
        : new Set().add(messageId)
      // 添加到发送中队列
      sendingMap.set(messageId, index)
      state.sendingMap = new Map(sendingMap)
    },
    /**
     * 删除定时任务 (考虑做成action)
     * @param {String} messageId 消息id
     */
    DEL_TIMING_TASK (state, messageId) {
      const { sendingMap } = state
      const slotIndex = sendingMap.get(messageId)
      if (typeof slotIndex !== 'undefined') {
        state.listLoop[slotIndex].delete(messageId)

        sendingMap.delete(messageId)
        state.sendingMap = new Map(sendingMap)
      }
    }
  },

  actions: {
    /**
     * 获取群组列表
     */
    GetGroupList ({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        getGroupList(rootGetters.userId).then(response => {
          if (response.status === 200) {
            commit('SET_GROUP_LIST', [ ...response.result.data ])
          } else {
            reject(new Error('getGroupList: 服务器发生错误!'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取联系人树
     */
    GetContactsTree ({ commit }) {
      const root = 'root'
      return new Promise((resolve, reject) => {
        getContactsTree(root).then(response => {
          if (response.status === 200) {
            commit('SET_CONTACTS_TREE', [ ...response.result.data ])
          } else {
            reject(new Error('getContactsTree: 服务器发生错误!'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取最近联系人列表(用于初始化最近联系人列表)
     */
    GetRecentContacts ({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        getRecentContacts(rootGetters.userId).then(response => {
          if (response.status === 200) {
            commit('SET_RECENT_CONTACTS', [ ...response.result.data ])
          } else {
            reject(new Error('getRecentContacts: 服务器发生错误'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 更新最近联系人列表
     * @param {...Tweet.contactInfo, reOrder, addUnread} freshItem
     * { id, name, avatar, secretLevel, memberNum, isGroup, reOrder, addUnread }
     * reOrder: 重新排序
     * addUnread: 增加未读消息数量
     */
    UpdateRecentContacts ({ commit, state, rootGetters }, freshItem) {
      const { recentContacts, groupList, talkMap, currentTalk } = state
      const index = recentContacts.findIndex(element => element.id === freshItem.id)
      const newItem = new RecentContact(freshItem)
      // 设置状态
      newItem.isTop = setIsTop(recentContacts, freshItem.id)
      newItem.isMute = setIsMute(groupList, freshItem.isGroup, freshItem.id)
      setMessageInfo(freshItem.id, talkMap, newItem)
      newItem.unreadNum = setUnreadNum(
        recentContacts, freshItem.id, freshItem.addUnread, currentTalk.id)
      // 告知服务器未读消息的状态
      // TODO: 告知服务器的条件还要再加判断
      if (newItem.unreadNum === 0) {
        syncUnread2Server(
          newItem.unreadNum,
          rootGetters.onlineState === ONLINE_STATUS.ONLINE,
          rootGetters.userId,
          freshItem.id)
      }
      if (index > -1) {
        this._vm.$delete(recentContacts, index)
      }
      const TopNum = recentContacts.filter(element => element.isTop).length
      // 更新列表顺序
      if (freshItem.reOrder) {
        newItem.isTop
          ? recentContacts.unshift(newItem)
          : recentContacts.splice(TopNum, 0, newItem)
      } else {
        if (index > -1) {
          recentContacts.splice(index, 0, newItem)
        } else {
          newItem.isTop
            ? recentContacts.unshift(newItem)
            : recentContacts.splice(TopNum, 0, newItem)
        }
      }
      commit('SET_RECENT_CONTACTS', recentContacts)
    },
    /**
     * 获取所有未读消息的map(初始化缓存中的消息列表)
     */
    GetTalkMap ({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        getTalkMap(rootGetters.userId).then(response => {
          if (response.status === 200) {
            commit('SET_TALK_MAP', {
              fromServer: true,
              talkMapData: response.result.data
            })
          } else {
            reject(new Error('getTalkMap: 服务器发生错误'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 收到消息后 更新缓存中的talkMap
     * @param {Object} messageObj {direction(send/receive), message}
     */
    UpdateTalkMap ({ state, commit, rootGetters }, messageObj) {
      const { direction, message } = messageObj
      if (direction === 'receive' && message.fromId === rootGetters.userId) return
      let tempMessageList = []
      if (direction === 'receive') {
        tempMessageList = state.talkMap.get(message.contactInfo.id) || []
        tempMessageList.push(new Tweet(message))
        commit('SET_TALK_MAP', {
          fromServer: false,
          talkMapData: [[message.contactInfo.id, tempMessageList]]
        })
      }
      if (direction === 'send') {
        tempMessageList = state.talkMap.get(message.toId) || []
        tempMessageList.push(new Tweet(message))
        commit('SET_TALK_MAP', {
          fromServer: false,
          talkMapData: [[message.toId, tempMessageList]]
        })
      }
    },
    /**
     * 更新缓存中的草稿信息
     * @param {Array} draft 草稿信息[id, message]
     */
    UpdateDraftMap ({ state, commit }, draft) {
      return new Promise((resolve) => {
        if (draft[0]) commit('SET_DRAFT_MAP', draft)
        resolve(draft)
      }).catch(error => {
        throw (error)
      })
    },
    /**
     * 开启超时定时器
     */
    StartMessageTimer ({ state, commit, dispatch }) {
      dispatch('ClearMessageTimer')
        .then(() => {
          const timer = setInterval(() => {
            const slotSet = state.listLoop[state.currentSlotIndex]
            if (slotSet && slotSet.size > 0) {
              for (const uid of slotSet.values()) {
                // 将执行完的uid从sendingMap中剔除
                commit('DEL_SENDING_MAP', uid)
                // 添加到失败列表中
                commit('ADD_FAIL_SET', uid)
                console.log(`消息：<${uid}>超时，发送失败！`)
              }
              // 置空该集合
              slotSet.clear()
              commit('CLEAR_LIST_LOOP_SLOT', state.currentSlotIndex)
            }
            // 继续循环
            commit('SET_CURRENT_SLOT_INDEX', (++state.currentSlotIndex) % 7)
          }, 1000)
          commit('SET_MESSAGE_TIMER', timer)
        })
    },
    /**
     * 清除消息定时器
     */
    ClearMessageTimer ({ state }) {
      clearInterval(state.messageTimer)
    }
  },
  strict: process.env.NODE_ENV !== 'production'
}

export default talk
