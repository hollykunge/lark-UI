// 这个组件必须最先引入，否则会报错
import MessagePiece from './MessagePiece'
// 抽屉组件
import TalkSetting from './Drawers/TalkSetting'
import TalkHistory from './Drawers/TalkHistory'
import GroupNotice from './Drawers/GroupNotice'
import MarkMessage from './Drawers/MarkMessage'
import MoreInfo from './Drawers/MoreInfo'
import TalkFile from './Drawers/TalkFile'

import CreateTalk from './CreateTalk'

import ConvBox from './ConvBox'
import RecentContactsItem from './RecentContactsItem'
import ContactsTree from './ContactsTree'
import ContactsInfo from './ContactsInfo'
import GroupItem from './GroupItem'
import GroupInfo from './GroupInfo'
import Face from './Face'
import ContactsItem from './ContactsItem'

export {
  // 消息展示组件
  MessagePiece,
  // 研讨设置
  TalkSetting,
  // 研讨历史
  TalkHistory,
  // 群公告
  GroupNotice,
  // 标记消息
  MarkMessage,
  // 更多信息
  MoreInfo,
  // 研讨文件
  TalkFile,

  // 创建新的研讨
  CreateTalk,

  // 研讨对话框组件
  ConvBox,
  // 联系人组件
  ContactsTree,
  // 联系人信息组件
  ContactsInfo,
  // 最近联系人(项)组件
  RecentContactsItem,
  // 群组(项)组件
  GroupItem,
  // 群组信息组件
  GroupInfo,
  Face,
  // 联系人项
  ContactsItem
}
