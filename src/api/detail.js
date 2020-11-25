import axios from 'axios'

export function getDetail(id) {
    return axios.get('http://localhost:8080/api/main/getDetail?id=' + id)
}