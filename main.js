import HeaderComponent from './src/components/Header.vue';

export const TuHeader = {
  install(Vue) {
    Vue.component('TuHeader', HeaderComponent);
  },
};

export const TuHeaderComponent = HeaderComponent;
export default TuHeader;
