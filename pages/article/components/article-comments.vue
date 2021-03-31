<template>
  <div>
    <form class="card comment-form" @submit.prevent="addComment">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." v-model="comment.body" rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="$store.state.user ? $store.state.user.image : null" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled='commentDisabled'>
          Post Comment
        </button>
      </div>
    </form>
    <div 
      class="card"
      v-for="(comment, index) in comments"
      :key="comment.id"
      >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{ name:'profile', params: { username: comment.author.username } }" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{ name:'profile', params: { username: comment.author.username } }" class="comment-author">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span class="mod-options" v-if='comment.author.username === $store.state.user.username'>
          <i class="ion-trash-a" @click="!deleteDisabled && deleteComment(comment, index)"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
  import { getComments, addComment, deleteComments } from '@/api/article'
  export default {
    name: 'ArticleComments',
    props: {
      article: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        comments: [], // 文章列表
        comment: {
          body: ''
        },
        commentDisabled: false,
        deleteDisabled: false
      }
    },
    async mounted () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    methods: {
      async addComment () {
        this.commentDisabled = true
        const { data } = await addComment(this.article.slug, this.comment)
        this.comment.body = ''
        this.comments.unshift(data.comment)
        this.commentDisabled = false
      },
      async deleteComment (comment, index) {
        this.deleteDisabled = true
        console.log(comment)
        await deleteComments(this.article.slug, comment.id)
        this.comments.splice(index, 1)
        this.deleteDisabled = false
      }
    }
  }
</script>

<style>

</style>