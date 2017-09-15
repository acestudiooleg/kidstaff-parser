/* ============
 * articles Page
 * ============
 * https://vuejs.org/v2/guide/components.html
 */
import { mapState } from 'vuex';
import SlotMixin from '@/mixins/slot';
import VLayout from '@/layouts/default';
import Editor from '@/components/editor';

export default {
  mixins: [
    SlotMixin,
  ],
  data() {
    return {};
  },
  props: {

  },
  computed: {
    ...mapState({
      articles: (a) => a.list
    })
  },
  components: {
    VLayout,
    Editor
  },
  methods: {
    hello() {
      this.name = 'Hello World Articles';
    },
    uploadXML({ target: { files } }) {
      const fr = new FileReader();
      fr.readAsText(files[0], 'utf-8');
      fr.onload = o => {
        const srcXML = o.target.result;
        this.$store.dispatch('articles/uploadXML', srcXML);
      };
    }
  }
};
