import { axios } from '@/utils/request'
const ConfigURL = '/api-server/'
class ConfigXHR {
  //  审核接口
  login (parameter) {
    return axios({
      url: `${ConfigURL}/admin/user/login`, method: 'POST', data: parameter
    })
  }
  //  审核接口
  videoVerify (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/verify`, method: 'POST', data: parameter
    })
  }
  // 视频列表根据状态区分
  videoList (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/list`, method: 'get', params: parameter
    })
  }
  // 修改点赞数
  videoChangePraise (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/changePraise`, method: 'POST', data: parameter
    })
  }
  // 视频删除接口
  videoDel (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/del`, method: 'GET', params: parameter
    })
  }
}
export default new ConfigXHR()
