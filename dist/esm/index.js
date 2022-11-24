import { ref, computed, openBlock, createElementBlock, createElementVNode, toDisplayString, withModifiers } from 'vue';
import gql from 'graphql-tag';
import { createHttpLink, InMemoryCache, ApolloClient } from '@apollo/client/core';

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var _templateObject;
var script = {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  setup: function setup(props) {
    var state = ref('idle');
    var username = ref('');
    var roles = ref([]);
    var count = ref(1);
    if (props.endpoint) {
      // HTTP connection to the API
      var httpLink = createHttpLink({
        // You should use an absolute URL here
        uri: props.endpoint
      });

      // Cache implementation
      var cache = new InMemoryCache();

      // Create the apollo client
      var apolloClient = new ApolloClient({
        link: httpLink,
        cache: cache
      });
      var query = gql(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    query CurrentUser {\n      CurrentUser {\n        username\n        roles {\n            id\n        }\n      }\n    }\n  "])));
      apolloClient.query({
        query: query
      }).then(function (results) {
        if (results.data.CurrentUser) {
          state.value = 'logged-in';
          username.value = results.data.CurrentUser.username;
          roles.value = results.data.CurrentUser.roles;
        } else {
          state.value = 'not-logged-in';
        }
      });
    }
    var isLoggedIn = computed(function () {
      return state.value === 'logged-in';
    });
    var displayRights = computed(function () {
      return roles.value.map(function (role) {
        return role.id;
      }).join(', ');
    });
    return {
      state: state,
      username: username,
      roles: roles,
      count: count,
      isLoggedIn: isLoggedIn,
      displayRights: displayRights
    };
  }
};

var _hoisted_1 = {
  "class": "tu-header"
};
var _hoisted_2 = {
  key: 0
};
var _hoisted_3 = {
  key: 1
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("header", _hoisted_1, [createElementVNode("h1", null, "TU Header #" + toDisplayString($setup.count), 1 /* TEXT */), $setup.isLoggedIn ? (openBlock(), createElementBlock("div", _hoisted_2, "Ingelogd: " + toDisplayString($setup.username) + " | rechten: " + toDisplayString($setup.displayRights), 1 /* TEXT */)) : (openBlock(), createElementBlock("div", _hoisted_3, "Niet ingelogd:")), createElementVNode("a", {
    href: "#",
    onClick: _cache[0] || (_cache[0] = withModifiers(function ($event) {
      return $setup.count = $setup.count + 1;
    }, ["prevent"]))
  }, "Add count")]);
}

script.render = render;
script.__scopeId = "data-v-61dd7a3d";
script.__file = "src/components/Header.vue";

var TuHeader = {
  install: function install(Vue) {
    Vue.component('TuHeader', script);
  }
};
var TuHeaderComponent = script;

export { TuHeader, TuHeaderComponent, TuHeader as default };
