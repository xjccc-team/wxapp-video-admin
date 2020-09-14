<template>
  <a-form :form="form">
    <a-row style="width: 100%;margin:20px">
      <a-col :span="24" ><h3 class="title">上传各分部视频</h3></a-col>
      <a-col :span="24">
        <a-list
          rowKey="id"
          position
          :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
          :dataSource="videoLists">
          <a-list-item slot="renderItem" slot-scope="item,index">
            <template >
              <a-card :hoverable="false">
                <a-card-meta>
                  <a slot="title">{{ item.name||'请填写名称' }}
                    <a-icon
                      v-if="videoLists.length>1"
                      class="dynamic-delete-button"
                      type="close-circle"
                      @click="removeVideo(item,index)"
                    />
                  </a>
                  <div class="meta-content" slot="description">
                    <video class="video" controls="controls" :src="item.videoSrc" width="100%" preload >您的浏览器不支持 HTML5 video 标签。</video>
                  </div>
                </a-card-meta>
                <template class="ant-card-actions" slot="actions">
                  <div>
                    <span class="label">视频：</span>
                    <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :data="{'index':index}" :show-upload-list="false" :customRequest="handleChange">
                      <a-button><a-icon type="upload" />上传视频</a-button>
                    </a-upload>
                    <a-input style="width: calc(100% - 90px);margin-left:80px;margin-top:10px;" v-model="item.videoSrc" placeholder="请填写视频地址" />
                  </div>
                  <div>
                    <span class="label">点赞修改：</span>
                    <a-input-number style="width:110px" v-model="item.praise" />
                    <a-button class="prise-edit" type="primary" @click="editPrise(item)">确认</a-button>
                  </div>
                  <div>
                    <span class="label">名称：</span>
                    <a-input style="width: calc(100% - 90px)" v-model="item.name" placeholder="请填写name" />
                  </div>
                  <div>
                    <span class="label">描述：</span>
                    <a-textarea style="width: calc(100% - 90px)" v-model="item.description" placeholder="请填写描述" />
                  </div>

                </template>
              </a-card>
            </template>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :span="24" class="submit-group">
        <a-button type="primary" style="width: 140px;color:#fff" @click="addVideo">
          <a-icon type="plus" /> 添加
        </a-button>
        <a-button type="primary" style="width: 140px;color:#fff" @click="submitVideo">提交</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import XHR from '../../api/video'
export default {
  name: 'CardList',
  data () {
    return {
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      videoLists: [],
      delList: [],
      key: 'updatable',
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.getVideoLists()
  },
  methods: {
      async uploadImgFun (info) {
      var formData = new FormData()
      formData.append('type', 'admin')
      formData.append('files', info.file)
      const res = await XHR.uploadVideo(formData)
      try {
        if (res.status === 0) {
          this.$message.success({ content: `${info.file.name} 上传成功`, key: this.key })
          return res.data
        } else {
          this.$message.warning({ content: res.message, key: this.key })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleChange (info) {
    this.$message.loading({ content: 'Loading...', key: this.key })
     const data = await this.uploadImgFun(info)
     const index = info.data.index
     this.$set(this.videoLists[index], 'videoSrc', data)
    },
    addVideo () {
      this.videoLists.push({
        'code': '0',
        'name': '',
        'description': '',
        'videoSrc': '',
        'status': 1
      })
    },
    editPrise (item) {
      const json = {
        videoCode: item.code,
        count: item.praise
      }
      XHR.changePraise(json).then(res => {
        if (res.status === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.success(res.data)
        }
      })
    },
    submitVideo () {
      let adminVideoRecordInfoVOList = this.videoLists.filter(item => item.name !== '' && item.description !== '')
      adminVideoRecordInfoVOList = adminVideoRecordInfoVOList.reduce((all, next) => all.some((item) => item['name'] === next['name']) ? all : [...all, next], [])
      const json = {
        adminVideoRecordInfoVOList: adminVideoRecordInfoVOList,
        delList: this.delList
      }
      XHR.videoModify(json).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.success(res.data)
        }
      })
    },
    removeVideo (item, index) {
      this.videoLists.splice(index, 1)
      if (item.code) {
        this.delList = [...this.delList, item.code]
      }
    },
    // 获取分部视频列表
    getVideoLists (item, index) {
       XHR.adminVideoList().then(res => {
        if (res.status === 0) {
          this.videoLists = res.data
        } else {
          this.$message.success(res.data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dynamic-delete-button {
  display: inline-block;
  margin-left:20px;
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.dynamic-delete-button{
    float: revert;
    position: absolute;
    right: 15px;
    top: 10px;
    z-index: 100;
}
.title{
    margin-bottom: 25px;
    font-weight: bold;
}
/deep/.ant-card-actions{
  flex-direction: column;
  li{
    width: 100% !important;
    text-align: left;
    padding: 0 10px;
    .label{
      width: 80px;
      display: inline-block;
      text-align: right;
      float: left;
    }
  }
}
/deep/ .ant-card-body {
    padding: 15px;
  }
.meta-content{
  .video{
    width: 100%;
    height: 200px;
  }
}
 .prise-edit{
    display: inline-block !important;
    width: auto !important;
    margin-left: 11px;
  }
.radio{
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}
.submit-group{
  margin-top: 20px;
  button{
    margin-right:20px;
  }
}
.map-list{
  margin-bottom: 20px;
}
.input-group{
  span{
    height: 32px;
    margin: 0 10px;
    line-height: 32px;
  }
}
</style>
