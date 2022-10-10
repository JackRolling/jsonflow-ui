<template>
  <div>
    <el-drawer
      class="flow-drawer"
      title="设置"
      direction="rtl"
      append-to-body
      :size="600"
      :visible.sync="settingVisible"
      style="z-index: 1001"
      @close="close">

      <el-form class="flow-drawer-form"
        :model="settingForm"
        label-position="right">

        <el-divider content-position="left">画布</el-divider>
        <el-form-item label="缩小比例">
          <el-slider
            :min="0.05"
            :max="0.5"
            :step="0.05"
            :format-tooltip="formatterContainerOnceNarrow"
            v-model="containerOnceNarrow"
            @change="setContainerOnceNarrow"/>
        </el-form-item>
        <el-form-item label="放大比例">
          <el-slider
            :min="0.05"
            :max="0.5"
            :step="0.05"
            :format-tooltip="formatterContainerOnceEnlarge"
            v-model="containerOnceEnlarge"
            @change="setContainerOnceEnlarge"/>
        </el-form-item>

        <el-divider content-position="left">连线</el-divider>
        <el-form-item label="类型">
          <el-select v-model="linkType"
                     @change="setFlowType">
            <el-option value="Bezier">贝塞尔曲线</el-option>
            <el-option value="Straight">直线</el-option>
            <el-option value="Flowchart">流程图线</el-option>
            <el-option value="StateMachine">状态线</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="linkColor" @change="setLinkColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="粗细">
          <el-slider
            :min="1"
            :max="10"
            v-model="linkThickness"
            @change="setStrokeWidth"/>
        </el-form-item>

        <el-divider content-position="left">默认样式</el-divider>
        <el-form-item label="辅助线">
          <el-switch
            v-model="isOpenAuxiliaryLine"
            active-value="开"
            inactive-value="关"
            @change='toggleOpenAuxiliaryLine'/>
        </el-form-item>
        <el-form-item label="自动对齐水平间距">
          <el-slider
            :min="10"
            :max="800"
            :step="5"
            v-model="alignLevelDistance"
            @change="setAlignLevelDistance"/>
        </el-form-item>
        <el-form-item label="自动对齐垂直间距">
          <el-slider
            :min="10"
            :max="800"
            :step="5"
            v-model="alignVerticalDistance"
            @change="setAlignVerticalDistance"/>
        </el-form-item>
        <el-form-item label="微移距离">
          <el-slider
            :min="1"
            v-model="movePx"
            @change="setMovePx"/>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
  import {flowConfig} from '@/config/flow-config'

  export default {
    data() {
      return {
        settingVisible: false,
        settingForm: {},
        isOpenAuxiliaryLine: flowConfig.defaultStyle.isOpenAuxiliaryLine,
        linkColor: flowConfig.jsPlumbInsConfig.PaintStyle.stroke,

        movePx: flowConfig.defaultStyle.movePx,
        linkType: flowConfig.jsPlumbInsConfig.Connector[0],
        linkThickness: flowConfig.jsPlumbInsConfig.PaintStyle.strokeWidth,
        alignLevelDistance: flowConfig.defaultStyle.alignSpacing.level,
        alignVerticalDistance: flowConfig.defaultStyle.alignSpacing.vertical,
        containerOnceNarrow: flowConfig.defaultStyle.containerScale.onceNarrow,
        containerOnceEnlarge: flowConfig.defaultStyle.containerScale.onceEnlarge
      }
    },
    methods: {
      open() {
        this.settingVisible = true
      },
      close() {
        this.settingVisible = false
      },
      setFlowType(v) {
        flowConfig.jsPlumbInsConfig.Connector[0] = v
      },
      toggleOpenAuxiliaryLine(flag) {
        this.isOpenAuxiliaryLine = flag
        flowConfig.defaultStyle.isOpenAuxiliaryLine = flag
      },
      setMovePx(v) {
        flowConfig.defaultStyle.movePx = v
      },
      setLinkColor(v) {
        this.linkColor = v
        flowConfig.jsPlumbInsConfig.PaintStyle.stroke = v
      },
      setStrokeWidth(v) {
        flowConfig.jsPlumbInsConfig.PaintStyle.strokeWidth = v
      },
      setAlignLevelDistance(v) {
        flowConfig.defaultStyle.alignSpacing.level = v
      },
      setAlignVerticalDistance(v) {
        flowConfig.defaultStyle.alignSpacing.vertical = v
      },
      formatterContainerOnceNarrow(v) {
        return `${v * 100}%`
      },
      setContainerOnceNarrow(v) {
        flowConfig.defaultStyle.containerScale.onceNarrow = v
      },
      formatterContainerOnceEnlarge(v) {
        return `${v * 100}%`
      },
      setContainerOnceEnlarge(v) {
        flowConfig.defaultStyle.containerScale.onceEnlarge = v
      }
    }
  }
</script>

<style scoped lang="less">

.flow-drawer-form {
  /*属性面板*/
  .el-form-item {
    margin: 0 40px 10px!important;
  }
  /deep/ .el-form-item .el-form-item__content{
    margin-left: 150px!important;
  }
}

</style>
