<template>
    <div id="app">
    	<x-header></x-header>
    	<keep-alive>
        	<router-view></router-view>
    	</keep-alive>
    	<x-footer></x-footer>
    </div>
</template>
<script>
import Xheader from '@/components/header.vue'
import Xfooter from '@/components/footer.vue'
export default {
    data() {
        return {}
    },
    components: {
      'x-header': Xheader,
      'x-footer': Xfooter
    }
}
</script>
<style>
@import './styles/base.css';
</style>