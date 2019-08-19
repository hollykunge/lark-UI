/**
 * 研讨相关的工具
 * @author jihainan
 */
import SocketApi from './SocketApi'

/**
 * 用于websocket通信的消息体
 * @param {Number} code 消息类型码
 * @param {Object} data 数据对象
 */
class SocketMessage {
  constructor ({ code, data } = {}) {
    if (typeof code === 'number') { this.code = code }
    if (data instanceof Object) { this.data = data }
  }

  /**
   * 将消息体转换为字符串
   */
  toString () {
    return JSON.stringify(this)
  }
}

/**
 * @description 消息体类
 * @param {String} id 消息的id
 * @param {String} username 发送者名称
 * @param {String} avatar 发送者头像地址
 * @param {String} fromId 发送者id
 * @param {String} toId 接收者id
 * @param {String} toName 接收者名称
 * @param {Array} atId 被at成员的id
 * @param {Object} content 消息内容
 * {
 *  id-String-文件id,文本传'0',
 *  url-String-文件地址,文本传'0',
 *  type-Number-消息类型 1 - 文本消息，2 - 图片消息，3 - 文件消息
 *  extension-String-文件后缀,文本传'0',
 *  title-String-文件名或文本内容,
 *  secretLevel-Number-密级 60 - 非密，70 - 秘密，80 - 机密
 * }
 * @param {Date} time 消息发送时间
 * @param {Boolean} isGroup 消息分类 ture - 群消息， - 私聊消息
 * @param {Object} contactInfo 消息发送人信息或消息发送人所在群组信息 （用于更新最近联系人）
 * {
 *  id-String-联系人或者群组id,
 *  name-String-联系人或者群组名称,
 *  avatar-String-联系人或者群组头像,
 *  secretLevel-Number-联系人或者群组密级,
 *  memberNum-Number-对话中成员的数量,
 *  isGroup-Boolean-是否为群组
 * }
 */
class Tweet {
  constructor ({
    id,
    username,
    avatar,
    fromId,
    toId,
    toName,
    atId,
    content,
    time,
    isGroup,
    contactInfo } = {}) {
    Object.assign(this, arguments[0])
  }
}

/**
 * @description 最近联系人类
 * @param {String} id id
 * @param {String} name 名称
 * @param {String} time 最后聊天时间 hh:mm
 * @param {Object} lastMessage 最后一条消息 与Tweet中的content结构一致
 * @param {String} avatar 头像地址
 * @param {Boolean} atMe 是否at我
 * @param {Number} secretLevel 联系人密级
 * @param {Number} unreadNum 未读消息数
 * @param {Number} memberNum 成员数量
 * @param {String} sender 消息发出者姓名
 * @param {Boolean} isTop 是否置顶
 * @param {Boolean} isMute 是否免打扰
 * @param {Boolean} isGroup 是否为群组
 */
class RecentContact {
  constructor ({
    id,
    name,
    time,
    lastMessage,
    avatar,
    atMe,
    secretLevel,
    unreadNum,
    memberNum,
    sender,
    isTop,
    isMute,
    isGroup } = {}) {
    if (!id) throw new Error('RecentContact: id不能为空！')
    if (!name) throw new Error('RecentContact: name不能为空！')
    // 固定属性
    this.id = id
    this.name = name
    this.avatar = avatar || ''
    this.secretLevel = secretLevel ? JSON.parse(secretLevel) : 30
    this.memberNum = memberNum ? JSON.parse(memberNum) : 0
    this.isGroup = isGroup ? JSON.parse(isGroup) : false

    // 与实时消息有关的属性
    this.unreadNum = unreadNum ? JSON.parse(unreadNum) : 0
    this.time = time || ''
    this.lastMessage = lastMessage || {}
    this.atMe = atMe ? JSON.parse(atMe) : false
    this.sender = sender || ''

    // 用户私有化的属性
    this.isTop = isTop ? JSON.parse(isTop) : false
    this.isMute = isMute ? JSON.parse(isMute) : false
  }
}

export {
  Tweet,
  SocketApi,
  SocketMessage,
  RecentContact
}
