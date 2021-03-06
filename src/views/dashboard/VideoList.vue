<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="changeTab" >

    <a-form layout="inline" class="search-wrap" @keyup.enter.native="searchQuery">
      <a-row :gutter="24">
        <a-form-item label="手机号">
          <a-input placeholder="请输入手机号" style="width:100%" v-model="mobilePhone"/>
        </a-form-item>
        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      </a-row>
    </a-form>

    <a-list
      rowKey="id"
      position
      :pagination="pagination"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource">
      <a-list-item slot="renderItem" slot-scope="item,index">
        <template >
          <a-card :hoverable="false">
            <a-card-meta>
              <a slot="title">{{ item.mobilePhone }}</a>
              <div class="meta-content" slot="description">
                <video controls="controls" width="100%" preload :src="item.videoSrc" :poster="item.imageSrc">
                  您的浏览器不支持 HTML5 video 标签。
                </video>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a v-if="tabActiveKey=='0'" style="color:#ff4d4f" @click="showModel(2,item,index)">拒绝</a>
              <a v-if="tabActiveKey=='0'" @click="verifySubmit(1,item,index)">通过</a>
              <a v-if="tabActiveKey=='1'">点赞修改: <a-input-number size="small" v-model="item.praise" :min="1" /></a>
              <div style="display:flex;flex:1" v-if="tabActiveKey!='0'">
                <a v-if="tabActiveKey=='1'" @click="editPrise(item)">确认</a>
                <a v-if="tabActiveKey=='1'||tabActiveKey=='2'" @click="deleteVideo(item,index)">删除</a>
              </div>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>

    <a-modal
      :maskClosable="false"
      width="40%"
      title="温馨提示"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-form :form="form">
        <a-row style="width: 100%;">
          <a-col :span="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="拒绝原因">
              <a-input v-decorator="['refuseReason', { rules: [{ required: true, message: '请填写拒绝原因!' }] }]" placeholder="拒绝原因" type="textarea" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import XHR from '../../api/video'
export default {
  name: 'CardList',
  data () {
    return {
      pagination: {
        onChange: page => {
          this.pagination.current = page
          this.getVideoList()
        },
        current: 1,
        pageSize: 12,
        total: 0
      },
      tabList: [
        { key: '0', tab: '未审核' },
        { key: '1', tab: '已审核' },
        { key: '2', tab: '未通过' }
      ],
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      mobilePhone: null,
      model: {},
      form: this.$form.createForm(this),
      tabActiveKey: '0',
      dataSource: []
    }
  },
  created () {
    this.getVideoList()
  },
  methods: {
    // tab切换
    changeTab (key) {
      this.pagination.current = 1
      this.tabActiveKey = key
      this.mobilePhone = null
      this.dataSource = []
      this.getVideoList()
    },
    // 搜索
    searchQuery () {
      this.getVideoList()
    },
    // 获取视频列表
    getVideoList () {
      const json = {
        status: this.tabActiveKey,
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        mobilePhone: this.mobilePhone
      }
      XHR.videoList(json).then(res => {
        const { status, data } = res
        if (status === 0) {
          this.dataSource = data.videoInfoDTOList
          this.pagination.total = data.totalCount
        }
      })
    },
    // 显示弹窗
    showModel (status, item, index) {
      this.model.status = status
      this.model.videoCode = item.videoCode
      this.model.index = index
      this.visible = true
    },
    // 关闭弹窗
    handleCancel (e) {
      this.visible = false
    },
    // 弹窗提交
    handleOk (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = false
          const formData = { ...this.model, ...values }
          XHR.videoVerify(formData).then(res => {
            if (res.status === 0) {
              this.dataSource.splice(this.form.index, 1)
              this.$message.success('审核成功')
               this.visible = false
            } else {
              this.$message.success(res.data)
            }
          })
        }
      })
    },
    // 审核视频
    verifySubmit (status, item, index, refuseReason) {
      const json = {
        videoCode: item.videoCode,
        status,
        refuseReason
      }
      XHR.videoVerify(json).then(res => {
        if (res.status === 0) {
          this.dataSource.splice(index, 1)
          this.$message.success('审核通过')
        } else {
          this.$message.success(res.data)
        }
      })
    },
    // 编辑点赞
    editPrise (item) {
      console.log(item)
      const json = {
        videoCode: item.videoCode,
        count: item.praise
      }
      XHR.videoChangePraise(json).then(res => {
        if (res.status === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.success(res.data)
        }
      })
    },
    // 删除视频
    deleteVideo (item, index) {
       XHR.videoDel({ code: item.videoCode }).then(res => {
        if (res.status === 0) {
          this.$message.success('删除成功')
          this.dataSource.splice(index, 1)
        } else {
          this.$message.success(res.data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";
    /deep/ .ant-card-body {
      padding: 15px;
    }
    .search-wrap{
      margin:0 20px 20px;
      button{
        color: #fff;
        margin-top: 3px;
      }
    }
    .meta-content{
      height: 200px;
      video{
        width: 100%;
        height: 100%;
      }
    }
  /deep/ .ant-card-actions {
    background: #f7f9fa;
    li {
      float: left;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;
      padding:12px 0;
      margin: 0;
      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }
      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
      }
    }
  }

</style>
