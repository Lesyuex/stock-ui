import Vue from 'vue'
import * as coms from '@icon-park/vue'
const useComs = [
  'bookmark-one',
  'check-one',
  'stock-market',
  'local',
  'funds',
  'shopping-mall',
  'tips',
  'local',
  'like',
  'experiment',
  'grid-two',
  'loading-one',
  'info',
  'plus',
  'down-one',
  'menu-unfold-one',
  'menu-fold-one'
]

useComs.forEach(com => {
  const key = format(com)
  console.log(key)
  console.log(coms[key])
  Vue.component(key, coms[key])
})

function format (com) {
  const arr = com.split('-')
  let realName = ''
  arr.forEach(str => {
    const word = str.charAt(0).toUpperCase() + str.substring(1)
    realName += word
  })
  return realName
}
