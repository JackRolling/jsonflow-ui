import {deepClone} from "@/utils/common";

export const clazzAttr = {
  clazz: null,
  methods: null,
  dynamicType: null,
  roleId: null,
  userKey: null,
  remark: null,
  sort: 1
}

export const commonAttr = {
  pcTodoUrl: null,
  pcFinishUrl: null,
  timeout: 0,
  sort: 1,
  isValid: '1'
}

export const nodeAttr = {
  ...deepClone(commonAttr),
  isWaitSibling: '1',
  isAutoNext: '1',
  rejectType: '0',
  isContinue: '0'
}

export const jobAttr = {
  jobName: '任务名称',
  userId: null,
  roleId: null,
  jobType: '0',
  userKey: null,
  dynamicType: '0',
  distUserKey: null,
  distDynType: null,
  isNowCall: '0',
  isNowRun: '0',
  timeout: 0,
  sort: 1,
  isSkip: '0',
  isValid: '1'
}

export const endAttr = {
  ...deepClone(commonAttr),
  isAutoEnd: '0'
}

export const virtualAttr = {
  ...deepClone(commonAttr),
  rejectType: '1'
}

export const highAttr = {
  childFlowKey: null,
  childOrderId: null
}

export const linkAttr = {
  varKey: null
  ,varVal: null
  ,valType: '1'
  ,operator: '1'
  ,operatorType: '0'
  ,isValid: '1'
}

export const laneAttr = {
  isValid: '1'
}
