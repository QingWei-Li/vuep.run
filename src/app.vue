<template>
  <section class="app">
    <nav class="navbar">
      <span>Vuep.run</span>

      <ul class="list">
        <li>
          <a target="_blank" href="//github.com/qingwei-li/vuep.run">GitHub</a>
        </li>
      </ul>
      <button @click="upload" class="save">Save</button>
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
import isAbsouteUrl from 'is-absolute-url';
import { upload } from '@/utils/store';
import * as params from '@/utils/params';

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
    preview: '',
    code: ''
  }),

  methods: {
    async compile(code) {
      this.code = code;

      if (!code) {
        return;
      }
      const imports = [];
      const { template, script, styles, customBlocks } = parseComponent(code);
      let config;

      if ((config = customBlocks.find(n => n.type === 'config'))) {
        params.clear();
        params.parse(config.content);
      }

      let compiled;
      const pkgs = [];
      let scriptContent = 'exports = { default: {} }';

      if (script) {
        try {
          compiled = window.Babel.transform(script.content, {
            presets: ['es2015', 'es2016', 'es2017', 'stage-0'],
            plugins: [[getImports, { imports }]]
          }).code;
        } catch (e) {
          this.preview = `<pre style="color: red">${e.message}</pre>`;
          return;
        }
        scriptContent = await getPkgs(compiled, imports, pkgs);
      }

      const heads = this.genHeads();
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
        body: '<div id="app"></div>' + scripts.join('\n')
      };
    },

    genHeads() {
      let heads = [];

      params.queryParse(location.search);

      const { pkgs, css, cdn, vue } = params.get();
      const prefix = CDN_MAP[cdn] || CDN_MAP.unpkg;

      return [].concat(
        []
          .concat(vue ? 'vue@' + vue : 'vue', pkgs)
          .map(
            pkg =>
              `<script src=${isAbsouteUrl(pkg) ? '' : prefix}${pkg}><\/script>`
          ),
        css.map(
          item =>
            `<link rel=stylesheet href=${
              isAbsouteUrl(item) ? '' : prefix
            }${item}>`
        )
      );
    },

    async upload() {
      if (!this.code) {
        this.$toasted('No content', {
          type: 'error'
        });
        return;
      }

      const id = await upload(this.code);
      history.pushState({}, '', '/' + id);
      const url = location.href;

      this.$toasted.show(`Hosting in ${url}`, {
        action: {
          text: 'Copy',
          onClick() {
            copy(url);
            Vue.toasted.clear();
          }
        },
        duration: 5000
      });
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
  align-items center

.list
  list-style none
  padding 0
  margin 0 0 0 20px

  a
    text-decoration none
    color #999
    font-size 16px

.save
  border-radius 4px
  color #fff
  border none
  font-size 14px
  height 30px
  background #42b983
  border-bottom 2px solid #349469
  position absolute
  right 20px
  outline none

  &:hover
    opacity 0.8

  &:active
    background #349469

.main
  display flex
  height calc(100vh - 50px)

.panel
  width 50%
</style>
