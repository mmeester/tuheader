import HeaderComponent from './src/components/Header.vue';

export const TUHeader = {
  install(Vue) {
    Vue.component('TUHeader', TUHeader);
  },
};

export const TUHeaderCompent = HeaderComponent;
export default TUHeader;
