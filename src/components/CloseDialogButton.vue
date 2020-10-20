<template>
  <button class="close-button" @click="$emit('click')"><close-x style="width: 3.2rem; height: 3.2rem;"></close-x></button>  
</template>

<script>
import CloseX from "../assets/x.svg";

export default {
  name: "CloseDialogButton",
  components: { CloseX },
}
</script>

<style scoped lang="scss">
.close-button {
  position: absolute;
  right: -2rem;
  top: -2rem;
  padding: 0.4rem;
  z-index: 100;
  color: get-color(base, 16);
  border: none;
  background-color: rgba(get-color(base, 0), .5);
  background-image: none;
} 
</style>