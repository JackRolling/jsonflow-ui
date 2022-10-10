<template>
  <div v-if="node.type === CommonNodeType.START || node.type === CommonNodeType.END"
       :id="node.id"
       class="common-circle-node"
       :class="{
         active: isActive(),
         isStart: node.type === CommonNodeType.START,
         isEnd: node.type === CommonNodeType.END
       }"
       :style="{
         top: node.y + 'px',
         left: node.x + 'px',
         cursor: setCursor(currentTool.type)
       }"
       @click.stop="selectNode"
       @dblclick.stop="dbClickNode"
       @contextmenu.stop="showNodeContextMenu">
    {{ node.nodeName }}
  </div>

  <div v-else-if="node.type === CommonNodeType.SERIAL || node.type === CommonNodeType.PARALLEL || node.type === HighNodeType.VIRTUAL
        || node.type === HighNodeType.CHILD_FLOW"
       :id="node.id"
       class="common-rectangle-node"
       :class="{ active: isActive() }"
       :style="{
         top: node.y + 'px',
         left: node.x + 'px',
         cursor: setCursor(currentTool.type)
       }"
       @click.stop="selectNode"
       @dblclick.stop="dbClickNode"
       @contextmenu.stop="showNodeContextMenu">
    <el-icon :name="setIcon(node)" class="node-icon"/>
    {{ node.nodeName }} {{node.jobSize ? '(' + node.jobSize + ')' : ''}}
  </div>

  <div v-else-if="node.type === HighNodeType.JOB"
       :id="node.id"
       class="common-job-node"
       :class="{ active: isActive() }"
       :style="{
         top: node.y + 'px',
         left: node.x + 'px',
         cursor: setCursor(currentTool.type)
       }"
       @click.stop="selectNode"
       @dblclick.stop="dbClickNode"
       @contextmenu.stop="showNodeContextMenu">
    <el-icon :name="setIcon(node)" class="node-icon"/>
    {{ node.nodeName }}
  </div>

  <div v-else-if="node.type === LaneNodeType.X_LANE"
       :id="node.id"
       class="common-x-lane-node"
       :class="{ active: isActive() }"
       :style="{
         top: node.y + 'px',
         left: node.x + 'px',
         height: node.height + 'px',
         width: node.width + 'px',
       }">
    <div class="lane-text-div"
         :style="{cursor: setCursor(currentTool.type)}"
         @click.stop="selectNode"
         @dblclick.stop="dbClickNode"
         @contextmenu.stop="showNodeContextMenu">
      <span class="lane-text">{{ node.nodeName }}</span>
    </div>
  </div>

  <div v-else-if="node.type === LaneNodeType.Y_LANE"
       :id="node.id"
       class="common-y-lane-node"
       :class="{ active: isActive() }"
       :style="{
         top: node.y + 'px',
         left: node.x + 'px',
         height: node.height + 'px',
         width: node.width + 'px',
       }">
    <div class="lane-text-div"
         :style="{cursor: setCursor(currentTool.type)}"
         @click.stop="selectNode"
         @dblclick.stop="dbClickNode"
         @contextmenu.stop="showNodeContextMenu">
      <span class="lane-text">{{ node.nodeName }}</span>
    </div>
  </div>

  <div v-else></div>
</template>

