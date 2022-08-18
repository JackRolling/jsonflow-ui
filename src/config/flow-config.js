export const flowAttr = {
  id: null,
  flowName: null,
  flowKey: null,
  photo: null,
  isValid: '1',
  remark: null,
  sort: 1
}

export let flowConfig = {
  // ID的生成类型
  // 1.uuid uuid 2.time_stamp 时间戳 3.sequence 序列 4.time_stamp_and_sequence 时间戳加序列 5.custom 自定义
  idType: ['time_stamp_and_sequence', 6],
  flowData: {
    nodeList: [],
    linkList: [],
    attrs: flowAttr,
    status: '0'
  },
  flowStatus: {
    CREATE: '0',
    SAVE: '1',
    MODIFY: '2',
    LOADING: '3'
  },
  gridConfig: {
    showGrid: true,
    showGridText: "隐藏网格",
    showGridIcon: "el-icon-aim"
  },
  jsPlumbInsConfig: {
    Connector: [
      'Flowchart',
      {
        gap: 5,
        cornerRadius: 8,
        alwaysRespectStubs: true
      }
    ],
    ConnectionOverlays: [
      [
        'Arrow',
        {
          width: 6,
          length: 6,
          location: 1
        }
      ]
    ],
    PaintStyle: {
      stroke: '#2a2929',
      strokeWidth: 1
    },
    HoverPaintStyle: {
      stroke: '#409EFF',
      strokeWidth: 2
    },
    EndpointStyle: {
      fill: '#456',
      stroke: '#2a2929',
      strokeWidth: 1,
      radius: 2
    },
    EndpointHoverStyle: {
      fill: 'pink'
    }
  },
  jsPlumbConfig: {
    anchor: {
      default: ['Bottom', 'Right', 'Top', 'Left']
    },
    conn: {
      isDetachable: false
    },
    makeSourceConfig: {
      filter: 'a',
      filterExclude: true,
      maxConnections: -1,
      endpoint: ['Dot', { radius: 7 }],
      anchor: ['Bottom', 'Right', 'Top', 'Left']
    },
    makeTargetConfig: {
      filter: 'a',
      filterExclude: true,
      maxConnections: -1,
      endpoint: ['Dot', { radius: 7 }],
      anchor: ['Bottom', 'Right', 'Top', 'Left']
    }
  },
  defaultStyle: {
    dragOpacity: 0.7,
    alignGridPX: [5, 5],
    alignSpacing: {
      level: 100,
      vertical: 100
    },
    alignDuration: 300,
    containerScale: {
      init: 1,
      min: 0.5,
      max: 3,
      onceNarrow: 0.1,
      onceEnlarge: 0.1
    },
    isOpenAuxiliaryLine: true,
    showAuxiliaryLineDistance: 20,
    movePx: 5,
    photoBlankDistance: 200
  },
  shortcut: {
    nodeAttr: {
      code: 111,
      codeName: '双击节点或连线设置属性',
      shortcutName: '节点属性配置'
    },
    dragTool: {
      code: 68,
      codeName: 'D(注:可双击画布快速切换)',
      shortcutName: '拖拽工具'
    },
    connTool: {
      code: 76,
      codeName: 'L(注:可双击画布快速切换)',
      shortcutName: '连线工具'
    },
    dragContainer: {
      code: 32,
      codeName: 'SPACE',
      shortcutName: '画布拖拽'
    },
    scaleContainer: {
      code: 18,
      codeName: 'ALT(firefox下为SHIFT)',
      shortcutName: '画布缩放'
    },
    multiple: {
      code: 17,
      codeName: 'CTRL',
      shortcutName: '多选'
    },
    settingModal: {
      code: 83,
      codeName: 'CTRL+ALT+S',
      shortcutName: '打开设置页面'
    },
    jsonModal: {
      code: 84,
      codeName: 'CTRL+ALT+T',
      shortcutName: '打开数据页面'
    },
    leftMove: {
      code: 37,
      codeName: '←',
      shortcutName: '左移'
    },
    upMove: {
      code: 38,
      codeName: '↑',
      shortcutName: '上移'
    },
    rightMove: {
      code: 39,
      codeName: '→',
      shortcutName: '右移'
    },
    downMove: {
      code: 40,
      codeName: '↓',
      shortcutName: '下移'
    },
    zoomInTool: {
      code: 190,
      codeName: '<',
      shortcutName: '放大工具'
    },
    zoomOutTool: {
      code: 188,
      codeName: '>',
      shortcutName: '缩小工具'
    }
  },
  contextMenu: {
    container: {
      menuName: 'flow-menu',
      axis: {
        x: null,
        y: null
      },
      menulists: [
        {
          fnHandler: 'flowInfo',
          icoName: 'edit',
          btnName: '流程图信息'
        },
        {
          icoName: 'edit',
          btnName: '对齐方式',
          children: [
            {
              icoName: 'edit',
              fnHandler: 'verticaLeft',
              btnName: '垂直左对齐'
            },
            {
              icoName: 'edit',
              fnHandler: 'verticalCenter',
              btnName: '垂直居中'
            },
            {
              icoName: 'edit',
              fnHandler: 'verticalRight',
              btnName: '垂直右对齐'
            },
            {
              icoName: 'edit',
              fnHandler: 'levelUp',
              btnName: '水平上对齐'
            },
            {
              icoName: 'edit',
              fnHandler: 'levelCenter',
              btnName: '水平居中'
            },
            {
              icoName: 'edit',
              fnHandler: 'levelDown',
              btnName: '水平下对齐'
            }
          ]
        },
        {
          fnHandler: 'selectAll',
          icoName: 'edit',
          btnName: '全选'
        },
        {
          fnHandler: 'paste',
          icoName: 'edit',
          btnName: '粘贴'
        },
        {
          fnHandler: 'publishFlow',
          icoName: 'edit',
          btnName: '发布流程'
        }
      ]
    },
    node: {
      menuName: 'node-menu',
      axis: {
        x: null,
        y: null
      },
      menulists: [
        {
          fnHandler: 'setNodeAttr',
          icoName: 'el-icon-edit',
          btnName: '设置属性'
        },
        {
          fnHandler: 'copyNode',
          icoName: 'el-icon-document-copy',
          btnName: '复制节点'
        },
        {
          fnHandler: 'deleteNode',
          icoName: 'el-icon-delete',
          btnName: '删除节点'
        }
      ]
    },
    link: {
      menuName: 'link-menu',
      axis: {
        x: null,
        y: null
      },
      menulists: [
        {
          fnHandler: 'setLinkAttr',
          icoName: 'el-icon-edit',
          btnName: '设置属性'
        },
        {
          fnHandler: 'deleteLink',
          icoName: 'el-icon-delete',
          btnName: '删除连线'
        }
      ]
    }
  }
}
