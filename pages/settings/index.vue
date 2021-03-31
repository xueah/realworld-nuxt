<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, key) in errors">
              <li v-for="(message, index) in messages" :key ='index'>
                {{ key }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"
                  v-model="user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="email" placeholder="Email" v-model="user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" minlength="8" placeholder="Password"
                  v-model="user.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" :disabled='updateDisabled'>
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    updateUser
  } from '@/api/user'
  const Cookie = process.client ? require('js-cookie') : undefined
  export default {
    middleware: 'authenticated',
    name: 'SettingsIndex',
    data() {
      return {
        "user": {
          email: "",
          bio: "",
          image: "",
          username: "",
          password: ""
        },
        updateDisabled: false,
        errors: []
      }
    },
    created() {
      const {
        user
      } = this.$store.state
      Object.keys(this.user).forEach(key => {
        this.user[key] = user[key]
      })
    },
    methods: {
      async onSubmit() {
        
        try {
          this.updateDisabled = true
          const params = JSON.parse(JSON.stringify(this.user))
          if (!params.password) Reflect.deleteProperty(params, 'password')
          const { data } = await updateUser(params)
          this.$store.commit('setUser', data.user)
          // 为了防止刷新页面数据丢失，我们需要把数据持久化
          Cookie.set('user', data.user)
          this.updateDisabled = false
        } catch (error) {
          this.errors = error.response.data.errors
          this.updateDisabled = false
        }
        
      },
      logout(){
        Cookie.remove('user')
        this.$store.commit('setUser', null)
        this.$router.push('/')
      }
    }
  }
</script>

<style>

</style>