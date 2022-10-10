<template>
  <el-tabs size="small" class="flow-attr"
           v-model="activeKey">
    <el-tab-pane name="flow-attr">
				<span slot="label">
					<el-icon name="loading"/>
					流程属性
				</span>
      <el-form label-width="130px">
        <el-form-item label="已有流程">
          <el-select
            v-model="defFlowId"
            clearable
            filterable
            placeholder="可选择已有流程">
            <el-option
              v-for="item in defFlows"
              :key="item.id"
              :label="item.flowKey"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" plain @click="loadExistFlow" style="margin-left: 10px;">加载</el-button>
        </el-form-item>
        <el-form-item label="当前流程ID">
          <el-input v-model="flowData.attrs.id" disabled/>
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="flowData.attrs.flowName"/>
        </el-form-item>
        <el-form-item label="流程KEY">
          <el-input v-model="flowData.attrs.flowKey" placeholder="一般为工单实体类名称"/>
        </el-form-item>
        <el-form-item label="流程备注">
          <el-input v-model="flowData.attrs.remark"/>
        </el-form-item>
        <el-form-item label="流程排序">
          <el-input-number v-model="flowData.attrs.sort" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-switch
            v-model="flowData.attrs.isValid"
            active-value="1"
            inactive-value="0"
            inactive-text="否"
            active-text="是">
          </el-switch>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="node-attr">
				<span slot="label">
					<el-icon name="s-operation"/>
					节点属性
				</span>
      <el-form label-width="130px" v-if="currentSelect.type && currentSelect.type !== CommonNodeType.LINK && currentSelect.type !== HighNodeType.JOB">
          <el-divider >节点配置</el-divider>
          <div style="margin: 5px 20px"><span style="color: red;font-size: 14px">注:当前节点没有单独配置【节点任务】时，作为节点默认的任务属性配置</span></div>
          <el-form-item label="节点类型">
            <el-tag>{{ currentSelect.type }}</el-tag>
          </el-form-item>
          <el-form-item label="节点ID">
            <el-input v-model="currentSelect.id" disabled/>
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input placeholder="请输入节点名称"
                      v-if="currentSelect.type === CommonNodeType.START || currentSelect.type === CommonNodeType.END"
                      disabled
                      v-model="currentSelect.nodeName"/>
            <el-input placeholder="请输入节点名称" v-else v-model="currentSelect.nodeName"/>
          </el-form-item>

        <template v-if="currentSelect.type === CommonNodeType.START || currentSelect.type === CommonNodeType.END
        || currentSelect.type === CommonNodeType.SERIAL || currentSelect.type === CommonNodeType.PARALLEL || currentSelect.type === HighNodeType.VIRTUAL">
          <el-form-item label="PC待办页面">
            <el-select v-model="currentSelect.attrs.pcTodoUrl" multiple clearable placeholder="请选择PC待办页面">
              <el-option
                v-for="item in tabsOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PC已办页面">
            <el-select v-model="currentSelect.attrs.pcFinishUrl" multiple clearable placeholder="请选择PC已办页面">
              <el-option
                v-for="item in tabsOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点时限">
            <el-input-number v-model="currentSelect.attrs.timeout" placeholder="小于0则不限制"></el-input-number>
          </el-form-item>
          <el-form-item label="节点排序">
            <el-input-number v-model="currentSelect.attrs.sort"></el-input-number>
          </el-form-item>
        </template>

        <template v-if="currentSelect.type === CommonNodeType.START">

        </template>
        <template v-if="currentSelect.type === CommonNodeType.END">
          <el-form-item label="是否自动结束">
            <el-switch
              v-model="currentSelect.attrs.isAutoEnd"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
        </template>
        <template v-if="currentSelect.type === CommonNodeType.SERIAL || currentSelect.type === CommonNodeType.PARALLEL">
          <el-form-item label="是否等待兄弟任务">
            <el-switch
              v-model="currentSelect.attrs.isWaitSibling"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否自动流转下一节点">
            <el-switch
              v-model="currentSelect.attrs.isAutoNext"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
          <el-form-item label="驳回类型">
            <el-switch
              v-model="currentSelect.attrs.rejectType"
              active-value="1"
              inactive-value="0"
              inactive-text="依次返回"
              active-text="直接返回">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否继续下一节点">
            <el-switch
              v-model="currentSelect.attrs.isContinue"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
        </template>
        <template v-if="currentSelect.type === HighNodeType.VIRTUAL">
          <el-form-item label="驳回类型">
            <el-switch disabled
                       v-model="currentSelect.attrs.rejectType"
                       active-value="1"
                       inactive-value="0"
                       inactive-text="依次返回"
                       active-text="直接返回">
            </el-switch>
          </el-form-item>
        </template>
        <template v-if="currentSelect.type === HighNodeType.CHILD_FLOW">
          <el-form-item label="子流程KEY">
            <el-input placeholder="请输入子流程KEY" v-model="currentSelect.childFlowKey"/>
          </el-form-item>
        </template>
        <template v-if="currentSelect.type === LaneNodeType.X_LANE || currentSelect.type === LaneNodeType.Y_LANE">

        </template>
        <el-form-item label="是否有效" v-if="currentSelect.attrs !== undefined">
          <el-switch
            v-model="currentSelect.attrs.isValid"
            active-value="1"
            inactive-value="0"
            inactive-text="否"
            active-text="是">
          </el-switch>
        </el-form-item>

        <template v-if="currentSelect.type === CommonNodeType.START || currentSelect.type === CommonNodeType.END
        || currentSelect.type === CommonNodeType.SERIAL || currentSelect.type === CommonNodeType.PARALLEL || currentSelect.type === HighNodeType.VIRTUAL">

          <el-divider >节点监听配置</el-divider>

          <el-form-item label="监听类">
            <el-input placeholder="Bean名称：BusinessInterceptor实现类" v-model="currentSelect.clazz.clazz"/>
          </el-form-item>
          <el-form-item label="方法名称">
            <el-select v-model="currentSelect.clazz.methods" multiple clearable placeholder="多个方法名称，英文逗号分隔，顺序从左到右">
              <el-option
                v-for="item in DIC_PROP.METHODS"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="办理人员角色">
            <el-select v-model="currentSelect.clazz.roleId" filterable clearable>
              <el-option
                v-for="item in roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="动态办理人KEY">
            <el-select v-model="currentSelect.clazz.userKey" filterable clearable>
              <el-option
                v-for="item in userKeys"
                :key="item.userKey"
                :label="item.userKey"
                :value="item.userKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="办理人员类型">
            <el-select v-model="currentSelect.clazz.dynamicType" clearable>
              <el-option
                v-for="item in DIC_PROP.DYNAMIC_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监听备注">
            <el-input v-model="currentSelect.clazz.remark"></el-input>
          </el-form-item>
          <el-form-item label="监听排序">
            <el-input-number v-model="currentSelect.clazz.sort" :min="1"></el-input-number>
          </el-form-item>
        </template>
      </el-form>
    </el-tab-pane>

    <el-tab-pane name="node-job-attr">
				<span slot="label">
					<el-icon name="s-operation"/>
					节点任务属性
				</span>
      <el-form label-width="130px" v-if="currentSelect.type === CommonNodeType.START || currentSelect.type === CommonNodeType.END
          || currentSelect.type === CommonNodeType.SERIAL || currentSelect.type === CommonNodeType.PARALLEL || currentSelect.type === HighNodeType.VIRTUAL
          || currentSelect.type === HighNodeType.JOB">

        <div style="margin: 5px 20px"><span style="color: red;font-size: 14px">注:当前节点单独配置【节点任务】时，则节点上配置的默认任务属性失效</span></div>

          <el-form-item label="任务名称">
            <el-input placeholder="请输入任务名称" v-model="currentSelect.defJob.jobName"/>
          </el-form-item>
          <el-form-item label="办理人员">
              <el-select v-model="currentSelect.defJob.userId" filterable clearable placeholder="一般设置角色非人员">
                  <el-option
                          v-for="item in users"
                          :key="item.userId"
                          :label="item.username"
                          :value="item.userId">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="办理人员角色">
            <el-select v-model="currentSelect.defJob.roleId" filterable clearable>
              <el-option
                v-for="item in roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="currentSelect.defJob.jobType">
              <el-option
                v-for="item in DIC_PROP.JOB_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="动态办理人KEY">
            <el-select v-model="currentSelect.defJob.userKey" filterable clearable>
              <el-option
                v-for="item in userKeys"
                :key="item.userKey"
                :label="item.userKey"
                :value="item.userKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="办理人员类型">
            <el-select v-model="currentSelect.defJob.dynamicType" clearable>
              <el-option
                v-for="item in DIC_PROP.DYNAMIC_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认分配任务KEY">
            <el-select v-model="currentSelect.defJob.distUserKey" filterable clearable>
              <el-option
                v-for="item in userKeys"
                :key="item.userKey"
                :label="item.userKey"
                :value="item.userKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配人员类型">
            <el-select v-model="currentSelect.defJob.distDynType" clearable>
              <el-option
                v-for="item in DIC_PROP.DYNAMIC_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="多人会签审批都执行监听">
            <el-switch
              v-model="currentSelect.defJob.isNowCall"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
          <el-form-item label="被分配后立即运行">
            <el-switch
              v-model="currentSelect.defJob.isNowRun"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
          <el-form-item label="任务时限">
            <el-input-number v-model="currentSelect.defJob.timeout" placeholder="小于0则不限制"></el-input-number>
          </el-form-item>
          <el-form-item label="任务排序">
            <el-input-number v-model="currentSelect.defJob.sort" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="被驳回是否可跳过">
            <el-switch
              v-model="currentSelect.defJob.isSkip"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-switch
              v-model="currentSelect.defJob.isValid"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane name="link-attr">
				<span slot="label">
					<el-icon name="share"/>
					连线属性
				</span>
      <template v-if="currentSelect.type === CommonNodeType.LINK">
        <el-form label-width="130px">
          <el-divider >连线配置</el-divider>
          <el-form-item label="连线ID">
            <el-input v-model="currentSelect.id" disabled/>
          </el-form-item>
          <el-form-item label="源节点">
            <el-input v-model="currentSelect.sourceId" disabled/>
          </el-form-item>
          <el-form-item label="目标节点">
            <el-input v-model="currentSelect.targetId" disabled/>
          </el-form-item>
          <el-form-item label="连线名称">
            <el-input v-model="currentSelect.label" @change="linkLabelChange"/>
          </el-form-item>
          <el-divider >连线条件配置</el-divider>
          <el-form-item label="条件变量名(新增)">
            <el-select
              v-model="currentSelect.attrs.varKey"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请选择或新增条件变量名">
              <el-option
                v-for="item in varKeys"
                :key="item.varKey"
                :label="item.varKey"
                :value="item.varKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条件变量值(新增)">
            <el-select
              v-model="currentSelect.attrs.varVal"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请选择或新增条件变量值">
              <el-option
                v-for="item in [{varVal:'varVal'}]"
                :key="item.varVal"
                :label="item.varVal"
                :value="item.varVal">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条件值类型">
            <el-select v-model="currentSelect.attrs.valType" clearable>
              <el-option
                v-for="item in DIC_PROP.VAL_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条件运算符">
            <el-select v-model="currentSelect.attrs.operator" clearable>
              <el-option
                v-for="item in DIC_PROP.OPERATOR"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条件运算类型">
            <el-select v-model="currentSelect.attrs.operatorType" clearable>
              <el-option
                v-for="item in DIC_PROP.OPERATOR_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-switch
              v-model="currentSelect.attrs.isValid"
              active-value="1"
              inactive-value="0"
              inactive-text="否"
              active-text="是">
            </el-switch>
          </el-form-item>
        </el-form>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {CommonNodeType, HighNodeType, LaneNodeType} from '@/config/type'
  import {DIC_PROP} from '@/utils/dict-prop'
  import * as defFlow from "@/api/jsonflow";

  export default {
    props: ['plumb', 'flowData', 'select'],
    data() {
      return {
        currentSelect: this.select,
        activeKey: 'flow-attr',
        CommonNodeType: CommonNodeType,
        HighNodeType: HighNodeType,
        LaneNodeType: LaneNodeType,
        DIC_PROP: DIC_PROP,
        userKeys: [],
        tabsOptions: [],
        varKeys: [],
        roles: [],
        users: [],
        defFlows: [],
        defFlowId: null
      }
    },
    mounted() {
      if (!DIC_PROP.isNeedService) {
        this.$message.warning("注: 默认不开启后端服务器，故部分配置数据选项为默认数据");
        this.defFlows = [{id: 1, flowKey: 'AskLeave'}]
        this.userKeys = [{userKey: 'create_user'}]
        this.varKeys = [{varKey: 'isNeedUserAudit'}]
        this.tabsOptions = [{id: 2, label: '审批过程'},{id: 3, label: '查看流程图'}]
        this.roles = [{roleId: 1, roleName: '管理员'}]
        this.users = [{userId: 1, username: 'admin'}]
        return
      }
      // 获取流程数据
      defFlow.listDefFlow().then(resp => {
        this.defFlows = resp.data.data
      }).catch(() => {
        this.$message.error("获取流程数据失败");
      })

      // 获取用户KEY
      defFlow.listUserKey().then(resp => {
        this.userKeys = resp.data.data
      }).catch(() => {
        this.$message.error("获取用户KEY失败");
      })

      // 获取审批页面
      defFlow.listTabsOptions().then(resp => {
        this.tabsOptions = resp.data.data
      }).catch(() => {
        this.$message.error("获取审批页面失败");
      })

      // 获取条件KEY
      defFlow.listVarKey().then(resp => {
        this.varKeys = resp.data.data
      }).catch(() => {
        this.$message.error("获取条件KEY失败");
      })

      // 获取角色
      defFlow.listRole().then(resp => {
        this.roles = resp.data.data
      }).catch(() => {
        this.$message.error("获取角色失败");
      })
      // 获取人员
      defFlow.listUser().then(resp => {
        this.users = resp.data.data
      }).catch(() => {
        this.$message.error("获取人员失败");
      })
    },
    methods: {
      linkLabelChange(label) {
        let conn = this.plumb.getConnections({
          source: this.currentSelect.sourceId,
          target: this.currentSelect.targetId
        })[0]
        let link_id = conn.canvas.id
        let labelHandle = e => {
          let event = window.event || e
          event.stopPropagation()
          this.currentSelect = this.flowData.linkList.filter(l => l.id === link_id)[0]
        }

        if (label !== '') {
          conn.setLabel({
            label: label,
            cssClass: `link-label ${link_id}`
          })
          // 添加label点击事件
          document.getElementsByClassName(link_id)[0].addEventListener('click', labelHandle)
        } else {
          // 移除label点击事件
          document.getElementsByClassName(link_id)[0].removeEventListener('click', labelHandle)

          let labelOverlay = conn.getLabelOverlay()
          if (labelOverlay) conn.removeOverlay(labelOverlay.id)
        }
      },
      // 加载已有流程
      loadExistFlow() {
        if (!this.defFlowId) {
          this.$message.warning("请先选择已有流程")
          return
        }
        let find = this.defFlows.find(f => f.id === this.defFlowId);
        if (!find) {
          this.$message.warning("流程数据不存在")
          return
        }
        this.$confirm('是否加载流程' + find.flowKey, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('loadFlow', find.flowJson);
          this.$emit("showAttrConfig", false);
        })
      }
    },
    watch: {
      select(val) {
        this.currentSelect = val
        if (this.currentSelect.type === CommonNodeType.LINK) {
          this.activeKey = 'link-attr'
        }else if (this.currentSelect.type === HighNodeType.JOB) {
          this.activeKey = 'node-job-attr'
        } else if (!this.currentSelect.type) {
          this.activeKey = 'flow-attr'
        } else {
          this.activeKey = 'node-attr'
        }
      },
      currentSelect: {
        handler(val) {
          this.$emit('update:select', val)
        },
        deep: true
      }
    }
  }
</script>

<style lang="less">
  @import '../assets/style/flow-attr.less';
</style>
