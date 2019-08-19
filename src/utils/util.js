export const timeFix = () => {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export const welcome = () => {
  const arr = ['新的一天加油啊!', '准备吃什么呢?', '我猜你可能累了']
  const index = Math.floor((Math.random() * arr.length))
  return arr[index]
}
/**
 * 触发 window.resize
 */
export const triggerWindowResizeEvent = () => {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export const removeLoadingAnimate = (id = '', timeout = 1500) => {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)可以用1-2个占位符
 * 年(y)可以用1-4个占位符，毫秒(S)只能用1个占位符号(是1-3为的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")	==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")			==> 2006-7-2 8:9:4.18
 * @param {Date} date 时间
 * @param {String} fmt 格式
 */
export const format = (date, fmt) => {
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S+': date.getMilliseconds(),
    'q+': Math.floor(date.getMonth() / 3) + 1,
    'h+': (() => {
      // 12小时制
      // const hour = date.getHours() % 12
      // 24小时制
      const hour = date.getHours()
      return hour === 0 ? 12 : hour
    })(),
    'E+': (() => {
      const week = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
      }
      return week[date.getDay() + '']
    })(),
    /*
		"e+": (()=>{
			const week = {"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"};
			return week[date.getDay()+""];
		})(),
		*/
    'x1': (() => {
      const week = {
        '0': '周日',
        '1': '周一',
        '2': '周二',
        '3': '周三',
        '4': '周四',
        '5': '周五',
        '6': '周六'
      }
      return week[date.getDay() + '']
    })(),
    'x2': (() => {
      const hour = ['凌晨', '早上', '下午', '晚上']
      const h = date.getHours()
      if (h === 12) return '中午'
      return hour[parseInt(h / 6)]
    })()
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')', 'g').test(fmt)) {
      const len = RegExp.$1.length
      fmt = fmt.replace(RegExp.$1, len === 1 ? o[k] : ('00' + o[k]).substr(-len))
    }
  }
  return fmt
}

/**
 * 将时间格式转换成类似于微信的时间格式
 * @param {Date} date 时间
 */
export const toWeiXinString = (date) => {
  date = new Date(date)
  let str
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const beforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)
  const monday = new Date(today)
  monday.setDate(today.getDate() - (today.getDay() ? today.getDay() - 1 : 6))
  // 注意：date初始化默认是按本地时间初始的，但打印默认却是按GMT时间打印的，也就是说打印出的不是本地现在的时间
  // LocaleString的打印也有点问题，"0点"会被打印为"上午12点"
  if (date.getTime() > today.getTime()) {
    str = ''
  } else if (date.getTime() > yesterday.getTime()) {
    str = '昨天'
  } else if (date.getTime() > beforeYesterday.getTime()) {
    str = '前天'
  } else if (date.getTime() > monday.getTime()) {
    const week = {
      '0': '周日',
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六'
    }
    str = week[date.getDay() + '']
  } else {
    const hour = ['凌晨', '早上', '下午', '晚上']
    const h = date.getHours()
    if (h === 12) str = '中午'
    else str = hour[parseInt(h / 6)]
    str = format(date, 'MM月dd ') + str
  }
  str += format(date, 'HH:mm')
  return str
}

/**
 * 格式化时间
 * @param {Date} date 时间
 */
export const formatDateTime = (date) => {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} date 日期
 */
export const dateStr = (date) => {
  // 获取js 时间戳
  let time = new Date().getTime()
  // 去掉 js 时间戳后三位
  time = parseInt((time - date * 1000) / 1000)

  // 存储转换值
  let s
  if (time < 60 * 10) {
    // 十分钟内
    return '刚刚'
  } else if (time < 60 * 60 && time >= 60 * 10) {
    // 超过十分钟少于1小时
    s = Math.floor(time / 60)
    return s + '分钟前'
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60)
    return s + '小时前'
  } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
    // 超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24)
    return s + '天前'
  } else {
    // 超过3天
    const dateTemp = new Date(parseInt(date) * 1000)
    return dateTemp.getFullYear() + '/' + (dateTemp.getMonth() + 1) + '/' + dateTemp.getDate()
  }
}

/**
 * 下载
 * @param {String} url 下载地址
 * @param {String} fileName 文件名
 */
export const download = (url, fileName) => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}
