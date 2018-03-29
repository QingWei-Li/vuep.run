<template>
  <section class="app">
    <nav class="navbar">
      <span>vuep.run</span>

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
      const compiled = window.Babel.transform(script.content, {
        presets: ['es2015'],
        plugins: [[getImports, { imports }]]
      });

      const heads = this.genHeads();
      const pkgs = [];
      const scriptContent = await getPkgs(compiled.code, imports, pkgs);
      const scripts = [];

      pkgs.forEach(pkg => {
        scripts.push(
          `<script src=//bundle.run/${pkg.module}${pkg.path}?name=${
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

    getPkgs(str) {
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
      const query = queryParse(location.search);
      const pkgs = this.getPkgs(query.pkg);
      const cdn = CDN_MAP[query.cdn] || query.cdn || CDN_MAP.unpkg;
      const vue = this.getVue(query.vue);

      pkgs.unshift(vue);

      return pkgs.map(pkg => `<script src=${cdn}${pkg}><\/script>`);
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
