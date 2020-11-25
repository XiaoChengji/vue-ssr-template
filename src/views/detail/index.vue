<template>
  <div class="detail">
    <div class="title">{{ cont.name }}</div>
    <div class="author">作者：{{ cont.author }}</div>
    <div class="desc">{{ cont.description }}</div>
    <div class="link">
      <router-link :to="'/detail/second?id=' + id">跳到二级路由</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    asyncData ({ store, route }) {
      return store.dispatch('getDetail', route.query.id)
    },
    data () {
      return {
        id: this.$route.query.id
      }
    },
    computed: {
      cont () {
        return this.$store.getters.detail
      }
    },
    methods: {}
  }
</script>
<style>
  .detail {
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
  .title {
    margin: 20px;
    font-size: 24px;
    font-weight: 700;
  }
  .author {
    margin: 0 20px;
    font-size: 14px;
    color: #ccc;
  }
  .desc {
    margin: 30px 20px;
  }
  .link {
    text-align: center;
  }
</style>
