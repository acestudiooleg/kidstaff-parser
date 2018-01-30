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
      limits: {
        description: 50000,
        model: 80,
        keywords: 100,
      },
      ckinstance: null,
      original: '',
      edited: {
        description: '',
        model: '',
        keywords: ''
      },
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
    },
    hasErrors() {
      const { description, keywords, model } = this.edited;
      const isDesc = description.length > this.limits.description;
      const isModel = model.length > this.limits.model;
      const isKey = keywords.length > this.limits.keywords;
      return isModel || isKey || isDesc;
    }
  },
  methods: {
    onBlur() {

    },
    confirm(a) {
      return confirm(a);
    },
    isError(modelName) {
      return {error: this.edited[modelName].length > this.limits[modelName]};
    },
    charsLeft(modelName) {
      return this.limits[modelName] - this.edited[modelName].length;
    },
    onFocus(ckinstance) {
      this.ckinstance = ckinstance;
    },
    reset() {
      this.edited = {...this.original};
      this.ckinstance.setData(this.original.description);
      this.ckinstance = null;
    },
    remove() {
      const sure = this.confirm('Осторожно, вы потеряете эту статьи');
      if (sure) {
        this.$store.dispatch('articles/removeArticle', this.original.id);
      }
    },
    resetToOriginal() {
      const sure = this.confirm('Осторожно, вы потеряете все измененные данные для этой статьи');
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
