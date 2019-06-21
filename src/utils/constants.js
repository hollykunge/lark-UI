/**
 * constants.js 文件存储所有常量信息
 */

// 密级常量
const SECRETLEVEL_ENUM = new Map([
  ['default', '非密'],
  // 服务端传递的密级参数
  [30, { people: '非密', file: '非密' }],
  [40, { people: '一般', file: '秘密' }],
  [50, { people: '一般', file: '秘密' }],
  [60, { people: '重要', file: '机密' }],
  [70, { people: '重要', file: '机密' }]
])

// 错误类型
const ErrorType = {
  TIMEOUT_ERROR: 9, // 超时
  TOKEN_ERROR: 401, // token 失效错误
  PARAM_ERROR: 400, // 参数错误
  FLUSH_TOKEN_ERROR: 7, // 刷新token错误
  SERVER_ERROR: 500 // 刷新token错误
}

// 登陆状态常量 同websocket的readyState
const LandingStatus = {
  /** 正在登陆 */
  LANDING: 0,
  /** 在线 */
  ONLINE: 1,
  /** 正在退出 */
  EXITING: 2,
  /** 离线 */
  OFFLINE: 3
}

export {
  SECRETLEVEL_ENUM,
  ErrorType,
  LandingStatus
}
