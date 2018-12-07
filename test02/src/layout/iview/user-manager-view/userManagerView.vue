<template>
  <Card>
    <tables editable searchable search-place="top" v-model="users" :columns="cols" @on-cancel-edit="cancelEdit" @on-start-edit="startEdit" @on-save-edit="save" @on-delete="handleDelete"></tables>
  </Card>
</template>

<script>
import './userManagerView.less'
import Tables from '@/layout/iview/component/tables'
  import {
    getAllUsers,
    updateUser
  } from '@/api/user.js'
  export default {
    name: 'userManagerView',
    components: { Tables },
    mounted() {
      this.fetchData()
    },
    data() {
      return {
        tableData: [],
        users: [],
        cols: [{
          title: '用户名',
          key: 'username'
        },
        {
          title: '密码',
          key: 'password',
          editable: true
        },
        {
          title: '邮箱',
          key: 'mail',
          editable: true
        },
        {
          title: '角色',
          key: 'remark',
          editable: true
        },
        {
          title: '操作',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              })
            }
          ]
        }
        ]
      }
    },
    methods: {
      fetchData() {
         getAllUsers().then(res => {
        this.users = res.data
      }).catch(err => {
        this.$Message.error({
          content: `数据初始化失败 ${err}`
        })
      })
      },
      startEdit(params) {
        console.log(`old id:${params.row.id} ${params.column.key}:${params.row[params.column.key]}`);
      },
      cancelEdit(params) {
        console.log(params.row.password);
      },
      save(params) {
        let item = { id: params.row.id, key: params.column.key, value: params.value }
        // let old = params.row[params.column.key]

        updateUser(item).then(res => {
          console.log('修改 ' + res.data.message);
          this.fetchData()
        }).catch(err => {
          console.log('失败' + err);
        })
        console.log(`save id:${params.row.id} ${params.column.key}:${params.row[params.column.key]} ${params.value}`);
      },
      handleDelete(params) {
         console.log(`delete ${JSON.stringify(params)}`);
      }
    }
  }

</script>
