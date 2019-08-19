import { axios } from '@/utils/request'

const api = {
  talkMembers: 'chat/members',
  groupInfo: 'chat/zzGroup/getGroupInfo',
  groupList: 'chat/zzGroup/queryGroupListByUserId',
  contactsInfo: 'admin/user/',
  contactsTree: 'admin/org/orgUsers',
  recentContacts: 'chat/zzGroup/queryContactListById',
  talkMap: 'chat/zzGroup/queryHistoryMessageById',
  talkHistory: 'chat/history',
  getHistory: 'chat/zzGroup/queryHistoryMessageForSingle',
  getTalksetting: 'chat/zzGroup/getGroupInfo',
  getMoreInfo: '/talk/contacts/info',
  fileGrabble: 'chat/zzGroupFile/groupfile',
  setFileApproveFLg: 'chat/zzFileManage/setFileApproveFLg',
  groupFileListByMe: 'chat/zzGroupFile/groupFileListByMe',
  groupFileListByPass: 'chat/zzGroupFile/groupFileListByPass',
  groupFileListByOwner: 'chat/zzGroupFile/groupFileListByOwner',
  getPrivateFile: 'chat/zzPrivateMsg/privateFile',
  getGroupFile: 'chat/zzPrivateMsg/privateFile',
  fileDown: '/chat/zzFileManage/downloadFile',
  userfileGrabble: 'chat/zzPrivateMsg/privateFile',
  talkHistoryAll: 'chat/zzGroup/queryHistoryMessageForSingle',
  MarkMessageGrabble: 'chat/zzUserGroupMsgTag/getUserGroupMsgTagList',
  getGroupMembers: 'chat/zzGroup/getGroupUserList',
  removeMember: 'chat/zzGroup/removeMember',
  addMember: 'chat/zzGroup/addMember',
  filePermission: 'chat/zzFileManage/getFilesStatus',
  // getContent: 'https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/notice',
  // 下面的地址前面必须加/
  // 研讨文件上传地址
  fileUpload: '/zuul/api/chat/zzFileManage/singleFileUpload',
  // 图片预览地址
  imgPrevie: '/api/chat/zzFileManage/GetFile',
  // 文件下载地址
  fileDownload: '/api/chat/zzFileManage/downloadFile'
}
export default api

/**
 * 获取当前研讨中的成员
 * @param {String} contactId
*/
export function getTalkMembers (contactId) {
  return axios({
    url: api.talkMembers,
    method: 'get',
    params: {
      contactId: contactId
    }
  })
}

/**
 * 通过群组id获取群组详细信息
 * @param {String} groupId 群组id
 */
export function getGroupInfo (groupId) {
  return axios({
    url: api.groupInfo,
    method: 'GET',
    params: {
      groupId: groupId
    }
  })
}

/**
 * 通过联系人id获取联系人详细信息
 * @param {String} contactsId 联系人id
 */
export function getContactsInfo (id) {
  return axios({
    url: api.contactsInfo + id,
    method: 'GET'
  })
}

/**
 * 获取群组列表
 * @param {String} userId 当前用户id
 */
export function getGroupList (userId) {
  return axios({
    url: api.groupList,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取联系人树
 */
export function getContactsTree () {
  return axios({
    url: api.contactsTree,
    method: 'GET',
    params: { parentTreeId: 'root' }
  })
}

/**
 * 获取最近联系人列表
 * @param {String} userId 当前用户id
 */
export function getRecentContacts (userId) {
  return axios({
    url: api.recentContacts,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取未读消息
 * @param {String} userId 当前用户id
 */
export function getTalkMap (userId) {
  return axios({
    url: api.talkMap,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取指定联系人的研讨记录
 * @param {String} userId 当前用户id
 * @param {String} contactId 指定联系人id
 */
export function getTalkHistory (userId, contactId) {
  return axios({
    url: api.talkHistory,
    method: 'GET',
    params: {
      userId: userId,
      contactId: contactId
    }
  })
}

/**
 * 聊天历史记录
 */
export function getHistory (parameter) {
  return axios({
    url: api.getHistory,
    method: 'get'
  })
}

/**
 * 群组Talksetting
 */

export function getTalksetting (parameter) {
  return axios({
    url: api.getTalksetting,
    method: 'get',
    params: {
      groupId: parameter
    }
  })
}

/**
 * fileGrabble
 */
export function fileGrabble (parameter) {
  return axios({
    url: api.fileGrabble,
    method: 'post',
    params: parameter
  })
}
/**
 * GroupNotice
 */
export function getContent (parameter) {
  return axios({
    url: api.getContent,
    method: 'post'
  })
}

/**
 * 联系人判断历史消息
 */
export function talkHistoryAll (userId, isGroup, id, query, page) {
  return axios({
    url: api.talkHistoryAll,
    method: 'get',
    params: {
      userId: userId,
      isGroup: isGroup,
      contactId: id,
      query: query,
      page: page,
      size: 30
    }
  })
}
/**
 * 联系人判断历史消息
 * ?userId?groupId?tagType=0?page?size
 */
export function MarkMessageGrabble (userId, page, groupId) {
  return axios({
    url: api.MarkMessageGrabble,
    method: 'get',
    params: {
      userId: userId,
      page: page,
      groupId: groupId,
      size: 30,
      tagType: 0
    }
  })
}
/**
 * 联系人文件
 * userd receiver page size
 */
export function getPrivateFile (parameter) {
  return axios({
    url: api.getPrivateFile,
    method: 'post',
    params: parameter
  })
}
/**
 * 我的文件(群组)
 */
export function getGroupFile (parameter) {
  return axios({
    url: api.getGroupFile,
    method: 'post',
    params: parameter
  })
}
/**
 * 我的文件(群组)
 */
export function groupFileListByMe (parameter) {
  return axios({
    url: api.groupFileListByMe,
    method: 'post',
    params: parameter
  })
}
/**
 * 我的审批(群组)
 */
export function groupFileListByOwner (parameter) {
  return axios({
    url: api.groupFileListByOwner,
    method: 'post',
    params: parameter
  })
}
/**
 * 已审批(群组)
 */
export function groupFileListByPass (parameter) {
  return axios({
    url: api.groupFileListByPass,
    method: 'post',
    params: parameter
  })
}
/**
 * 审批文件
 */
export function setFileApproveFLg (parameter) {
  return axios({
    url: api.setFileApproveFLg,
    method: 'post',
    params: parameter
  })
}
/**
 * 群成员列表
 * ?groupId=
 */
export function getGroupMembers (groupId) {
  return axios({
    url: api.getGroupMembers,
    method: 'get',
    params: {
      groupId
    }
  })
}
/**
 * 群成员列表（分页）TODO
 */
export function getGroupMembersPage (parameter) {
  return axios({
    url: api.getGroupMembers,
    method: 'get',
    params: parameter
  })
}
/**
 * 群组新增成员
 */
export function addMember (parameter) {
  return axios({
    url: api.addMember,
    method: 'get',
    params: parameter
  })
}
/**
 * 移出群组
 */
export function removeMember (parameter) {
  return axios({
    url: api.removeMember,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取文件下载权限
 * @param {String} fileIds 文件ID，多个以逗号分割
 */
export function getFilePermission (fileIds) {
  return axios({
    url: api.filePermission,
    method: 'get',
    params: { fileIds: fileIds }
  })
}
