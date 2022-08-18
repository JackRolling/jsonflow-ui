import { ToolsType, CommonNodeType, HighNodeType, LaneNodeType } from './type'
import {
  clazzAttr,
  commonAttr,
  endAttr,
  highAttr,
  jobAttr,
  laneAttr,
  linkAttr,
  nodeAttr,
  virtualAttr
} from "./attr-config";
import {deepClone} from "@/utils/common";

export const tools = [
	{
		type: ToolsType.DRAG,
		icon: 'el-icon-rank',
		name: '拖拽'
	},
	{
		type: ToolsType.CONNECTION,
		icon: 'el-icon-share',
		name: '连线'
	},
	{
		type: ToolsType.FLOW,
		icon: 'el-icon-loading',
		name: '设置流程属性'
	}
];

export const commonNodes = [
	{
		type: CommonNodeType.START,
		nodeName: '开始',
		icon: 'video-play',
    attrs: deepClone(commonAttr),
    clazz: deepClone(clazzAttr),
    defJob: deepClone(jobAttr),
    jobSize: 1
	},
	{
		type: CommonNodeType.SERIAL,
		nodeName: '串行节点',
		icon: 'right',
    attrs: deepClone(nodeAttr),
    clazz: deepClone(clazzAttr),
    defJob: deepClone(jobAttr),
    jobSize: 1,
    status: null
	},
	{
		type: CommonNodeType.PARALLEL,
		nodeName: '并行节点',
		icon: 'sort',
    attrs: deepClone(nodeAttr),
    clazz: deepClone(clazzAttr),
    defJob: deepClone(jobAttr),
    jobSize: 1,
    status: null
	},
  {
		type: CommonNodeType.END,
		nodeName: '结束',
		icon: 'remove-outline',
    attrs: deepClone(endAttr),
    clazz: deepClone(clazzAttr),
    defJob: deepClone(jobAttr),
    jobSize: 1
	},
  {
		type: CommonNodeType.LINK,
    label: '连线',
    sourceId: null,
    targetId: null,
    attrs: deepClone(linkAttr)
	}
];

export const highNodes = [
  {
    type: HighNodeType.VIRTUAL,
    nodeName: '虚拟节点',
    icon: 'refresh',
    attrs: deepClone(virtualAttr),
    clazz: deepClone(clazzAttr),
    defJob: deepClone(jobAttr),
    jobSize: 1
  },
  {
    type: HighNodeType.JOB,
    nodeName: '节点任务',
    icon: 's-check',
    defJob: deepClone(jobAttr),
    status: null
  },
  {
		type: HighNodeType.CHILD_FLOW,
		nodeName: '子流程',
		icon: 'set-up',
    attrs: deepClone(highAttr)
	}
];

export const laneNodes = [
	{
		type: LaneNodeType.X_LANE,
		nodeName: '横向泳道',
		icon: 'tickets',
    attrs: deepClone(laneAttr)
	},
	{
		type: LaneNodeType.Y_LANE,
		nodeName: '纵向泳道',
		icon: 'c-scale-to-original',
    attrs: deepClone(laneAttr)
	}
];
