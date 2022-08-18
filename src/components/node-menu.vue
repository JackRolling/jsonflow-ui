<template>
  <el-menu background-color="black">
    <el-menu-item v-for="node in nodeList" :key="node.type" style="padding-top: 4px; padding-left: 14px"
                  v-if="node.type !== CommonNodeType.LINK && node.type !== HighNodeType.CHILD_FLOW">
      <el-tooltip :content="node.nodeName" placement="right">
        <div
          class="node-item"
          draggable="true"
          @dragstart="dragNode(node.type, type)"
        >
          <el-icon :name="node.icon" style="color: white;"/>
        </div>
      </el-tooltip>
    </el-menu-item>
  </el-menu>
</template>
<script>
  import {CommonNodeType, HighNodeType} from '@/config/type'

  export default {
    name: "NodeMenu",
    props: {
      nodeList: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        CommonNodeType: CommonNodeType,
        HighNodeType: HighNodeType
      }
    },
    methods: {
      // 开始拖拽
      dragNode(type, belongTo) {
        this.$emit("setDragInfo", {
          type,
          belongTo
        });
      }
    }
  };
</script>
<style scoped lang="less">
  /*菜单间距*/
  .el-menu-item, .el-submenu__title{
    height: 40px;
  }

  /*菜单边缘对齐*/
  .el-menu{
    border-right: 0;
  }
</style>
