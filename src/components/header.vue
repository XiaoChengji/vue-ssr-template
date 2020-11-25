<template>
  <div class="header">{{ title || '标题' }}</div>
</template>

<script>
  export default{
    data () {
      return {
        title: '炒粉加蛋'
      }
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: #000;
  }
</style>
