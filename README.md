![08](public/favicon.ico)

[![star](https://gitee.com/jackrolling/json-flow-ui/badge/star.svg?theme=dark)](https://gitee.com/jackrolling/json-flow-ui/stargazers) [![fork](https://gitee.com/jackrolling/json-flow-ui/badge/fork.svg?theme=dark)](https://gitee.com/jackrolling/json-flow-ui/members) <img src="https://img.shields.io/badge/release-v1.0.0-brightgreen.svg"> <img src="https://shields.io/badge/license-APACHE2.0-blue">

### JsonFlow在线演示  [Gitee最新,点击前往](https://gitee.com/jackrolling/json-flow-ui)
[点击预览](http://flow.pigx.vip/#/login)（注：JsonFlow只是其中的工作流管理模块）

### JsonFlow在线文档
[点击预览](https://jackrolling.github.io/#/)

### 如果觉得不错，给作者一个⭐️小星星⭐️Star⭐️吧
#### 绝对简单易用且适合较复杂场景的中国式审批的工作流（工作流引擎+前端工作流管理，请加群咨询）
注：本系统没有贬低其他工作流系统的意思，请悉知
#### 介绍
- 基于本系统开发的工单系统已在生产上平稳运行良久，生产已验证


- 一个神奇的自研工作流JsonFlow，前后端非常简单的纯Json交互（格式简单），支持任意拖拉拽生成流程图，非常容易进行二次开发。


- 1.JsonFlow工作流基于JsPlumb的流程设计器 + 自研后端Java工作流引擎，组成了一套纯JSON数据交互的工作流系统。


- 2.本系统无论前端还是后端，其学习成本明显低于市面上开源的工作流引擎及附带的流程设计器，能够快速上手前后端实现逻辑，更方便用户快速进行二次开发。


- 3.本系统前端流程设计器，采用Vue ElementUI + JsPlumb实现，支持可任意托拉拽与任意连线绘制流程图，简单易用具有更友好的操作方式。

#### 工作流引擎支持：
- 1.支持基础的多种审批模式：支持抄送、审批、触发器、条件分支、并行分支等


- 2.除此之外，灰常适合中国式的审批，如下：

  - 正常配置人员、动态分配、动态计算分配人员，动态计算节点增量任务，驳回任意节点。

  - 可不等待兄弟任务、支持业务侧开启和计算任务，不满足条件可继续流转下一节点。

  - 支持vue页面配置化，支持工作任务交接。

#### 工作流与工单系统解耦：

- 本系统将工作流引擎与工单系统分离，目的在于解耦减少业务对工作流的入侵，以便于业务后期各种复杂报表统计


- 本系统同时支持在线工作与任务交接，弥补了传统BPM工作流需单独处理的不足，方便公司人员流动后的工作交接

#### 实现简要概述：
- 节点分类非常简单，发起节点、串行节点、并行节点、结束节点、虚拟节点。 主要基于传统BPM使用的感受，考虑到传统BPM类型过多复杂且极少用，故本工作流系统仅分6种节点类型，常使用的主要是串行、并行节点。


- 串行顾名思义流程只有一个分支往下走，并行则表示流程可以同时流转到多个分支，只要掌握这个概念，使用会非常简单。这样设计的原因是传统的BPM有各种的节点或网关，但实际上使用的很少，网关本系统采用串行+条件 或 并行+条件来代替。


- 任务类型分为个人、角色、或签。个人即表示由某个人来办理这个任务，角色则表示拥有同一个角色的人都可以办理，谁先办理属于谁。会签在本系统中采用多个节点任务来表达一个节点同时需多个人来办理的情况


- 办理人员类型分为正常分配、动态分配、动态计算，常使用的主要是正常分配、动态分配。正常分配指可指定一个人或一个角色来办理，动态分配则表示根据某个SPEL表达式来动态指定某个人，动态计算则表示根据多个角色或多个人，业务侧手动调用节点任务增量接口，来动态计算和生成多个节点任务。

#### 待优化内容 - 持续迭代
- 延时处理实现

- 支持表单权限控制
- ...

#### 效果演示
![01](public/usages/01.png)


#### 流程设计器支持：
- 拖拽节点到绘图区，进行任意连线

- 双击节点、任务、连线进行属性设置，可同时设置监听器、条件属性
  ![03](public/usages/03.png)
  ![04](public/usages/04.png)

- 预览流程图、发布流程
  ![02](public/usages/02.png)
- 更多功能期待你体验...

#### 工作流管理、工单管理、工作交接模块
![04](public/flow/10.png)
#### 任务管理
- 在待办任务查看自己需要办理的任务，办理人员支持高度配置化
  ![07](public/flow/07.png)
- 在待办任务点审批，可以查看/修改工单信息、审批过程、流程图。页面支持高度可配置化
  ![08](public/flow/08.png)
- 工作流界面十余个，更多功能期待你体验...

#### 数据结构
```json
{
  "nodeList": [
    {
      "type": "start",
      "nodeName": "开始",
      "icon": null,
      "attrs": {
        "pcTodoUrl": null,
        "pcFinishUrl": null
      },
      "clazz": {
        "clazz": null,
        "methods": null
      },
      "defJob": {
        "jobName": "任务名称",
        "userId": null,
        "roleId": null
      },
      "jobSize": 1,
      "id": "1661145449179000002",
      "height": 50,
      "x": 210,
      "width": 50,
      "y": 205
    }
  ],
  "linkList": [
    {
      "type": "link",
      "label": "",
      "sourceId": "1661145449179000002",
      "targetId": "1661145452800000003",
      "attrs": {
        "varKey": null,
        "varVal": null
      },
      "id": "1661145456855000004",
      "icon": null
    }
  ],
  "attrs": {
    "id": "1661145437059000001"
  },
  "status": "0"
}
```

#### 本地安装

* 下载本项目：npm install

* 启动项目：npm run dev

* 构建项目dist：npm run build

#### 关于作者&&微信群
- 欢迎大家进群一起交流 🔥🔥🔥
- 如果群二维码失效了，可以直接加我微信拉群，感谢

<table>
  <tr>
    <td><img src="public/about/me.png"></td>
    <td><img src="public/about/group.png"></td>
  </tr>
</table>
