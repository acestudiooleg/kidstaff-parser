/* ============
 * articles Page
 * ============
 * https://vuejs.org/v2/guide/components.html
 */
import { mapState } from 'vuex';
import SlotMixin from '@/mixins/slot';
import VLayout from '@/layouts/default';
import Editor from '@/components/editor';
import paginator from '@/components/paginator';

export default {
  mixins: [
    SlotMixin,
  ],
  data() {
    return {
      itemsPerPage: 5,
      currentPage: 1
    };
  },
  props: {

  },
  mounted() {
    this.$store.dispatch('articles/getArticlesFromDB');
  },
  computed: {
    ...mapState({
      articles: ({articles: {list}}) => list
    }),
    arts() {
      return this.cutItems(this.articles, this.currentPage);
    },
  },
  components: {
    VLayout,
    Editor,
    paginator
  },
  methods: {
    setPage(page) {
      this.currentPage = page;
    },
    cutItems(items = [], page = 1) {
      const fromI = (page * this.itemsPerPage) - this.itemsPerPage;
      const toI = (page * this.itemsPerPage);

      return items.slice(fromI, toI);
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
