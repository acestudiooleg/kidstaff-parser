/* ============
 * editor Component
 * ============
 * https://vuejs.org/v2/guide/components.html
 */

import VueCkeditor from 'vue-ckeditor2';

export default {
  components: {
    VueCkeditor
  },
  data() {
    return {
      ckinstance: null,
      original: '',
      edited: '',
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
  mounted() {
    this.original = this.art.description;
    this.edited = this.art.description;
  },
  props: {
    art: Object
  },
  computed: {
    contentEqual() {
      return this.original === this.edited;
    }
  },
  methods: {
    onBlur(e) {
      console.log(this.edited);
      // //this.edited = e.getData();
    },
    onFocus(ckinstance) {
      this.ckinstance = ckinstance;
    },
    reset() {
      this.edited = this.original;
      this.ckinstance.setData(this.original);
      this.ckinstance = null;
    },
    save() {
      console.log('fire');
    }
  }
};
