<template>
  <div class="editor">
    <textarea ref="textarea" class="editor">
    </textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import emmet from '@emmetio/codemirror-plugin';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/vue/vue';
import { debounce } from 'throttle-debounce';
import isAbsouteUrl from 'is-absolute-url';

emmet(CodeMirror);
const defaultValue = `<template>
  <div>
    <h2>Hello {{ msg }}</h2>
    <h3>Demo</h3>
    <ul>
      <li v-for="url in urls">
        <a target="_blank" :href="url">{{ url }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    msg: 'Vuep.run',

    urls: [
      'https://vuep.run/QingWei-Li/vue-trend/docs/home.vue',
      'https://vuep.run/QingWei-Li/vuep.run/examples/element-ui.vue?pkg=element-ui&css=element-ui/lib/theme-chalk/index.css',
      'https://vuep.run/vuetifyjs/vuetifyjs.com/blob/dev/examples/ripples/navigationDrawers.vue?pkg=vuetify&css=vuetify/dist/vuetify.min.css'
    ]
  })
}
<\/script>

<style>
div {
  color: #2c3e50;
  font-family: Arial, sans-serif;
}

a {
  color: #42b983;
}
</style>`;

export default {
  data: () => ({
    code: ''
  }),

  methods: {
    async getFileContent(filename) {
      this.$toasted.show('Loading file...');

      let url;
      if (isAbsouteUrl(filename)) {
        url = filename;
      } else if (/^[\w-]+\.\w+/.test(filename)) {
        url = '//' + filename;
      } else {
        // convert url to github raw url
        const repo = filename.match(/^([^\/]+\/[^\/]+)(\/blob\/([\w-]+))?(\S+)$/);
        if (repo[3]) {
          url = `//raw.githubusercontent.com/${repo[1]}/${repo[3]}${repo[4]}`;
        } else {
          url = `//raw.githubusercontent.com/${repo[1]}/master${repo[2]}`;
        }
      }

      if (/github\.com\//.test(url)) {
        url = url
          .replace(/github\.com\//, 'raw.githubusercontent.com/')
          .replace(/\/blob\//, '/');
      }

      try {
        const result = await fetch(url);

        this.$toasted.clear();

        return await result.text();
      } catch (e) {
        this.$toasted.clear();
        this.$toasted.show('File not found', {
          type: 'error',
          duration: 2000
        });
        return null;
      }
    }
  },

  async mounted() {
    const editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'vue',
      theme: 'lucario',
      value: `<template></template>`,
      lineNumbers: true,
      tabSize: 2,
      autofocus: true,
      line: true,
      styleActiveLine: true,
      matchBrackets: true,
      extraKeys: {
        Tab: 'emmetExpandAbbreviation',
        Enter: 'emmetInsertLineBreak'
      }
    });

    editor.on(
      'change',
      debounce(200, () => {
        this.$emit('change', editor.getValue());
      })
    );

    let value;
    if (location.pathname !== '/') {
      value = await this.getFileContent(location.pathname.slice(1));
    }
    value = value || defaultValue;
    editor.setValue(value);

    this.$emit('change', editor.getValue());
  }
};
</script>

<style lang="stylus" scoped>
.editor >>> .CodeMirror
  border 1px solid black
  height 100%
  line-height 1.2rem
</style>
