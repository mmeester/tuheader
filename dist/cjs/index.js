'use strict';Object.defineProperty(exports,'__esModule',{value:true});var vue=require('vue'),gql=require('graphql-tag'),core=require('@apollo/client/core');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var gql__default=/*#__PURE__*/_interopDefaultLegacy(gql);var script = {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const state = vue.ref('idle');
    const username = vue.ref('');
    const roles = vue.ref([]);
    const count = vue.ref(1);
    if (props.endpoint) {
      // HTTP connection to the API
      const httpLink = core.createHttpLink({
        // You should use an absolute URL here
        uri: props.endpoint
      });

      // Cache implementation
      const cache = new core.InMemoryCache();

      // Create the apollo client
      const apolloClient = new core.ApolloClient({
        link: httpLink,
        cache
      });
      let query = gql__default["default"]`
    query CurrentUser {
      CurrentUser {
        username
        roles {
            id
        }
      }
    }
  `;
      apolloClient.query({
        query
      }).then(results => {
        if (results.data.CurrentUser) {
          state.value = 'logged-in';
          username.value = results.data.CurrentUser.username;
          roles.value = results.data.CurrentUser.roles;
        } else {
          state.value = 'not-logged-in';
        }
      });
    }
    const isLoggedIn = vue.computed(() => {
      return state.value === 'logged-in';
    });
    const displayRights = vue.computed(() => {
      return roles.value.map(role => role.id).join(', ');
    });
    return {
      state,
      username,
      roles,
      count,
      isLoggedIn,
      displayRights
    };
  }
};const _hoisted_1 = {
  class: "tu-header"
};
const _hoisted_2 = {
  key: 0
};
const _hoisted_3 = {
  key: 1
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("header", _hoisted_1, [vue.createElementVNode("h1", null, "TU Header #" + vue.toDisplayString($setup.count), 1 /* TEXT */), $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, "Ingelogd: " + vue.toDisplayString($setup.username) + " | rechten: " + vue.toDisplayString($setup.displayRights), 1 /* TEXT */)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, "Niet ingelogd:")), vue.createElementVNode("a", {
    href: "#",
    onClick: _cache[0] || (_cache[0] = vue.withModifiers($event => $setup.count = $setup.count + 1, ["prevent"]))
  }, "Add count")]);
}script.render = render;
script.__scopeId = "data-v-61dd7a3d";
script.__file = "src/components/Header.vue";const TuHeader = {
  install(Vue) {
    Vue.component('TuHeader', script);
  }
};
const TuHeaderComponent = script;exports.TuHeader=TuHeader;exports.TuHeaderComponent=TuHeaderComponent;exports["default"]=TuHeader;