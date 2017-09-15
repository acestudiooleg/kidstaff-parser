/* ============
 * paginator Component
 * ============
 * https://vuejs.org/v2/guide/components.html
 */

import SlotMixin from '@/mixins/slot';

export default {
  mixins: [
    SlotMixin,
  ],
  data() {
    return {
      currentPage: 1,
    };
  },
  props: {
    itemsPerPage: {
      type: Number,
      default: 5
    },
    items: {
      type: Array,
      default: []
    },
    onPageChange: {
      type: Function,
      default: () => 1
    }
  },
  computed: {
    pages() {
      const pages = Math.ceil(this.items.length / this.itemsPerPage);
      return new Array(pages).join('x').split('x').map((_, i) => (i + 1));
    }
  },
  methods: {
    setPage(page) {
      this.currentPage = page;
      this.onPageChange(page);
    },
    nextPage() {
      const maxPage = this.pages.length;
      const next = this.currentPage + 1;
      if (next <= maxPage) {
        this.currentPage = next;
        this.onPageChange(next);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.onPageChange(this.currentPage);
      }
    }
  }
};
