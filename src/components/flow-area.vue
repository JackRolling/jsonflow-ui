<template>
  <div
    style="width: 100%; height: 100%; overflow: hidden; position: relative;"
    @dragover="allowDrop"
    @drop="drop"
  >
    <!--辅助线X-->
    <div v-if="container.auxiliaryLine.isOpen && container.auxiliaryLine.isShowXLine"
      class="auxiliary-line-x"
      :style="{ top: auxiliaryLinePos.y + 'px' }"
    ></div>
    <!--辅助线Y-->
    <div v-if="container.auxiliaryLine.isOpen && container.auxiliaryLine.isShowYLine"
      class="auxiliary-line-y"
      :style="{ left: auxiliaryLinePos.x + 'px' }"
    ></div>
    <div
      id="flowContainer"
      class="flow-container"
      :class="{
        grid: gridConfig.showGrid,
        zoomIn: currentTool.type === 'el-icon-zoom-in',
        zoomOut: currentTool.type === 'el-icon-zoom-out',
        canScale: container.scaleFlag,
        canDrag: container.dragFlag,
        canMultiple: rectangleMultiple.flag
      }"
      :style="gridStyle"
      @click.stop="containerHandler"
      @mousedown="mousedownHandler"
      @mousemove="mousemoveHandler"
      @mouseup="mouseupHandler"
      @mousewheel="scaleContainer"
      @DOMMouseScroll="scaleContainer"
      @contextmenu="showContainerContextMenu"
      @dblclick.stop="dbClickflowContainer"
    >
      <flow-node
        v-for="node in flowData.nodeList"
        :key="node.id"
        :node="node"
        :plumb="plumb"
        :select.sync="currentSelect"
        :selectGroup.sync="currentSelectGroup"
        :currentTool="currentTool"
        @showNodeContextMenu="showNodeContextMenu"
        :rectangleMultiple="rectangleMultiple"
        @updateNodePos="updateNodePos"
        @alignForLine="alignForLine"
        @hideAlignLine="hideAlignLine"
        @dbClickNode="dbClickNode"
      >
      </flow-node>
      <div
        class="rectangle-multiple"
        v-if="rectangleMultiple.flag && rectangleMultiple.multipling"
        :style="{
          top: rectangleMultiple.position.top + 'px',
          left: rectangleMultiple.position.left + 'px',
          width: rectangleMultiple.width + 'px',
          height: rectangleMultiple.height + 'px'
        }"
      ></div>
    </div>
    <div class="container-scale">
      <el-button icon="el-icon-zoom-in" circle size="small" type="default" @click="enlargeContainer"></el-button>
      <span>{{ container.scaleShow }}% </span>
      <el-button icon="el-icon-zoom-out" circle size="small" type="default" @click="narrowContainer"></el-button>
    </div>
    <div class="mouse-position">
      x: {{ mouse.position.x }}, y: {{ mouse.position.y }}
    </div>
    <vue-context-menu
      :contextMenuData="containerContextMenuData"
      @flowInfo="flowInfo"
      @paste="paste"
      @selectAll="selectAll"
      @publishFlow="publishFlow"
      @verticaLeft="verticaLeft"
      @verticalCenter="verticalCenter"
      @verticalRight="verticalRight"
      @levelUp="levelUp"
      @levelCenter="levelCenter"
      @levelDown="levelDown"
    >
    </vue-context-menu>
    <vue-context-menu
      :contextMenuData="nodeContextMenuData"
      @setNodeAttr="dbClickNode"
      @copyNode="copyNode"
      @deleteNode="deleteNode"
    >
    </vue-context-menu>
  </div>
</template>

