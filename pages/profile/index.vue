<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>
              {{profile.bio}}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn" v-if="!isSelf" @click="onFollow">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{profile.following ? 'Unfollow' : 'Follow'}} {{profile.username}}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :class="{ active: tab === 'my_articles' }" :to="{ name:'profile',query: { tab: 'my_articles' } }">
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :class="{ active: tab === 'favorited_articles' }" :to="{ name:'profile',query: { tab: 'favorited_articles' } }">
                  Favorited Articles
                </nuxt-link>
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
                <nuxt-link class="page-link" :to="{ name: 'profile', query: { page: item, tab: tab } }">{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { getProfile, followUser, deleteFollowUser } from '@/api/user'
  import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
  export default {
    middleware: 'authenticated',
    name: 'UserProfile',
    data () {
      return {
        followDisabled: false
      }
    },
    async asyncData ({ params, query }) {
      const { data } = await getProfile(params.username)
      const { profile } = data

      const page = Number.parseInt(query.page || 1)
      const limit = 20
      const { tab = 'my_articles' } = query

      const articlesParams = {
        page,
        limit
      }
      // author
      // favorited
      tab === 'my_articles' 
        ? articlesParams.author = profile.username
        : articlesParams.favorited = profile.username
      const articleRes = await getArticles(articlesParams)
      const { articles, articlesCount } = articleRes.data
      
      articles.forEach(article => article.favoriteDisabled = false)

      return {
        profile,
        articlesCount,
        limit,
        page,
        articles,
        tab
      }
    },
    computed: {
      isSelf () {
        return this.$store.state.user && this.$store.state.user.username === this.profile.username
      },
      totalPage() {
        return Math.ceil(this.articlesCount / this.limit)
      }
    },
    watchQuery: ['page', 'tab'],
    methods: {
      async onFollow() {
        this.followDisabled = true
        const {
          following,
          username
        } = this.profile
        following ? await deleteFollowUser(username) : await followUser(username)
        this.profile.following = !following
        this.followDisabled = false
      },
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