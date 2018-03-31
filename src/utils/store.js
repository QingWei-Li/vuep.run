import Vue from 'vue';
import copy from 'copy-text-to-clipboard';
import { stringify } from 'query-string';

const API = 'https://text.cinwell.com';

export async function upload(text) {
  Vue.toasted.show('Saving...');

  try {
    const result = await fetch(API, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: stringify({
        text,
        hash: 1
      })
    });

    Vue.toasted.clear();
    const url = location.href;
    Vue.toasted.show(`Hosting in ${url}`, {
      action: {
        text: 'Copy',
        onClick() {
          copy(url);
          Vue.toasted.clear();
        }
      },
      duration: 5000
    });

    return await result.text();
  } catch (e) {
    Vue.toasted.clear();
    Vue.toasted.show('Failed: ' + e.message, {
      type: 'error',
      duration: 2000
    });
  }
}

export function downloadURL(hash) {
  return `${API}/${hash}`;
}
