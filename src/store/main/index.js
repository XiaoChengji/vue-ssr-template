import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'

const state = {
  title: '炒粉加蛋',
  content: '炒粉不加蛋，香味少一半',
  list: [],
  detail: {}
}

export default {
  state,
  getters,
  actions,
  mutations
}
