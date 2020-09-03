import { axios } from '@/utils/request'
const ConfigURL = '/api-server'
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
  // 地图城市列表获取
  mapList (parameter) {
    return axios({
      url: `${ConfigURL}/lightmap/list`, method: 'GET', params: parameter
    })
  }
  // 添加地图城市
  mapModify (parameter) {
    return axios({
      url: `${ConfigURL}/admin/lightmap/modify`,
      method: 'POST',
      data: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
  // 添加视频
  uploadVideo (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/upload`,
      method: 'POST',
      data: parameter,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
  // 添加分部视频列表
  videoModify (parameter) {
    return axios({
      url: `${ConfigURL}/admin/video/modify`,
      method: 'POST',
      data: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
  // 获取分部视频列表
  adminVideoList (parameter) {
    return axios({
      url: `${ConfigURL}/adminVideo/list`, method: 'get', params: parameter
    })
  }
  // 修改分部视频点赞
  changePraise (parameter) {
    return axios({
      url: `${ConfigURL}/admin/adminVideo/changePraise`, method: 'POST', data: parameter
    })
  }
}
export default new ConfigXHR()
