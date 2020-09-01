<template>
  <a-form :form="form">
    <a-row style="width: 100%;margin:20px">
      <a-col :span="24" v-for="(item,index) in mapList" :key="index" class="map-list">
        <a-input-group compact>
          <a-input style="width: 140px" v-model="item.name" placeholder="请填写城市名" />
          <a-input style="width: 140px" v-model="item.longitude" placeholder="请填写经度" />
          <a-input style="width: 140px" v-model="item.latitude" placeholder="请填写纬度" />
          <a-radio-group v-model="item.status" class="radio">
            <a-radio :value="1">点亮</a-radio>
            <a-radio :value="0">不点亮</a-radio>
          </a-radio-group>
          <a-icon
            v-if="mapList.length>1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            @click="removeMap(item,index)"
          />
        </a-input-group>
      </a-col>
      <a-col :span="24" class="submit-group">
        <a-button type="primary" style="width: 140px;color:#fff" @click="addMap">
          <a-icon type="plus" /> 添加
        </a-button>
        <a-button type="primary" style="width: 140px;color:#fff" @click="submitMap">提交</a-button>
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
      mapList: [],
      delList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.mapLists()
  },
  methods: {
    addMap () {
      this.mapList.push({
        iconPath: 'https://www.wingstechnology.cn/mpimage/newImages/light-up.png',
        latitude: null,
        longitude: null,
        name: '',
        width: 20,
        height: 20,
        status: 1,
        id: 0
      })
    },
    submitMap () {
      const lightMapInfoVOList = this.mapList.filter(item => item.name !== '' && item.latitude && item.longitude)
      const json = {
        lightMapInfoVOList: lightMapInfoVOList,
        delList: this.delList
      }
      XHR.mapModify(json).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.success(res.data)
        }
      })
    },
    removeMap (item, index) {
      this.mapList.splice(index, 1)
      if (item.id) {
        this.delList = [...this.delList, [...item.id]]
      }
    },
    onChange () {

    },
    // 删除视频
    mapLists (item, index) {
       XHR.mapList().then(res => {
        if (res.status === 0) {
          this.mapList = res.data
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

</style>
