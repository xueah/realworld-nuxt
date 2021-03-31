<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if='user'>
                <nuxt-link class="nav-link" exact :class="{ active: tab === 'your_feed' }" :to="{ name:'home',query: { tab: 'your_feed' } }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :class="{ active: tab === 'global_feed' }" :to="{ name:'home',query: { tab: 'global_feed' } }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link" exact :class="{ active: tab === 'tag' }" :to="{ name:'home',query: { tab: 'tag', tag: tag } }">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{ name:'profile', params: { username: article.author.username }}"><img
                  :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link :to="{ name:'profile', params: { username: article.author.username }}" class="author">
                  {{article.author.username}}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button @click="onFavorite(article)" 
                class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{ active: article.favorited }"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{ name: 'article', params: { slug: article.slug } }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline" v-for="atag in article.tagList" :key="atag">{{atag}}</li>
              </ul>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li v-for="item in totalPage" class="page-item" :class="{ active: item === page }" :key="item">
                <nuxt-link class="page-link" :to="{ name: 'home', query: { page: item, tag: $route.query.tag, tab: tab } }">{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link :to="{
                name: 'home',
                query: {
                  tab: 'tag',
                  tag: item
                }
              }" class="tag-pill tag-default" v-for="item in tags" :key="item">{{item}}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {
    getArticles,
    getFeedArticles,
    addFavorite,
    deleteFavorite
  } from '@/api/article'
  import {
    getTags
  } from '@/api/tags'
  export default {
    name: 'HomeIndex',
    async asyncData({
      query, store
    }) {
      const page = Number.parseInt(query.page || 1)
      const limit = 20
      // const { data } = await 
      // const { data: tagData } = await getTags()
      const { tag, tab = 'global_feed' } = query
      const loadArticles = store.state.user && tab === 'your_feed'
        ? getFeedArticles
        : getArticles
      const [ articleRes, tagRes ] = await Promise.all([
        loadArticles({
          page,
          limit,
          tag
        }),
        getTags()
      ])
      const { articles, articlesCount } = articleRes.data
      const { tags } = tagRes.data

      articles.forEach(article => article.favoriteDisabled = false)

      return {
        articles,
        articlesCount,
        tags,
        limit,
        page,
        tag,
        tab
      }
    },
    computed: {
      ...mapState(['user']),
      totalPage() {
        return Math.ceil(this.articlesCount / this.limit)
      }
    },
    watchQuery: ['page', 'tag', 'tab'],
    methods: {
      async onFavorite (article) {
        article.favoriteDisabled = true
        if (article.favorited) {
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        } else {
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
        article.favoriteDisabled = false
      }
    }
  }
</script>

<style>

</style>