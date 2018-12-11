<template>
  <Card>
    <tables editable searchable search-place="top" v-model="users" :columns="cols" @on-cancel-edit="cancelEdit" @on-start-edit="startEdit" @on-save-edit="save" @on-delete="handleDelete"></tables>
  </Card>
</template>

<script>
import './userManagerView.less'
import Tables from '@/layout/iview/component/tables'
import userService from '@/api/user.js'

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
        options: ['delete']
      }
      ]
    }
  },
  methods: {
    fetchData() {
      userService.getAllUsers().then(res => {
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
      save: async function (params) {
      let item = { id: params.row.id, key: params.column.key, value: params.value }
      // let old = params.row[params.column.key]
      let res = await userService.updateUser(item)

      console.log(res.data);
      if (res.data.errcode) {
        this.$Message.error({
          content: '修改失败'
          })
      } else {
        this.$Message.info({
          content: '修改成功'
        })
      }
      this.fetchData()
      console.log(`save id:${params.row.id} ${params.column.key}:${params.row[params.column.key]} ${params.value}`);
    },
    async handleDelete(params) {
      console.log(params.row.id);

      let res =  await userService.deleteUserById(params.row.id)
      console.log(JSON.stringify(res));

      if (res.data.errcode) {
        this.$Message.error({
          content: '删除失败'
          })
      } else {
        this.$Message.info({
          content: '删除成功'
        })
      }

      this.fetchData()
    }
  }
}

</script>
