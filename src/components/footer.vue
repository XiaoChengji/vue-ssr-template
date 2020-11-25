<template>
  <div class="footer">{{ desc || '你已经拉到底部了' }}</div>
</template>

<script>
  export default{
    data () {
      return {
        desc: '—— 炒粉不加蛋，香味少一半 ——'
      }
    },
    methods: {}
  }
</script>
<style scoped>
  .footer {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    color: #ccc;
  }
</style>
