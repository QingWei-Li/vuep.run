# Vuep.run

> 🏃 An online playground for Vue

website: https://vuep.run

![image](https://user-images.githubusercontent.com/7565692/38162374-906003e4-3512-11e8-8780-a22350a665fc.png)

## Features

* Support ES modules
* Load file from URL
* Preload packages from `?pkg=`
* Code hosting [demo](https://vuep.run/589869ae)

## Demo

* https://vuep.run/QingWei-Li/vue-trend/docs/home.vue
* https://vuep.run/QingWei-Li/vuep.run/examples/element-ui.vue?pkg=element-ui&css=element-ui/lib/theme-chalk/index.css
* https://vuep.run/qingwei-li/laue/docs/_examples/quick-started.vue?pkg=laue
* https://vuep.run/589869ae

## Params

* `https://vuep.run/[:url]`

Absolute url or short url for GitHub like `:username/:repo/:file`

* `?pkg=[:package]`

Package name. Multiple pacakges separated by `,`. Such as `?pkg=vuetrend,element-ui`

* `&cdn=[:cdn]`

The source of the packages. Default `unpkg` and optional `jsdelivr`.

* `&vue=[:version]`

Vue version. The default is the latest version.

* `&css=[:css]`

Similar to `pkg` but for CSS files, such as `?pkg=element-ui&css=element-ui/lib/theme-chalk/index.css`

## Inspired

* [Codepan](https://codepan.net)

## License

MIT
