<template>
  <div class="article-meta">
    <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }" class="author">
        {{ article.author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <template v-if="!isSelf">
      <button :class="{ active:article.author.following }" @click="onFollow" class="btn btn-sm btn-outline-secondary"
        :disabled='followDisabled'>
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? 'Unfollow' : 'Follow'}} {{ article.author.username }}<span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button :class="{ active:article.favorited }" @click="onFavorite" class="btn btn-sm btn-outline-primary"
        :favoriteDisabled='favoriteDisabled'>
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-if="isSelf">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to ="{ name: 'editor',params: { slug: article.slug } }">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm" :disabled='deleteDisabled' @click="deleteArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
  import {
    followUser,
    deleteFollowUser
  } from '@/api/user'
  import {
    addFavorite,
    deleteFavorite,
    deleteArticle
  } from '@/api/article'
  export default {
    name: 'ArticleMeta',
    data() {
      return {
        followDisabled: false,
        favoriteDisabled: false,
        deleteDisabled: false
      }
    },
    props: {
      article: {
        type: Object,
        require: true
      }
    },
    computed: {
      isSelf () {
        return this.article.author.username === this.$store.state.user.username
      }
    },
    methods: {
      async onFollow() {
        this.followDisabled = true
        const {
          following,
          username
        } = this.article.author
        following ? await deleteFollowUser(username) : await followUser(username)
        this.article.author.following = !following
        this.followDisabled = false
      },
      async onFavorite() {
        this.favoriteDisabled = true
        if (this.article.favorited) {
          await deleteFavorite(this.article.slug)
          this.article.favorited = false
          this.article.favoritesCount += -1
        } else {
          await addFavorite(this.article.slug)
          this.article.favorited = true
          this.article.favoritesCount += 1
        }
        this.favoriteDisabled = false
      },
      async deleteArticle () {
        this.deleteDisabled = true
        await deleteArticle(this.article.slug)
        this.deleteDisabled = false
        this.$router.push('/')
      }
    }
  }
</script>

<style>

</style>