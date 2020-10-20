<template>
<div>
</div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      token: null,
    };
  },
  mounted: function() {
    if(this.$route.query.sso && this.$route.query.sig) {
      let sso = this.$route.query.sso;
      let sig = this.$route.query.sig;
      this.$store.dispatch('authentication/login', { sso: sso, sig: sig });
    }
    else {
      this.$store.dispatch('authentication/startLogin', { returnUrl: 'http://localhost:8080/login' });
    }
  }
}
</script>

<style>

</style>