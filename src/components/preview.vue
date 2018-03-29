<template>
  <div class="preview">
    <div ref="iframe"></div>
  </div>
</template>

<script>
import createIframe from '@/utils/iframe';

const sandboxAttributes = [
  'allow-modals',
  'allow-forms',
  'allow-pointer-lock',
  'allow-popups',
  'allow-same-origin',
  'allow-scripts'
];

export default {
  props: ['value'],

  mounted() {
    this.iframe = createIframe({
      el: this.$refs.iframe,
      sandboxAttributes
    });
  },

  watch: {
    value(val) {
      this.iframe.setHTML(val);
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
