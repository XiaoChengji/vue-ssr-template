<template>
  <div class="body">
    <div class="content">
      <div v-for="(item, key) in list" :key="key" class="item" @click.stop="handleClick(item)">
        <div class="item-t">{{ item.name }}</div>
        <div class="item-d">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    asyncData ({ store, route }) {
      // hasn't this
      console.log('asyncData')
      return store.dispatch('getList')
    },
    data () {
      return {}
    },
    computed: {
      list () {
        return this.$store.getters.list
      }
    },
    created() {
      // 如此处输出window，NodeJS 会提示未定义异常
      // console.log('created', global)
    },
    mounted() {
      /* 客户端数据预取演示代码 start */
      // this.dataPromise.then(res => {
      //   console.log('res', res)
      // })
      /* 客户端数据预取演示代码 end */
      console.log('mounted', window, document)
    },
    methods: {
      handleClick(data) {
        window.location.href = '/detail?id=' + data.id
      }
    }
  }
</script>
<style>
  .body {
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    color: #333;
  }
  .item {
    overflow: hidden;
    margin: 20px;
    font-size: 14px;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }
  .item-d {
    margin: 8px 0;
    font-size: 12px;
    color: #ccc;
  }
</style>
