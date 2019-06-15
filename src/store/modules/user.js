import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: {},
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {} // 当前用户的所有信息
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    /**
     * 登陆
     * @param {Object} userInfo 用户信息
     */
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取登陆用户的详细信息
     */
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          // 判断用户角色
          if (result.userRole && result.userRole.frontPermissionList.length > 0) {
            const role = result.userRole
            role.permissions = result.userRole.frontPermissionList
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.userRole)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: 用户权限(userRole)必须是非空数组!'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 退出登陆
     */
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        // 断开websocket连接
        Vue.prototype.SocketGlobal.close(3400, '退出登陆')

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
