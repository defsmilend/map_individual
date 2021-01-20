<template>
  <div>
    <tb-skeleton
      v-for="i in 15"
      v-show="showLoader"
      :key="i"
      theme="gradient"
      style="padding-bottom: 51px; border-radius: 5px; margin-bottom: 5px; position: relative;"
      bg-color="#f2f2f2"
    />
    <template v-if="!showLoader && types.length">
      <div class="filters-wrapper">
        <block-filters-checkbox
          :key="'1'"
          title="categories"
          :filters="types"
          filter-name="typeFilters"
          name-set-filters="type_id"
        />
        <block-filters-checkbox
          :key="'2'"
          title="offers"
          :filters="offers"
          filter-name="offersFilters"
          name-set-filters="offers"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BlockFiltersCheckbox from 'theme/components/theme/BlockFiltersCheckbox.vue'

export default {
  name: 'Filters',
  components: {
    BlockFiltersCheckbox
  },
  props: {
    showLoader: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState({
      isUpdateFilters: state => state.filters.isUpdateFilters,
      types: state => state.filters.types || [],
      offers: state => state.config.offers,
      typesByFilters: state => state.mallObjectTypes.typesByFilters
    }),
    ...mapGetters({
      typesAgg: 'search/typesAgg'
    }),
    typeIds () {
      let ids = []
      ids = this.typesAgg && this.typesAgg.length ? this.typesAgg.map(type => type.id) : []
      return Array.from(new Set(ids))
    }
  },
  watch: {
    isUpdateFilters () {
      if (this.isUpdateFilters) {
        this.setTypeFilters()
        this.$store.dispatch('filters/updateFilters', false)
      }
    }
  },
  methods: {
    setTypeFilters () {
      let types = []
      if (this.typesByFilters && this.typesByFilters.length && this.typeIds && this.typeIds.length) {
        this.typeIds.forEach(id => {
          const foundType = this.typesByFilters.find(typeFilter => Number(typeFilter.id) === Number(id))
          if (foundType) {
            types.push({ name: foundType.name, id: foundType.id })
          }
        })
      }
      if (this.types && !this.types.length) {
        this.$store.dispatch('filters/setTypes', types)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .filters-wrapper /deep/ label {
    line-height: 19px;
    padding-left: 35px;
    margin-bottom: 15px;
  }
</style>
