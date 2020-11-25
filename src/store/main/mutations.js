import * as types from './types'
export const mutations = {
  [types.MAIN_LIST] (state, { list }) {
    state.list = list
  },
  [types.MAIN_DETAIL] (state, data) {
    state.detail = data
  }
}
