<template>
  <div>
    <el-drawer class="flow-drawer"
      title="查看数据"
      direction="rtl"
      append-to-body
      :size="600"
      :visible.sync="viewJsonVisible"
      @close="onClose">
      <div style="padding: 24px">
        <div>当前JSON数据:</div>
        <json-view
          :value="flowData"
          :expand-depth=3
          boxed
          copyable/>

        <div style="margin-top: 12px;">暂存数据:</div>
        <el-input type="textarea" minlength="10" v-model="flowDataJson" @change="editFlowDataJson"/>

        <el-divider/>
        <el-button @click="tempSave" :style="{ marginRight: '8px' }">暂存</el-button>
        <el-button @click="onLoad" type="primary">加载JSON数据</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import JsonView from 'vue-json-viewer'
  import {flowConfig} from '@/config/flow-config'

  export default {
    components: {
      JsonView
    },
    data() {
      return {
        viewJsonVisible: false,
        flowData: null,
        flowDataJson: ''
      }
    },
    methods: {
      onClose() {
        this.viewJsonVisible = false;
      },
      // 编辑框
      editFlowDataJson(value) {
        this.flowDataJson = value;
      },
      // 暂存
      tempSave() {
        let tempObj = Object.assign({}, this.flowData);
        tempObj.status = flowConfig.flowStatus.SAVE;
        tempObj.attrs.flowJson = null
        this.flowDataJson = JSON.stringify(tempObj);
      },
      // 加载JSON数据
      onLoad() {
        if (!this.flowDataJson) {
          this.$message.warning("请先暂存")
          return
        }
        this.$emit('loadFlow', this.flowDataJson);
        this.onClose();
      }
    }
  }
</script>

<style>
</style>
