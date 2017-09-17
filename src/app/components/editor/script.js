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
    this.original = this.art;
    this.edited = {...this.art};
  },
  props: {
    art: Object
  },
  computed: {
    contentEqual() {
      const {model, keywords, description} = this.original;
      const {model: m, keywords: k, description: d} = this.edited;
      return m === model && k === keywords && d === description;
    }
  },
  methods: {
    onBlur(e) {
     // console.log(this.edited);
      // //this.edited = e.getData();
    },
    onFocus(ckinstance) {
      this.ckinstance = ckinstance;
    },
    reset() {
      this.edited = {...this.original};
      this.ckinstance.setData(this.original.description);
      this.ckinstance = null;
    },
    resetToOriginal() {
      const sure = confirm('Осторожно, вы потеряете все измененные данные для этой статьи');
      if (sure) {
        const {_id, id} = this.original;
        this.$store.dispatch('articles/resetToOriginalArticle', {artOriginalId: _id, id}).then((art) => {
          this.original = art;
          this.reset();
        });
      }
    },
    save() {
      const newArt = {...this.art, ...this.edited};
      this.$store.dispatch('articles/saveArticle', newArt);
    }
  }
};
