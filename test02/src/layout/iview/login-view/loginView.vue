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
   <canvas class="background"></canvas>
  </div>
</template>

<script>
  import './loginView.less'
  import Particles from 'particlesjs'
  import LoginForm from '@/layout/iview/component/login-form'
  window.onload = () => {
     var particles = Particles.init({
      selector: '.background',
      color: '#DA0463',
       maxParticles: 130,
          connectParticles: true,
          responsive: [
            {
              breakpoint: 768,
              options: {
                maxParticles: 80
              }
            }, {
              breakpoint: 375,
              options: {
                maxParticles: 50
              }
            }
          ]
    });
  }

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
