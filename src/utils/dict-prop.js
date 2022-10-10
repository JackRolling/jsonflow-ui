/**
 * 字典属性常量
 * @author luolin
 */
export let DIC_PROP = {
  isNeedService: false,
  YES_OR_NO: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }],
  JOB_TYPE: [{
    label: '个人',
    value: '0'
  }, {
    label: '角色',
    value: '1'
  }, {
    label: '或签',
    value: '2'
  }],
  NODE_DEGREE: [{
    label: '出度',
    value: '0'
  }, {
    label: '入度',
    value: '1'
  }],
  REJECT_TYPE: [{
    label: '依次返回',
    value: '0'
  }, {
    label: '直接返回',
    value: '1'
  }],
  OPERATOR: [{
    label: '小于',
    value: '0'
  }, {
    label: '等于',
    value: '1'
  }, {
    label: '大于',
    value: '2'
  }],
  OPERATOR_TYPE: [{
    label: '并且',
    value: '0'
  }, {
    label: '或者',
    value: '1'
  }],
  VAL_TYPE: [{
    label: '数字',
    value: '0'
  }, {
    label: '字符串',
    value: '1'
  }, {
    label: 'SPEL',
    value: '2'
  }],
  DYNAMIC_TYPE: [{
    label: '正常分配',
    value: '0'
  }, {
    label: '动态分配',
    value: '1'
  }, {
    label: '动态计算',
    value: '2'
  }],
  METHODS: [{
    label: '启动节点时拦截start',
    value: 'start'
  }, {
    label: '审批节点前拦截before',
    value: 'before'
  }, {
    label: '节点结束拦截complete',
    value: 'complete'
  }, {
    label: '审批节点后拦截after',
    value: 'after'
  }, {
    label: '驳回后拦截reject',
    value: 'reject'
  }, {
    label: '被驳回后拦截rejected',
    value: 'rejected'
  }]
}
