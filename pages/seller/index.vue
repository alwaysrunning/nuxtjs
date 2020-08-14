<template>
  <div class="main" @click="requestMore">
    hello world
  </div>
</template>
<script>
export default {
  name: 'SellerHome',
  data (){
    return{
      dialogVisible: false,
    }
  },
  methods: {
    requestMore (){
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button--primary{
  border-color: $primary-color-darker;
  background: $primary-color-darker;
}
.el-button--primary:hover, .el-button--primary:focus {
  border-color: $primary-color-darker;
  background: $primary-color-main;
}
</style>