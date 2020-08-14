<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title" @click="toSeller">
        nuxt-template
      </h1>
      <h2 class="subtitle">
        My phenomenal Nuxt.js project
      </h2>
      <div class="tttttt">
        <div v-for="(item, key) in $cmsConfig" :key="key">
          {{ item.messageKey }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  name: 'home',
  components: {
    Logo
  },
  async fetch ({ store }) {
    await store.dispatch('app/getCMSConfig')
  },
  mounted() {
    // this.getList()
  },
  methods: {
    // async getList () {
    //   await this.$store.dispatch('app/getCMSConfig')
    // },
    toSeller(){
      this.$router.push('/seller')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: $content-color-base
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
