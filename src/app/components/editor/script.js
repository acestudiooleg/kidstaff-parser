/* ============
 * editor Component
 * ============
 * https://vuejs.org/v2/guide/components.html
 */

import SlotMixin from '@/mixins/slot';
import VueCkeditor from 'vue-ckeditor2';

export default {
  components: {
    VueCkeditor
  },
  data() {
    return {
      content: 'articles',
      config: {
        toolbar: [
          { name: 'clipboard', items: ['Undo', 'Redo'] },
          { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
          { name: 'links', items: ['Link', 'Unlink'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
          { name: 'insert', items: ['Image', 'Table'] },
          { name: 'tools', items: ['Maximize', 'Source'] }
        ],
        height: 300
      }
    };
  },
  props: {

  },
  computed: {

  },
  methods: {
    hello() {
      this.name = 'Hello World Editor';
    }
  }
};
