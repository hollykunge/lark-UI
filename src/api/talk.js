import { axios } from '@/utils/request'

const api = {
  talkMembers: 'talk/members',
  groupInfo: 'talk/group/info',
  groupList: 'talk/group/list',
  contactsInfo: 'talk/contacts/info',
  contactsTree: 'admin/org/orgUsers',
  recentContacts: 'talk/recent/list',
  talkMap: 'talk/message/map',
  talkHistory: 'talk/history'
}

export default api

export function getTalkMembers (parameter) {
  return axios({
    url: api.talkMembers,
    method: 'get',
    params: parameter
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
    params: groupId
  })
}

/**
 * 通过联系人id获取联系人详细信息
 * @param {String} contactsId 联系人id
 */
export function getContactsInfo (contactsId) {
  return axios({
    url: api.contactsInfo,
    method: 'GET',
    params: { id: contactsId }
  })
}

/**
 * 获取群组列表
 * @author jihainan
 */
export function getGroupList () {
  return axios({
    url: api.groupList,
    method: 'GET'
  })
}

/**
 * 获取联系人树
 * @author jihainan
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
 * @author jihainan
 */
export function getRecentContacts () {
  return axios({
    url: api.recentContacts,
    method: 'GET'
  })
}

/**
 * 获取未读消息
 * @author jihainan
 */
export function getTalkMap () {
  return axios({
    url: api.talkMap,
    method: 'GET'
  })
}

/**
 * 获取指定联系人的研讨记录
 * @author jihainan
 */
export function getTalkHistory () {
  return axios({
    url: api.talkHistory,
    method: 'GET'
  })
}

export function download (params, path, title) {
  return axios({
    url: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params,
    responseType: 'blob'
  }).then(res => {
    const headers = res.headers
    const blob = new Blob([res.data], {
      type: headers['content-type']
    })
    // const objectUrl = URL.createObjectURL(blob)
    // window.location.href = objectUrl
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    if (!title) {
      const fileName = headers['content-disposition']
      title = fileName.includes('filename=') ? fileName.split('=')[1] : '未命名的文件'
    }
    a.download = title
    a.click()
  }).catch((err) => {
    throw (err)
  })
}
