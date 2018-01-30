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
      loading: false,
      itemsPerPage: 10,
      currentPage: 1,
      url: null,
      urlName: '',
      criteria: '',
      checkedArts: []
    };
  },
  props: {

  },
  mounted() {
    this.$store.dispatch('articles/getArticlesFromDB');
  },
  computed: {
    ...mapState({ articles: ({articles: {list}}) => list }),
    checked() {
      const checkedArts = this.articles.map(el => {
        this.checkedArts.forEach(id => {
          el.checked = id === el.id;
        });
        return el;
      });
      return checkedArts;
    },
    filteredArts() {
      return this.checked.filter(el => new RegExp(this.criteria, 'gi').test(el.model));
    },
    arts() {
      return this.cutItems(this.filteredArts, this.currentPage);
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
    inverseChecked() {
      const a = this.articles;
      const ca = this.checkedArts;
      if (ca.length) {
        this.checkedArts = a.filter(el => !ca.some(id => el.id === id)).map(el => el.id) || [];
      } else {
        this.checkedArts = a.map(el => el.id);
      }
    },
    mainPicture(art) {
      const p = '_';
      const pp = '__';
      const maybyObj = (art.picture instanceof Array ? art.picture : []).find(el => el[`${p}main`]) || {};
      return maybyObj[`${pp}text`];
    },
    uploadXML({ target: { files } }) {
      this.loading = true;
      const fr = new FileReader();
      fr.readAsText(files[0], 'utf-8');
      fr.onload = o => {
        const srcXML = o.target.result;
        this.$store.dispatch('articles/uploadXML', srcXML);
        this.loading = false;
       // document.getElementById('download').click();
      };
    },
    selectArt(art) {
      this.checkedArts[art.id] = !this.checkedArts[art.id];
    },
    removeChecked() {
      if (!this.checkedArts.length) {
        return;
      }
      const sure = confirm('ВЫ ПОТЕРЯЕТЕ ВСЕ ДАННЫЕ!!');
      if (sure) {
        const dsure = confirm('ВЫ УВЕРЕННЫ??');
        if (dsure) {
          const tsure = confirm('ВЫ ТОЧНО УВЕРЕННЫ????');
          if (tsure) {
            this.loading = true;
            if (this.checkedArts.length === this.articles.length) {
              this.$store.dispatch('articles/removeAll');
            } else {
              this.$store.dispatch('articles/removeChecked', this.checkedArts);
              this.checkedArts = [];
            }
            this.loading = false;
          }
        }
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
