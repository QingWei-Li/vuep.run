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
  <div>Hello {{ msg }}</div>
</template>

<script>
export default {
  data: () => ({
    msg: 'Vuep.run'
  }) 
}
<\/script>

<style>
div {
  font-size: 20px;
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
        const repo = filename.match(/^([^\/]+\/[^\/]+)(\S+)$/);
        url = `//raw.githubusercontent.com/${repo[1]}/master${repo[2].replace(
          /\/blob\//,
          '/'
        )}`;
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
