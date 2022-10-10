<template>
  <el-dialog
    title="快捷键"
    width="60%"
    append-to-body
    top="5vh"
    :visible.sync="modalVisible">
    <el-table
      row-key="code"
      :data="dataSource">
      <el-table-column
        v-for="item in columns"
        :key="item.dataIndex"
        :label="item.title"
        :prop="item.key"
        style="width: 100%">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveSetting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {flowConfig} from '@/config/flow-config'

  export default {
    data() {
      return {
        modalVisible: false,
        columns: [
          {
            title: '功能',
            align: 'center',
            key: 'shortcutName',
            dataIndex: 'shortcutName',
            width: '50%'
          },
          {
            title: '快捷键',
            align: 'center',
            key: 'codeName',
            dataIndex: 'codeName',
            width: '50%'
          }
        ],
        dataSource: []
      }
    },
    mounted() {
      let obj = Object.assign({}, flowConfig.shortcut)
      for (let k in obj) {
        this.dataSource.push(obj[k])
      }
    },
    methods: {
      open() {
        this.modalVisible = true
      },
      close() {
        this.modalVisible = false
      },
      saveSetting() {
        this.close()
      },
      cancel() {
        this.close()
      }
    }
  }
</script>

<style>
</style>
