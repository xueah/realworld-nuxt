<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent='onSubmit'>
            <fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title"
                  v-model="article.title">
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?"
                  v-model="article.description">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)"
                  v-model="article.body"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" v-model="article.tags">
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit" :disabled='submitDisabled'>
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    getArticle, updateArticle, createArticle
  } from '@/api/article'
  export default {
    middleware: 'authenticated',
    name: 'EditorIndex',
    data () {
      return {
        submitDisabled: false
      }
    },
    async asyncData(context) {
      const {
        params
      } = context
      const article = {
        title: '',
        description: '',
        body: '',
        tags: ''
      }
      if (params.slug) {
        const {
          data
        } = await getArticle(params.slug)
        Object.keys(article).forEach(key => article[key] = data.article[key])
        article.tags = data.article.tagList.join(' ')
      }
      return {
        article
      }
    },
    methods: {
      async onSubmit() {
        this.submitDisabled = true
        const { params } = this.$route
        const { title, description, body, tags} = this.article
        const postData = {
          title, description, body,
          tagList: tags.split(' ')
        }
        const { data } = params.slug ? await updateArticle(params.slug, postData) : await createArticle(postData)
        this.submitDisabled = false
      }
    }
  }
</script>

<style>

</style>