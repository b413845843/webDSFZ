<template>
  <div>
    <transition name="slide-fade" mode="out-in">
      <Form v-if="isLogin" ref="loginForm" :model="user" :rules="rules" key="1" @keydown.enter.native="login">
        <FormItem prop="name">
          <Input v-model="user.name" placeholder="输入账户" clearable>
          <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input v-model="user.password" type="password" placeholder="密码" clearable>
          <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span>
          </Input>
        </FormItem>

        <Button type="primary" @click="login" :loading="loginging" long>
          <span v-if="loginging">正在登录</span>
          <span v-else>登录</span>
        </Button>
        <p class="login-tip">可以注册了</p>
      </Form>

      <Form v-else ref="registerForm" :model="ruser" :rules="resigsterRules" key="2" @keydown.enter.native="register">
        <FormItem prop="name">
          <Input v-model="ruser.name" placeholder="输入用户名" clearable>
          <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input v-model="ruser.password" placeholder="密码" clearable type="password">
          <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span></Input>
        </FormItem>
        <FormItem prop="passwordCheck">
          <Input v-model="ruser.passwordCheck" placeholder="确认密码" clearable type="password">
          <span slot="prepend">
            <Icon :size="16" type="md-lock"></Icon>
          </span>
          </Input>
        </FormItem>
        <FormItem prop="email">
          <Input v-model="ruser.email" placeholder="邮件" clearable>
          <span slot="prepend">
            <Icon :size="16" type="ios-mail"></Icon>
          </span>
          </Input>
        </FormItem>
        <Button type="primary" long @click="register">注册</Button>
      </Form>
    </transition>
  </div>
</template>

<script>
  import './loginForm.less'
  import {
    mapActions
  } from 'vuex'

  export default {
    props: {
      isLogin: Boolean
    },
    name: 'LoginForm',
    data() {
      const validatePass = function (rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (
            this.ruser.passwordCheck !== '' &&
            this.ruser.passwordCheck.length > 0
          ) {
            this.$refs.registerForm.validateField('passwordCheck');
          }
          if (this.ruser.passwordCheck === '') {
            this.$refs.registerForm.validateField('passwordCheck');
          }
          callback();
        }
      }.bind(this);
      const validatePassCheck = function (rule, value, callback) {
        if (this.ruser.password === '') {
          this.$refs.registerForm.validateField('password');
        } else if (value === '' || value.length <= 0) {
          callback(new Error('请再次输入密码'));
        } else if (this.ruser.password !== value) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      }.bind(this);

      return {
        loginging: false,
        rules: {
          name: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          passwordCheck: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        resigsterRules: {
          name: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          },
          {
            required: true,
            message: '不能为空'
          }],
          passwordCheck: [{
              validator: validatePassCheck,
              trigger: 'blur',
            },
            {
              required: true,
              message: '不能为空'
            }
          ],
          email: [{
              type: 'email',
              message: '邮件格式不正确'
            },
            {
              required: true,
              type: 'email',
              message: '邮件不能为空'
            }
          ]
        },
        user: {
          name: '',
          password: ''
        },
        ruser: {
          name: '',
          password: '',
          passwordCheck: '',
          email: ''
        }
      };
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'handleRegister'
      ]),
      login() {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            this.loginging = true;
            await this.handleLogin(this.user).then(res => {
              this.$Message.info({
                content: '登陆成功'
              })
              this.$router.push('/home')
            }).catch(err => {
              this.$Message.error({
                content: err.message
              })
            })
          }
          this.loginging = false
        })
      },
      register() {
        this.$refs.registerForm.validate(async (valid) => {
          console.log(this.ruser)
          if (valid) {
            await this.handleRegister(this.ruser).then(res => {
            this.$Message.info({
              content: '注册成功'
            })
            this.$router.push('/home')
            }).catch(err => {
              console.log(this);
              this.$Message.error({
                content: err.message
              })
            })
          }
        })
      }
    }
  }
</script>
