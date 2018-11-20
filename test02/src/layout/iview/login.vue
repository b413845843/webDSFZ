<template>
  <div class="container">
    <Card class="card">
      <p slot="title">{{ isLogin ?'登录':'注册' }} <a style="float:right" size="samll" @click="gotoRegister">{{isLogin?'注册':'登录'}}</a></p>
      <transition name="slide-fade" mode="out-in">
        <Form v-if="isLogin" ref="loginForm" :model="user" :label-width=60 :rules="rules" key="1">
          <FormItem label="用户名" prop="name">
            <Input v-model="user.name" placeholder="输入账户" clearable></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="user.password" type="password" placeholder="密码" clearable></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="login" :loading="loginging">
              <span v-if="loginging">正在登录</span>
              <span v-else>登录</span>

            </Button>
          </FormItem>
        </Form>
        <Form v-else ref="registerForm" :model="ruser" :label-width=80 :rules="resigsterRules" key="2">
          <FormItem label="用户名" prop="name">
            <Input v-model="ruser.name" placeholder="输入用户名" clearable></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="ruser.password" placeholder="密码" clearable></Input>
          </FormItem>
          <FormItem label="确认密码" prop="passwordCheck">
            <Input v-model="ruser.passwordCheck" placeholder="确认密码" clearable></Input>
          </FormItem>
          <FormItem label="邮件" prop="email">
            <Input v-model="ruser.email" placeholder="邮件" clearable></Input>
          </FormItem>
          <FormItem>
            <Button type="primary">注册</Button>
          </FormItem>
        </Form>

      </transition>

    </Card>
  </div>
</template>

<style scoped>
  .container {
    background-color: rgb(173, 216, 233);
    width: 100%;
    height: 1024px;
    padding: 200px 0px;
  }

  .card {
    margin: 0 auto;
    width: 500px;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-leave-to

  /* .slide-fade-leave-active for below version 2.1.8 */
    {
    transform: translateX(50px);
    opacity: 0;
  }

  .slide-fade-enter {
    transform: translateX(-50px);
    opacity: 0;
  }

</style>


<script>
export default {
  data() {
    const validatePass = function (rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入密码"));
        console.log("11");
      } else {
        if (
          this.ruser.passwordCheck !== "" &&
          this.ruser.passwordCheck.length > 0
        ) {
          console.log("22");

          this.$refs.registerForm.validateField("passwordCheck");
        }
        if (this.ruser.passwordCheck === "") {
          this.$refs.registerForm.validateField("passwordCheck");
        }
        callback();
      }
    }.bind(this);
    const validatePassCheck = function (rule, value, callback) {
      if (this.ruser.password === "") {
        this.$refs.registerForm.validateField("password");
      } else if (value == "" || value.length <= 0) {
        console.log("33");
        callback(new Error("请再次输入密码"));
      } else if (this.ruser.password !== value) {
        console.log("44");
        callback(new Error("两次输入密码不一致"));
      } else {
        console.log("55");
        callback();
      }
    }.bind(this);

    return {
      isLogin: true,
      loginging: false,
      rules: {
        name: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码名不能为空',
          trigger: 'blur'
        }],
        passwordCheck: [{
          required: true,
          message: '密码名不能为空',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '密码名不能为空',
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
            message: '密码名不能为空',
            trigger: 'blur'
          }
        ],
        passwordCheck: [{
            validator: validatePassCheck,
            trigger: 'blur'
          },
          {
            required: true,
            message: '密码名不能为空',
            trigger: 'blur'
          }
        ],
        email: [{
            required: true,
            message: '邮件不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'email',
            trigger: 'blur'
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
        passwordCheck: ''
      }
    };
  },
  methods: {
    gotoRegister: function () {
      this.isLogin = !this.isLogin;
    },
    login() {
      this.loginging = true;
      console.log(this.isLogin);
      if (this.user.name === "123" && this.user.password === "123") {
        this.$Message.success({
          content: "登录成功"
        })

        setTimeout(() => {
          this.$router.push("/manager");
        }, 2000)
      } else {
        this.$Message.error({
          content: "账户名或者密码错误"
        })
      }
      setTimeout(() => {
        this.loginging = false
      }, 2000)
    }
  }
}

</script>
