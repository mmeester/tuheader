# TU micro front-end Header POC

## Install

```shell
$ npm install tu-header --save
```

## Usage

### Component

After a Vue app has been initialized with `createApp()`, you can add a plugin to your application by calling the `use()` method.

Source: [https://v3.vuejs.org/guide/plugins.html#using-a-plugin](https://v3.vuejs.org/guide/plugins.html#using-a-plugin)

```javascript
import { createApp } from 'vue'
import { TuHeader } from 'tu-header';

import App from './App.vue'

const app = createApp(App)
app.use(TuHeader);
app.mount('#app')
```

The component `<TuHeader />` is now available through the app.

### Properties

In the component the following properties are available:

| prop     | type   | description                                            | required |
| -------- | ------ | ------------------------------------------------------ | -------- |
| endpoint | String | GraphQL endpoint the application needs to talk against | `true`   |