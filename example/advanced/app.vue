<style>
.view {
  transition: all .5s ease;
}
.test-enter, .test-leave {
  opacity: 0;
  transform: translate3d(10px, 0, 0);
}
.v-link-active {
  color: red;
}
[v-cloak] {
  display: none;
}
</style>

<template>
  <div>
    <p v-show="authenticating" style="color:red">Authenticating...</p>
    <h1>App Header</h1>
    <a v-link="/inbox/message/123">inbox</a>
    <a v-link="/about">about</a>
    <a v-link="/user/1234/profile/what">user</a>
    <a v-link="/forbidden">forbidden</a>
    <router-view class="view" v-transition="test" transition-mode="out-in"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      authenticating: false
    }
  }
}
</script>
