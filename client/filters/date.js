import Vue from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// datetime可以是数字时间戳、时间字符串或 Date 对象
Vue.filter('datetime', function (date) {
  return format(date, 'PPPpp', { locale: zhCN })
})