<script>
  import {Resizable} from 'resizable-dom'
  import {flowConfig} from '@/config/flow-config'
  import {CommonNodeType, HighNodeType, LaneNodeType, ToolsType} from '@/config/type';

  export default {
    props: ['select', 'selectGroup', 'node', 'plumb', 'currentTool' ,'rectangleMultiple'],
    mounted() {
      this.registerNode()
    },
    data() {
      return {
        currentSelect: this.select,
        currentSelectGroup: this.selectGroup,
        CommonNodeType: CommonNodeType,
        HighNodeType: HighNodeType,
        LaneNodeType: LaneNodeType
      }
    },
    methods: {
      // 设置ICON
      setIcon(node) {
        switch (node.type) {
          case CommonNodeType.SERIAL:
            return this.getIconByStatus(node)
          case CommonNodeType.PARALLEL:
            return this.getIconByStatus(node)
          case HighNodeType.VIRTUAL:
            return 'refresh'
          case HighNodeType.JOB:
            return this.getIconByStatus(node)
          case HighNodeType.CHILD_FLOW:
            return 'set-up'
          default:
            return 'tool'
        }
      },
      getIconByStatus(node) {
        if (node.status === '0') return 'loading'
        if (node.status === '1') return 'circle-check'
        if (HighNodeType.JOB === node.type) return 's-check'
        return 'user'
      },
      // 设置鼠标样式
      setCursor(type) {
        switch (type) {
          case ToolsType.DRAG:
            return 'move'
          case ToolsType.CONNECTION:
            return 'crosshair'
          default:
            return 'default'
        }
      },
      // 初始节点拖拽
      registerNode() {
        this.plumb.draggable(this.node.id, {
          containment: 'parent',
          handle: (e, el) => {
            // 判断节点类型
            let possibles = el.parentNode.querySelectorAll('.common-circle-node,.common-rectangle-node,.common-job-node,.lane-text-div')
            for (let i = 0; i < possibles.length; i++) {
              if (possibles[i] === el || e.target.className === 'lane-text') return true
            }
            return false
          },
          grid: flowConfig.defaultStyle.alignGridPX,
          drag: e => {
            if (flowConfig.defaultStyle.isOpenAuxiliaryLine) {
              this.$emit('alignForLine', e)
            }
          },
          stop: e => {
            this.node.x = e.pos[0]
            this.node.y = e.pos[1]
            // 是否为组
            if (this.currentSelectGroup.length > 1) {
              // 更新组节点信息
              this.$emit('updateNodePos')
            }
            // 隐藏辅助线
            this.$emit('hideAlignLine')
          }
        })

        if (this.node.type === LaneNodeType.X_LANE || this.node.type === LaneNodeType.Y_LANE) {
          let node = document.getElementById(this.node.id)
          new Resizable(node, {
            handles: ['e', 'w', 'n', 's', 'nw', 'ne', 'sw', 'se'],
            initSize: {
              maxWidth: 1000,
              maxHeight: 1000,
              minWidth: 200,
              minHeight: 200
            }
          }, () => {
            this.node.height = Math.ceil(parseInt(node.style.height))
            this.node.width = Math.ceil(parseInt(node.style.width))
          })
        }
        this.currentSelect = this.node
        this.currentSelectGroup = []
      },
      dbClickNode(){
        this.$emit("dbClickNode")
      },
      // 点击节点
      selectNode() {
        this.currentSelect = this.node
        // 是否为多选行为
        if (!this.rectangleMultiple.flag) {
          this.currentSelectGroup = []
        } else {
          let f = this.currentSelectGroup.filter(s => s.id === this.node.id)
          if (f.length <= 0) {
            this.plumb.addToDragSelection(this.node.id)
            this.currentSelectGroup.push(this.node)
          }
        }
      },
      // 节点右键
      showNodeContextMenu(e) {
        this.$emit('showNodeContextMenu', e)
        this.selectNode()
      },
      // 节点是否激活
      isActive() {
        if (this.currentSelect.id === this.node.id) return true
        let f = this.currentSelectGroup.filter(n => n.id === this.node.id)
        if (f.length > 0) return true
        return false
      }
    },
    watch: {
      select(val) {
        this.currentSelect = val
      },
      currentSelect: {
        handler(val) {
          this.$emit('update:select', val)
        },
        deep: true
      },
      selectGroup(val) {
        this.currentSelectGroup = val
      },
      currentSelectGroup: {
        handler(val) {
          this.$emit('update:selectGroup', val)
        },
        deep: true
      }
    }
  }
</script>

<style lang="less">
  @import '../assets/style/flow-node.less';
</style>
