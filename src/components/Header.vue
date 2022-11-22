<script setup>
import { ref } from 'vue';

const showMenu = ref(true);
</script>

<template>
  <header v-if="showMenu">
    <h1>My App</h1>
  </header>
</template>
