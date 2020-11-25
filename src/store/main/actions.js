import APIInstance from '@/api'
import * as types from './types'

export const actions = {
    getList({ commit, state }, id) {
        return APIInstance.MAIN.getList(id)
            .then(res => {
            	const result = res.data || {}
                commit(types.MAIN_LIST, { list: result.data })
                return result
            })
    },
    getDetail({ commit, state }, id) {
        return APIInstance.DETAIL.getDetail(id)
            .then(res => {
            	const result = res.data || {}
                commit(types.MAIN_DETAIL, result.data)
                return result
            })
    }
}