<script>
  import {flowConfig} from "@/config/flow-config";
  import {deepClone, utils} from "@/utils/common";
  import FlowNode from "./flow-node";
  import { CommonNodeType, HighNodeType, LaneNodeType, ToolsType } from '@/config/type';

  export default {
    props: [
      "browserType",
      "flowData",
      "plumb",
      "select",
      "selectGroup",
      "currentTool",
      "dragInfo",
      "gridConfig"
    ],
    components: {
      FlowNode
    },
    data() {
      return {
        currentSelect: this.select,
        currentSelectGroup: this.selectGroup,
        container: {
          pos: {
            top: 0,
            left: 0
          },
          dragFlag: false,
          draging: false,
          scale: flowConfig.defaultStyle.containerScale.init,
          scaleFlag: false,
          scaleOrigin: {
            x: 0,
            y: 0
          },
          scaleShow: utils.mul(flowConfig.defaultStyle.containerScale.init, 100),
          // 辅助线
          auxiliaryLine: {
            isOpen: flowConfig.defaultStyle.isOpenAuxiliaryLine,
            isShowXLine: false,
            isShowYLine: false,
            controlFnTimesFlag: true
          }
        },
        // 辅助线位置
        auxiliaryLinePos: {
          x: 0,
          y: 0
        },
        mouse: {
          position: {
            x: 0,
            y: 0
          },
          // 鼠标点击起始位置
          tempPos: {
            x: 0,
            y: 0
          }
        },
        // 鼠标划框多选
        rectangleMultiple: {
          flag: false, // 是否按了ctrl键
          multipling: false,
          position: {
            top: 0,
            left: 0
          },
          height: 0,
          width: 0
        },
        containerContextMenuData: flowConfig.contextMenu.container,
        nodeContextMenuData: flowConfig.contextMenu.node,
        // 当前聚焦的连接线ID
        tempLinkId: "",
        // 剪切板内容
        clipboard: []
      };
    },
    computed: {
      gridStyle() {
        return {
          top: `${this.container.pos.top}px`,
          left: `${this.container.pos.left}px`,
          transform: `scale(${this.container.scale})`,
          transformOrigin: `${this.container.scaleOrigin.x}px ${this.container.scaleOrigin.y}px`
        };
      }
    },
    methods: {
      allowDrop(e) {
        e.preventDefault();
        this.mousemoveHandler(e);
      },
      drop() {
        let belongTo = this.dragInfo.belongTo;
        let type = this.dragInfo.type;

        // 复位拖拽工具
        this.$emit("selectTool", ToolsType.DRAG);

        this.$emit("findNodeConfig", belongTo, type, node => {
          if (!node) {
            this.$message.error("未知的节点类型");
            return;
          }
          // 增加节点
          this.addNewNode(node);
        });
      },
      // 画布鼠标按下
      mousedownHandler(e) {
        let event = window.event || e;

        if (event.button === 0) {
          if (this.container.dragFlag) {
            this.mouse.tempPos = this.mouse.position;
            this.container.draging = true;
          }

          this.currentSelectGroup = [];
          if (this.rectangleMultiple.flag) {
            this.mouse.tempPos = this.mouse.position;
            this.rectangleMultiple.multipling = true;
          }
        }
      },
      // 画布鼠标移动
      mousemoveHandler(e) {
        let event = window.event || e;

        if (event.target.id === "flowContainer") {
          this.mouse.position = {
            x: event.offsetX,
            y: event.offsetY
          };
        } else {
          let cn = event.target.className;
          let tn = event.target.tagName;
          if (
            cn !== "lane-text" &&
            cn !== "lane-text-div" &&
            tn !== "svg" &&
            tn !== "path" &&
            tn !== "I"
          ) {
            this.mouse.position.x = event.target.offsetLeft + event.offsetX;
            this.mouse.position.y = event.target.offsetTop + event.offsetY;
          }
        }
        if (this.container.draging) {
          let nTop =
            this.container.pos.top +
            (this.mouse.position.y - this.mouse.tempPos.y);
          let nLeft =
            this.container.pos.left +
            (this.mouse.position.x - this.mouse.tempPos.x);
          if (nTop >= 0) nTop = 0;
          if (nLeft >= 0) nLeft = 0;
          this.container.pos = {
            top: nTop,
            left: nLeft
          };
        }
        if (this.rectangleMultiple.multipling) {
          let h = this.mouse.position.y - this.mouse.tempPos.y;
          let w = this.mouse.position.x - this.mouse.tempPos.x;
          let t = this.mouse.tempPos.y;
          let l = this.mouse.tempPos.x;
          if (h >= 0 && w < 0) {
            w = -w;
            l -= w;
          } else if (h < 0 && w >= 0) {
            h = -h;
            t -= h;
          } else if (h < 0 && w < 0) {
            h = -h;
            w = -w;
            t -= h;
            l -= w;
          }
          this.rectangleMultiple.height = h;
          this.rectangleMultiple.width = w;
          this.rectangleMultiple.position.top = t;
          this.rectangleMultiple.position.left = l;
        }
      },
      // 画布鼠标点击松开
      mouseupHandler() {
        if (this.container.draging) this.container.draging = false;
        if (this.rectangleMultiple.multipling) {
          // 鼠标划框内的节点
          this.judgeSelectedNode();
          this.rectangleMultiple.multipling = false;
          this.rectangleMultiple.width = 0;
          this.rectangleMultiple.height = 0;
        }
      },
      // 鼠标划框内的节点
      judgeSelectedNode() {
        let ay = this.rectangleMultiple.position.top;
        let ax = this.rectangleMultiple.position.left;
        let by = ay + this.rectangleMultiple.height;
        let bx = ax + this.rectangleMultiple.width;

        let nodeList = this.flowData.nodeList;
        nodeList.forEach(node => {
          if (node.y >= ay && node.x >= ax && node.y <= by && node.x <= bx) {
            this.plumb.addToDragSelection(node.id);
            this.currentSelectGroup.push(node);
          }
        });
      },
      // 画布鼠标滚轴
      scaleContainer(e) {
        let event = window.event || e;

        if (this.container.scaleFlag) {
          if (this.browserType === 2) {
            if (event.detail < 0) {
              this.enlargeContainer();
            } else {
              this.narrowContainer();
            }
          } else {
            if (event.deltaY < 0) {
              this.enlargeContainer();
            } else if (this.container.scale) {
              this.narrowContainer();
            }
          }
        }
      },
      // 画布放大
      enlargeContainer() {
        this.container.scaleOrigin.x = this.mouse.position.x;
        this.container.scaleOrigin.y = this.mouse.position.y;
        let newScale = utils.add(
          this.container.scale,
          flowConfig.defaultStyle.containerScale.onceEnlarge
        );
        if (newScale <= flowConfig.defaultStyle.containerScale.max) {
          this.container.scale = newScale;
          this.container.scaleShow = utils.mul(this.container.scale, 100);
          this.plumb.setZoom(this.container.scale);
        }
      },
      // 画布缩小
      narrowContainer() {
        this.container.scaleOrigin.x = this.mouse.position.x;
        this.container.scaleOrigin.y = this.mouse.position.y;
        let newScale = utils.sub(
          this.container.scale,
          flowConfig.defaultStyle.containerScale.onceNarrow
        );
        if (newScale >= flowConfig.defaultStyle.containerScale.min) {
          this.container.scale = newScale;
          this.container.scaleShow = utils.mul(this.container.scale, 100);
          this.plumb.setZoom(this.container.scale);
        }
      },
      // 画布右健
      showContainerContextMenu(e) {
        let event = window.event || e;

        event.preventDefault();
        document.querySelector(".vue-contextmenuName-node-menu").style.display =
          "none";
        document.querySelector(".vue-contextmenuName-link-menu").style.display =
          "none";
        this.selectContainer();
        let x = event.clientX;
        let y = event.clientY;
        this.containerContextMenuData.axis = {x, y};
      },
      // 节点右键
      showNodeContextMenu(e) {
        let event = window.event || e;

        event.preventDefault();
        document.querySelector(".vue-contextmenuName-flow-menu").style.display =
          "none";
        document.querySelector(".vue-contextmenuName-link-menu").style.display =
          "none";
        let x = event.clientX;
        let y = event.clientY;
        this.nodeContextMenuData.axis = {x, y};
      },
      // 流程图信息
      flowInfo() {
        let nodeList = this.flowData.nodeList;
        let linkList = this.flowData.linkList;
        this.$message.info(
          "当前流程图中有 " +
          nodeList.length +
          " 个节点，有 " +
          linkList.length +
          " 条连线。"
        );
      },
      // 粘贴
      paste() {
        let dis = 0;
        this.clipboard.forEach(node => {
          let newNode = Object.assign({}, node);
          newNode.id = utils.getId();
          let nodePos = this.computeNodePos(
            this.mouse.position.x + dis,
            this.mouse.position.y + dis
          );
          newNode.x = nodePos.x;
          newNode.y = nodePos.y;
          dis += 20;
          this.flowData.nodeList.push(newNode);
        });
      },
      // 全选
      selectAll() {
        this.flowData.nodeList.forEach(node => {
          this.plumb.addToDragSelection(node.id);
          this.currentSelectGroup.push(node);
        });
      },
      // 发布流程
      publishFlow() {
        this.$emit("publishFlow");
      },
      // 节点排列前校验节点数量
      checkAlign() {
        if (this.currentSelectGroup.length < 2) {
          this.$message.error("请选择至少两个节点");
          return false;
        }
        return true;
      },
      // 垂直左对齐
      verticaLeft() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        for (let i = 1; i < selectGroup.length; i++) {
          baseY =
            baseY +
            selectGroup[i - 1].height +
            flowConfig.defaultStyle.alignSpacing.vertical;
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 垂直居中
      verticalCenter() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        let firstX = baseX;
        for (let i = 1; i < selectGroup.length; i++) {
          baseY =
            baseY +
            selectGroup[i - 1].height +
            flowConfig.defaultStyle.alignSpacing.vertical;
          baseX =
            firstX +
            utils.div(selectGroup[0].width, 2) -
            utils.div(selectGroup[i].width, 2);
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 垂直右对齐
      verticalRight() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        let firstX = baseX;
        for (let i = 1; i < selectGroup.length; i++) {
          baseY =
            baseY +
            selectGroup[i - 1].height +
            flowConfig.defaultStyle.alignSpacing.vertical;
          baseX = firstX + selectGroup[0].width - selectGroup[i].width;
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 水平上对齐
      levelUp() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        for (let i = 1; i < selectGroup.length; i++) {
          baseX =
            baseX +
            selectGroup[i - 1].width +
            flowConfig.defaultStyle.alignSpacing.level;
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 水平居中
      levelCenter() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        let firstY = baseY;
        for (let i = 1; i < selectGroup.length; i++) {
          baseY =
            firstY +
            utils.div(selectGroup[0].height, 2) -
            utils.div(selectGroup[i].height, 2);
          baseX =
            baseX +
            selectGroup[i - 1].width +
            flowConfig.defaultStyle.alignSpacing.level;
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 水平下对齐
      levelDown() {
        if (!this.checkAlign()) return;
        let nodeList = this.flowData.nodeList;
        let selectGroup = this.currentSelectGroup;
        let baseX = selectGroup[0].x;
        let baseY = selectGroup[0].y;
        let firstY = baseY;
        for (let i = 1; i < selectGroup.length; i++) {
          baseY = firstY + selectGroup[0].height - selectGroup[i].height;
          baseX =
            baseX +
            selectGroup[i - 1].width +
            flowConfig.defaultStyle.alignSpacing.level;
          let f = nodeList.filter(n => n.id === selectGroup[i].id)[0];
          f.tx = baseX;
          f.ty = baseY;
          this.plumb.animate(
            selectGroup[i].id,
            {top: baseY, left: baseX},
            {
              duration: flowConfig.defaultStyle.alignDuration,
              complete: function () {
                f.x = f.tx;
                f.y = f.ty;
              }
            }
          );
        }
      },
      // 复制节点
      copyNode() {
        this.clipboard = [];
        if (this.currentSelectGroup.length > 0) {
          this.clipboard = Object.assign([],deepClone(this.currentSelectGroup));
        } else if (this.currentSelect.id) {
          this.clipboard.push(deepClone(this.currentSelect));
        }
      },
      // 查询删除节点关联的连接线
      getConnectionsByNodeId(nodeId) {
        let conns1 = this.plumb.getConnections({
          source: nodeId
        });
        let conns2 = this.plumb.getConnections({
          target: nodeId
        });
        return conns1.concat(conns2);
      },
      // 删除节点
      deleteNode() {
        let nodeList = this.flowData.nodeList;
        let linkList = this.flowData.linkList;
        let arr = [];

        arr.push(Object.assign({}, this.currentSelect));

        this.flowData.status = flowConfig.flowStatus.LOADING;

        arr.forEach(c => {
          let conns = this.getConnectionsByNodeId(c.id);
          conns.forEach(conn => {
            linkList.splice(
              linkList.findIndex(
                link => link.sourceId === conn.sourceId && link.targetId === conn.targetId
              ),
              1
            );
            this.plumb.deleteConnection(
              this.plumb.getConnections({
                source: conn.sourceId,
                target: conn.targetId
              })[0]
            );
            // 减小节点任务数
            this.$emit('upOrDownNodeJobs',conn.sourceId, conn.targetId, false)
          });
          let inx = nodeList.findIndex(node => node.id === c.id);
          nodeList.splice(inx, 1);
        });
        this.flowData.status = flowConfig.flowStatus.CREATE;
        this.selectContainer();
      },
      // 增加画布节点
      addNewNode(node) {
        let x = this.mouse.position.x;
        let y = this.mouse.position.y;
        let nodePos = this.computeNodePos(x, y);
        x = nodePos.x;
        y = nodePos.y;

        let newNode = Object.assign({}, node);
        newNode.id = utils.getId();
        newNode.height = 50;
        if (
          newNode.type === CommonNodeType.START ||
          newNode.type === CommonNodeType.END
        ) {
          newNode.x = x - 25;
          newNode.width = 50;
        } else {
          newNode.x = x - 60;
          newNode.width = 120;
        }
        newNode.y = y - 25;
        if (newNode.type === LaneNodeType.X_LANE) {
          newNode.height = 200;
          newNode.width = 500;
        } else if (newNode.type === LaneNodeType.Y_LANE) {
          newNode.height = 500;
          newNode.width = 200;
        }
        this.flowData.nodeList.push(newNode);
      },
      // x, y取整计算
      computeNodePos(x, y) {
        const pxx = flowConfig.defaultStyle.alignGridPX[0];
        const pxy = flowConfig.defaultStyle.alignGridPX[1];
        if (x % pxx) x = pxx - (x % pxx) + x;
        if (y % pxy) y = pxy - (y % pxy) + y;
        return {
          x: x,
          y: y
        };
      },
      // 点击画布
      containerHandler() {
        this.selectContainer();
      },
      // 双击画布
      dbClickflowContainer() {
        if (this.currentTool.type !== ToolsType.DRAG) {
          this.$emit("selectTool", ToolsType.DRAG);
        } else {
          this.$emit("selectTool", ToolsType.CONNECTION);
        }
      },
      // 清除面布
      selectContainer() {
        this.currentSelect = {};
        // 开启快捷键
        this.$emit("getShortcut");
      },
      // 双击节点
      dbClickNode() {
        if (this.rectangleMultiple.flag === false) {
          let attrConfigVisible = Object.keys(this.currentSelect).length !== 0
          if (attrConfigVisible) this.$emit("showAttrConfig", true);
        }
      },
      // 更新组节点信息
      updateNodePos() {
        let nodeList = this.flowData.nodeList;
        this.currentSelectGroup.forEach(node => {
          let element = document.getElementById(node.id);
          let l = parseInt(element.style.left);
          let t = parseInt(element.style.top);
          let f = nodeList.filter(n => n.id === node.id)[0];
          f.x = l;
          f.y = t;
        });
      },
      // 计算辅助线
      alignForLine(e) {
        if (this.selectGroup.length > 1) return;
        if (this.container.auxiliaryLine.controlFnTimesFlag) {
          let elId = e.el.id;
          let nodeList = this.flowData.nodeList;
          nodeList.forEach(node => {
            if (elId !== node.id) {
              let dis = flowConfig.defaultStyle.showAuxiliaryLineDistance,
                elPos = e.pos,
                elH = e.el.offsetHeight,
                elW = e.el.offsetWidth,
                disX = elPos[0] - node.x,
                disY = elPos[1] - node.y;
              if (
                (disX >= -dis && disX <= dis) ||
                (disX + elW >= -dis && disX + elW <= dis)
              ) {
                this.container.auxiliaryLine.isShowYLine = true;
                this.auxiliaryLinePos.x = node.x + this.container.pos.left;
                let nodeMidPointX = node.x + node.width / 2;
                if (nodeMidPointX === elPos[0] + elW / 2) {
                  this.auxiliaryLinePos.x =
                    nodeMidPointX + this.container.pos.left;
                }
              }
              if (
                (disY >= -dis && disY <= dis) ||
                (disY + elH >= -dis && disY + elH <= dis)
              ) {
                this.container.auxiliaryLine.isShowXLine = true;
                this.auxiliaryLinePos.y = node.y + this.container.pos.top;
                let nodeMidPointY = node.y + node.height / 2;
                if (nodeMidPointY === elPos[1] + elH / 2) {
                  this.auxiliaryLinePos.y =
                    nodeMidPointY + this.container.pos.left;
                }
              }
            }
          });
          this.container.auxiliaryLine.controlFnTimesFlag = false;
          setTimeout(() => {
            this.container.auxiliaryLine.controlFnTimesFlag = true;
          }, 200);
        }
      },
      // 隐藏辅助线
      hideAlignLine() {
        if (this.container.auxiliaryLine.isOpen) {
          this.container.auxiliaryLine.isShowXLine = false;
          this.container.auxiliaryLine.isShowYLine = false;
        }
      }
    },
    watch: {
      select(val) {
        this.currentSelect = val;
        // 清除连接线焦点
        if (this.tempLinkId !== "") {
          let element = document.getElementById(this.tempLinkId);
          if (element) {// jsplumb会自动删除svg
            element.classList.remove("link-active");
          }
          this.tempLinkId = "";
        }
        // 设置连接线焦点
        if (this.currentSelect.type === CommonNodeType.LINK) {
          this.tempLinkId = this.currentSelect.id;
          document.getElementById(this.currentSelect.id)
            .classList.add("link-active");
        }
      },
      currentSelect: {
        handler(val) {
          this.$emit("update:select", val);
        },
        deep: true
      },
      selectGroup(val) {
        this.currentSelectGroup = val;
        if (this.currentSelectGroup.length <= 0) this.plumb.clearDragSelection();
      },
      currentSelectGroup: {
        handler(val) {
          this.$emit("update:selectGroup", val);
        },
        deep: true
      }
    }
  };
</script>

<style lang="less">
  @import "../assets/style/flow-area.less";
</style>
