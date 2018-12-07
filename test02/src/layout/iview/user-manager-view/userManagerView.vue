<template>
  <Card>
    <tables editable searchable search-place="top" v-model="users" :columns="cols" @on-cancel-edit="cancelEdit" @on-start-edit="startEdit" @on-save-edit="save"></tables>
  </Card>
</template>

<script>
import './userManagerView.less'
import Tables from '@/layout/iview/component/tables'
  import {
    getAllUsers
  } from '@/api/user.js'
  export default {
    name: 'userManagerView',
    components: { Tables },
    mounted() {
      getAllUsers().then(res => {
        this.users = res.data
      }).catch(err => {
        this.$Message.error({
          content: `数据初始化失败 ${err}`
        })
      })
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
          key: 'remark'
        },
        {
          title: '操作',
          render (h, params) {
            return h('div', [
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click() {
                  alert(params.row.password)
                }
              },
              class: 'editButton'
            }, '删除')
            ])
          }
        }
        ]
      }
    },
    methods: {
      startEdit(params) {
        console.log(params.row.password);
        
      },
      cancelEdit(params) {
        console.log(params.row.password);
        
      },
      save(params) {
        console.log(params.row.password);

      }
    }
  }

</script>
