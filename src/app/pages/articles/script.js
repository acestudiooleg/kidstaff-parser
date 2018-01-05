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
      itemsPerPage: 10,
      currentPage: 1,
      url: null,
      urlName: ''
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
    },
    removeAll() {
      const sure = confirm('ВЫ ПОТЕРЯЕТЕ ВСЕ ДАННЫЕ!!');
      if (sure) {
        const dsure = confirm('ВЫ УВЕРЕННЫ??');
        if (dsure) {
          const tsure = confirm('ВЫ ТОЧНО УВЕРЕННЫ????');
          if (tsure) {
            this.$store.dispatch('articles/removeAll');
          }
        }
      }
    },
    saveAllArticles() {
      const sure = window.confirm('Осторожно, вы не сможете вернуть оригинал какой либо статьи. Вы уверенны?');
      if (sure) {
        this.$store.dispatch('articles/saveAllData').then(() => {
          this.generateXML();
        });
      }
    },
    generateXML() {
      this.$store.dispatch('articles/getNewXml').then(xml => {
        const blob = new Blob([xml], {type: 'application/xml'});
        this.url = URL.createObjectURL(blob);
        this.urlName = `kidstaff_${new Date()}`.replace(/ GMT(.*?)$/, '');
      });
    }
  }
};
