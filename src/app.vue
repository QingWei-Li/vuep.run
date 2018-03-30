<template>
  <section class="app">
    <nav class="navbar">
      <span>Vuep.run</span>

      <ul class="list">
        <li>
          <a target="_blank" href="//github.com/qingwei-li/vuep.run">GitHub</a>
        </li>
      </ul>
    </nav>

    <main class="main">
      <editor class="panel" @change="compile"></editor>
      <preview :value="preview" class="panel"></preview>
    </main>
  </section>
</template>

<script>
import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { parseComponent } from 'vue-template-compiler/browser';
import { parse as queryParse } from 'query-string';
import getImports from '@/utils/get-imports';
import getPkgs from '@/utils/get-pkgs';

const CDN_MAP = {
  unpkg: '//unpkg.com/',
  jsdelivr: '//cdn.jsdelivr.net/npm/'
};

export default {
  components: {
    Editor,
    Preview
  },

  data: () => ({
    preview: ''
  }),

  methods: {
    async compile(code) {
      if (!code) {
        return;
      }
      const imports = [];
      const { template, script, styles } = parseComponent(code);
      let compiled;

      try {
        compiled = window.Babel.transform(script.content, {
          presets: ['es2015', 'es2016', 'es2017', 'stage-0'],
          plugins: [[getImports, { imports }]]
        });
      } catch (e) {
        this.preview = `<pre style="color: red">${e.message}</pre>`;
        return;
      }

      const heads = this.genHeads();
      const pkgs = [];
      const scriptContent = await getPkgs(compiled.code, imports, pkgs);
      const scripts = [];

      pkgs.forEach(pkg => {
        scripts.push(
          `<script src=//packd.now.sh/${pkg.module}${pkg.path}?name=${
            pkg.name
          }><\/script>`
        );
      });

      styles.forEach(style => {
        heads.push(`<style>${style.content}</style>`);
      });

      scripts.push(`
      <script>
        var exports = {};
        ${scriptContent}
        var component = exports.default;
        component.template = component.template || ${JSON.stringify(
          template.content
        )}

        new Vue(component).$mount('#app')
      <\/script>`);

      this.preview = {
        head: heads.join('\n'),
        body: `<div id="app"></div>` + scripts.join('\n')
      };
    },

    getArr(str) {
      if (Array.isArray(str)) {
        return str;
      }
      if (typeof str === 'string') {
        return str.split(',');
      }
      return [];
    },

    getVue(version) {
      if (version) {
        return 'vue@' + version;
      } else {
        return 'vue';
      }
    },

    genHeads() {
      let heads = [];
      const query = queryParse(location.search);
      const pkgs = this.getArr(query.pkg);
      const styles = this.getArr(query.css);
      const cdn = CDN_MAP[query.cdn] || query.cdn || CDN_MAP.unpkg;
      const vue = this.getVue(query.vue);

      pkgs.unshift(vue);

      return [].concat(
        pkgs.map(pkg => `<script src=${cdn}${pkg}><\/script>`),
        styles.map(style => `<link rel=stylesheet href=${cdn}${style}>`)
      );
    }
  }
};
</script>

<style src="modern-normalize"></style>
<style lang="stylus" scoped>
.navbar
  height 50px
  border-bottom 3px solid #f0f0f0
  line-height 50px
  font-size 20px
  padding 0 20px
  display flex
  color #2c3e50

.list
  list-style none
  padding 0
  margin 0 0 0 20px

  a
    text-decoration none
    color #999
    font-size 16px

.main
  display flex
  height calc(100vh - 50px)

.panel
  width 50%
</style>
