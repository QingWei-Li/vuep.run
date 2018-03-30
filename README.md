# vuep.run

> 🏃 Online SFCs editor for Vue

website: https://vuep.run

![image](https://user-images.githubusercontent.com/7565692/38118819-ecd05922-33ef-11e8-901d-f9bda9ab71ab.png)

## Features

* No backend
* Support ES modules
* Load file from URL
* Preload packages from `?pkg=`

## Demo

* https://vuep.run/QingWei-Li/vue-trend/docs/home.vue
* https://vuep.run/QingWei-Li/vuep.run/examples/element-ui.vue?pkg=element-ui&css=element-ui/lib/theme-chalk/index.css

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

## Roadmap

* CSS preprocessor
* HTML preprocessor

## Inspired

* [Codepan](https://codepan.net)

## License

MIT
