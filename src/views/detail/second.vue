<template>
    <div>
        <p class="green">详情二级路由</p>
        <div class="link">
            <router-link :to="'/detail/second/third?id=' + id">跳到三级路由</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {
            id: this.$route.query.id
        }
    },
}
</script>
<style>
.green {
    color: green;
}
</style>