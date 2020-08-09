<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="(key) => {this.tabActiveKey = key}" >
    <a-form layout="inline" class="search-wrap" @keyup.enter.native="searchQuery">
      <a-row :gutter="24">
        <a-form-item label="手机号">
          <a-input placeholder="请输入手机号" style="width:100%"/>
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
      <a-list-item slot="renderItem" slot-scope="index">
        <template >
          <a-card :hoverable="false">
            <a-card-meta>
              <a slot="title">13279511891</a>
              <div class="meta-content" slot="description">
                <video :ref="`video${index}`" controls="controls" width="100%" preload >
                  <source src="https://www.runoob.com/try/demo_source/mov_bbb.mp4" type="video/mp4">
                  <source src="https://www.runoob.com/try/demo_source/mov_bbb.ogg" type="video/ogg">
                  您的浏览器不支持 HTML5 video 标签。
                </video>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a v-if="tabActiveKey=='tab1'" style="color:#ff4d4f" @click="showCencel">拒绝</a>
              <a v-if="tabActiveKey=='tab1'" @click="isOk">通过</a>
              <a v-if="tabActiveKey=='tab2'">点赞修改: <a-input-number size="small" :min="1" :max="100" /></a>
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
              <a-input v-model="form.desc" placeholder="拒绝原因" type="textarea" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>

export default {
  name: 'CardList',
  data () {
    return {
      current: 2,
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 3
      },
      tabList: [
        { key: 'tab1', tab: '未审核' },
        { key: 'tab2', tab: '已审核' }
      ],
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      form: {
        name: ''
      },
      tabActiveKey: 'tab1',
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: []
    }
  },
  created () {
    for (let i = 0; i < 1; i++) {
      this.dataSource.push({
        id: i,
        title: 'Alipay',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
      })
    }
  },
  methods: {
    playVideo (index) {
      const key = 'video' + index
      this.$refs[key].play()
    },
    showCencel () {
      this.visible = true
    },
    onSubmit () {
      console.log('submit!', this.form)
    },
    handleOk (e) {
       this.visible = false
        this.confirmLoading = false
    },
    handleCancel (e) {
      this.visible = false
    },
    isOk () {
      this.$message.success('审核通过', 1)
    },
    searchQuery () {

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
