<template>
  <div class="container">
    <div class="card">
       <Card >
          <div slot="title">
            <span>欢迎登陆</span>
            <a class="register" @click="change">{{isLogin?'注册':'登录'}}</a>
          </div>
          <login-form :isLogin="isLogin"></login-form>
        </Card>
    </div>
  </div>
</template>

<script>
  import './loginView.less'
  import LoginForm from '@/layout/iview/component/login-form'

  export default {
    name: 'LoginView',
    components: { LoginForm },
    data () {
      return {
        isLogin: true
      }
    },
    mounted () {
      this.isLogin = true
    },
    methods: {
      change () {
        console.log('click' + this.isLogin);
        this.isLogin = !this.isLogin
      }
    }
  }
</script>
