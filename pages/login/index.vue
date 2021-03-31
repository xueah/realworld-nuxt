<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to='/register'>Need an account?</nuxt-link>
            <nuxt-link v-else to='/login'>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, key) in errors">
              <li v-for="(message, index) in messages" :key ='index'>
                {{ key }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input class="form-control form-control-lg" type="text" v-model="user.username" placeholder="Your Name" required>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" v-model='user.email' required type="email" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" v-model='user.password' required minlength="8" type="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up'}}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user.js'

// 尽在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuthenticated',
  name: 'LoginIndex',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  data () {
    return {
      "user":{
        "username": "",
        "email": "",
        "password": ""
      },
      errors: {} //错误信息
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.isLogin ? await login({
          user: this.user
        }) :
        await register({
          user: this.user
        })
        // console.log(data)
        this.$store.commit('setUser', data.user)
        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set('user', data.user)

        this.$router.push('/')

      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style>

</style>