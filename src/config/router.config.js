// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  PageView,
  GeneralView,
  MonitorView
} from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'Dashboard',
        redirect: '/dashboard/workplace',
        component: MonitorView,
        meta: {
          title: '工作舱',
          keepAlive: true,
          hideHeader: true,
          icon: 'compass',
          permission: ['dashboard']
        },
        hideChildrenInMenu: true,
        children: [{
          path: 'workplace',
          name: 'Workplace',
          component: () => import(/* webpackChunkName: "workplace" */ '@/views/dashboard/Workplace'),
          meta: {
            title: '工作台',
            keepAlive: true,
            icon: 'compass',
            permission: ['dashboard'],
            hidden: true
          }
        },
        {
          path: '/dashboard/feedback',
          name: 'Feedback',
          component: () => import(/* webpackChunkName: "feedback" */ '@/views/dashboard/Feedback'),
          meta: {
            title: '问题反馈',
            hidden: true,
            keepAlive: false,
            permission: ['dashboard']
          }
        },
        {
          path: 'msg-list',
          name: 'MyNotice',
          component: () => import(/* webpackChunkName: "myNotice" */ '@/views/dashboard/NotificationList'),
          meta: {
            title: '消息列表',
            icon: 'bell',
            keepAlive: false,
            hidden: true,
            permission: ['dashboard']
          }
        }
        ]
      },
      {
        path: 'talk',
        name: 'Talk',
        component: RouteView,
        redirect: '/talk/chatpanel/chatbox',
        meta: {
          title: '研讨',
          icon: 'message',
          hideHeader: true,
          keepAlive: true,
          permission: ['talk']
        },
        hideChildrenInMenu: true,
        children: [{
          path: 'chatpanel',
          name: 'ChatPanel',
          component: () => import(/* webpackChunkName: "chatPanel" */ '@/views/talk/ChatPanel'),
          meta: {
            title: '研讨面板',
            keepAlive: true,
            permission: ['talk'],
            hidden: true
          },
          children: [{
            path: 'chatbox',
            name: 'ChatBox',
            component: () => import(/* webpackChunkName: "chatPanel" */ '@/views/talk/ChatBox'),
            meta: {
              title: '研讨面板',
              keepAlive: true,
              permission: ['talk'],
              hidden: true
            }
          }]
        }]
      },
      {
        path: 'syslist',
        name: 'sysList',
        component: PageView,
        redirect: '/list/user-list',
        meta: {
          title: '系统管理',
          icon: 'appstore',
          permission: ['user', 'org', 'role', 'notice', 'menu']
        },
        children: [{
          path: 'user-list',
          name: 'UserList',
          component: () => import(/* webpackChunkName: "userList" */ '@/views/admin/UserList'),
          meta: {
            title: '用户管理',
            icon: 'smile',
            keepAlive: false,
            permission: ['user']
          }
        },
        {
          path: 'org-list',
          name: 'OrgList',
          component: () => import(/* webpackChunkName: "orgList" */ '@/views/admin/OrgList'),
          meta: {
            title: '组织管理',
            icon: 'contacts',
            keepAlive: false,
            permission: ['org']
          }
        },
        {
          path: 'role-list',
          name: 'RoleList',
          component: () => import(/* webpackChunkName: "roleList" */ '@/views/admin/RoleList'),
          meta: {
            title: '角色管理',
            icon: 'credit-card',
            keepAlive: false,
            permission: ['role']
          }
        },
        {
          path: 'menu-list',
          name: 'MenuList',
          component: () => import(/* webpackChunkName: "menuList" */ '@/views/admin/MenuList'),
          meta: {
            title: '菜单管理',
            icon: 'profile',
            keepAlive: false,
            permission: ['menu']
          }
        }
        ]
      },
      {
        path: 'businisslist',
        name: 'businissList',
        component: PageView,
        redirect: '/',
        meta: {
          title: '业务管理',
          icon: 'setting',
          permission: ['notice', 'word', 'commontools', 'filemanager', 'groupmaneger', 'gatelog', 'privateMsg', 'groupMsg']
        },
        children: [
          {
            path: 'msg-list',
            name: 'MsgList',
            component: () => import(/* webpackChunkName: "msgList" */ '@/views/admin/NotificationList'),
            meta: {
              title: '消息列表',
              icon: 'sound',
              keepAlive: false,
              permission: ['notice']
            }
          },
          {
            path: '/list/word-list',
            name: 'WordList',
            component: () => import(/* webpackChunkName: "wordList" */ '@/views/admin/DictWord'),
            meta: {
              title: '敏感词汇管理',
              icon: 'alert',
              keepAlive: false,
              permission: ['word']
            }
          },
          {
            path: '/list/commontools',
            name: 'CommonTools',
            component: () => import(/* webpackChunkName: "commonTools" */ '@/views/admin/CommonTools'),
            meta: {
              title: '常用链接管理',
              icon: 'tool',
              keepAlive: false,
              permission: ['commontools']
            }
          },
          {
            path: '/list/log-list',
            name: 'LogList',
            component: () => import(/* webpackChunkName: "logList" */ '@/views/admin/LogList'),
            meta: {
              title: '日志列表',
              icon: 'reconciliation',
              keepAlive: false,
              permission: ['gatelog']
            }
          },
          {
            path: 'file-list',
            name: 'FileManeger',
            component: () => import(/* webpackChunkName: "fileManeger" */ '@/views/admin/FileTable'),
            meta: {
              title: '文件管理',
              icon: 'file',
              keepAlive: false,
              permission: ['filemanager']
            }
          },
          {
            path: 'group-list',
            name: 'GroupManeger',
            component: () => import(/* webpackChunkName: "groupManeger" */ '@/views/admin/GroupTable'),
            meta: {
              title: '研讨组管理',
              icon: 'message',
              keepAlive: false,
              permission: ['groupmaneger']
            }
          },
          {
            path: '/list/privateMsg',
            name: 'privateMsg',
            component: () => import(/* webpackChunkName: "privateMsg" */ '@/views/admin/privateMsg'),
            meta: {
              title: '个人消息审计',
              icon: 'tag',
              keepAlive: false,
              permission: ['privateMsg']
            }
          },
          {
            path: '/list/groupMsg',
            name: 'groupMsg',
            component: () => import(/* webpackChunkName: "groupMsg" */ '@/views/admin/groupMsg'),
            meta: {
              title: '群组消息审计',
              icon: 'tags',
              keepAlive: false,
              permission: ['groupMsg']
            }
          }
          // {
          //   path: 'service-list',
          //   name: 'ServiceList',
          //   component: () => import(/* webpackChunkName: "serviceList" */ '@/views/admin/ServiceList'),
          //   meta: {
          //     title: '服务管理',
          //     icon: 'database',
          //     keepAlive: false,
          //     permission: ['service']
          //   }
          // },
        ]
      },
      // result
      {
        path: 'result',
        name: 'Result',
        component: PageView,
        redirect: '/result/success',
        meta: {
          title: '工具',
          icon: 'check-circle-o',
          permission: ['result']
        },
        children: [{
          path: 'success',
          name: 'ResultSuccess',
          component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
          meta: {
            title: '成功',
            hiddenHeaderContent: true,
            permission: ['result']
          }
        },
        {
          path: 'fail',
          name: 'ResultFail',
          component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
          meta: {
            title: '失败',
            hiddenHeaderContent: true,
            permission: ['result']
          }
        }
        ]
      },

      // Exception
      {
        path: 'exception',
        name: 'Exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: {
          title: '异常页',
          icon: 'warning',
          permission: ['exception']
        },
        children: [{
          path: '403',
          name: 'Exception403',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
          meta: {
            title: '403',
            permission: ['exception']
          }
        },
        {
          path: '404',
          name: 'Exception404',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
          meta: {
            title: '404',
            permission: ['exception']
          }
        },
        {
          path: '500',
          name: 'Exception500',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
          meta: {
            title: '500',
            permission: ['exception']
          }
        }
        ]
      },

      // account
      {
        path: 'account',
        component: GeneralView,
        redirect: '/account/center',
        name: 'Account',
        hidden: true,
        meta: {
          title: '个人页',
          icon: 'user',
          keepAlive: true,
          permission: ['self']
        },
        children: [{
          path: 'center',
          name: 'Center',
          component: () => import(/* webpackChunkName: "account-center" */ '@/views/account/center/Index'),
          meta: {
            title: '个人中心',
            keepAlive: true,
            permission: ['self']
          }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/Index'),
          meta: {
            title: '个人设置',
            hideHeader: true,
            keepAlive: true,
            permission: ['self']
          },
          redirect: '/account/settings/base',
          hideChildrenInMenu: true,
          children: [{
            path: 'base',
            name: 'BaseSettings',
            component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/BaseSetting'),
            meta: {
              title: '基本设置',
              hidden: true,
              keepAlive: false,
              permission: ['self']
            }
          },
          // {
          //   path: 'security',
          //   name: 'SecuritySettings',
          //   component: () => import('@/views/account/settings/Security'),
          //   meta: { title: '安全设置', hidden: true, keepAlive: false, permission: [ 'un' ] }
          // },
          {
            path: 'custom',
            name: 'CustomSettings',
            component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/Custom'),
            meta: {
              title: '个性化设置',
              hidden: true,
              keepAlive: false,
              permission: ['self']
            }
          },
          {
            path: 'notification',
            name: 'NotificationSettings',
            component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/Notification'),
            meta: {
              title: '新消息通知',
              hidden: true,
              keepAlive: true,
              permission: ['user']
            }
          },
          // {
          //   path: '/account/settings/binding',
          //   name: 'BindingSettings',
          //   component: () => import('@/views/account/settings/Binding'),
          //   meta: { title: '账户绑定', hidden: true, keepAlive: false, permission: [ 'un' ] }
          // },
          // {
          //   path: '/account/settings/notification',
          //   name: 'NotificationSettings',
          //   component: () => import('@/views/account/settings/Notification'),
          //   meta: { title: '新消息通知', hidden: true, keepAlive: false, permission: [ 'un' ] }
          // },
          {
            path: 'workplace',
            name: 'WorkPlaceSettings',
            component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/Workplace'),
            meta: {
              title: '卡片设置',
              hidden: true,
              keepAlive: false,
              permission: ['self']
            }
          },
          {
            path: 'commontool',
            name: 'CommonToolSettings',
            component: () => import(/* webpackChunkName: "account-settings" */ '@/views/account/settings/CommonTool'),
            meta: {
              title: '常用链接设置',
              hidden: true,
              keepAlive: false,
              permission: ['self']
            }
          }
          ]
        }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/gatelogin',
  hidden: true,
  children: [{
    path: 'login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  }]
},
{
  path: '/404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}

]
