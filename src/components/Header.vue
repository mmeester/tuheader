<script setup>
import { ref, computed } from 'vue';

import gql from 'graphql-tag';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
});

const state = ref('idle');
const username = ref('');
const roles = ref([]);

if(props.endpoint) { 
  // HTTP connection to the API
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: props.endpoint,
  })

  // Cache implementation
  const cache = new InMemoryCache()

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  })

  let query = gql`
    query CurrentUser {
      CurrentUser {
        username
        roles {
            id
        }
      }
    }
  `
  apolloClient.query({query}).then((results) => {
      if (results.data.CurrentUser) {
          state.value = 'logged-in';
          username.value = results.data.CurrentUser.username;
          roles.value = results.data.CurrentUser.roles;
      }else { 
          state.value = 'not-logged-in';
      }
  })
}

const isLoggedIn = computed(() => {
    return state.value === 'logged-in';
})

const displayRights = computed(() => {
    return roles.value.map((role) => role.id).join(', ');
})

</script>

<template>
  <header>
    <h1>TU Header</h1>
    <div v-if="isLoggedIn">Ingelogd: {{ username }} | rechten: {{ displayRights }}</div>
  </header>
</template>

<style scoped>
header { 
  background-color: #007d30;
  color: #fff;
  padding: 10px;
  
}
</style>