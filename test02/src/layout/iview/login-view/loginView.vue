<template>
  <div class="container">
    <div class="card">
       <Card >
          <h4 slot="title">欢迎登陆</h4>
          <login-form></login-form>
        </Card>
    </div>
  </div>
</template>

<script>
  import './loginView.less'
  import LoginForm from '@/layout/iview/component/login-form'
  
  export default {
    name: 'LoginView',
    components:{LoginForm},
  }

</script>
