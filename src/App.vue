<template>
  <div id="app">
    <router-link to="login"><ToolkitLogoLocked v-if="!loggedIn" class="app__logo" /></router-link>
    <ToolkitLogoUnlocked v-if="loggedIn" class="app__logo" @click="$store.dispatch('authentication/logout', {})" />
    <router-view></router-view>
  </div>
</template>

<script>
import ToolkitLogoLocked from './assets/toolkit-logo-locked.svg';
import ToolkitLogoUnlocked from './assets/toolkit-logo-unlocked.svg'; 

export default {
  name: 'app',
  components: { ToolkitLogoLocked, ToolkitLogoUnlocked },
  computed: {
    loggedIn () {
      return this.$store.getters['authentication/loggedIn'];
    }
  }
}
</script>

<style lang="scss">
.app__logo {
  height: 120px;
  margin: 0 auto;
  display: block;
}
</style>
