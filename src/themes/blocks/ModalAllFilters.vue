<template>
  <div class="modal-all-filters w-100 absolute bg-cl-white">
    <div class="flex middle-xs mt5 mb35">
      <h1 class="fs48 m0 pb7 mr65">
        {{ $t('filters') }}
      </h1>
      <button-full
        class="mr20"
        @click.native="apply"
      >
        {{ $t('apply') }}
      </button-full>
      <button-full
        background="burn2"
        @click.native="resetFilters"
      >
        {{ $t('reset filters') }}
      </button-full>
    </div>
    <block-filters-button
      title="categories"
      :filters="categoriesFilters"
      filter-name="categoriesFilters"
      name-set-filters="categories.id"
    />
    <block-filters-button
      title="offers"
      :filters="offersFilters"
      filter-name="offersFilters"
      name-set-filters="offers"
    />
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapState } from 'vuex'
import BlockFiltersButton from 'theme/components/theme/blocks/BlockFiltersButton.vue'

export default {
  name: 'ModalAllFilters',
  components: {
    ButtonFull,
    BlockFiltersButton
  },
  props: {
    categoriesFilters: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      offersFilters: state => state.config.offers
    }),
    routeQuery () {
      return this.$route.query
    },
    routeParams () {
      return this.$route.params
    }
  },
  beforeDestroy () {
    this.$store.dispatch('modalAllFilters/isShow', false)
  },
  methods: {
    apply () {
      this.$store.dispatch('modalAllFilters/isShow', false)
    },
    resetFilters () {
      this.$store.dispatch('filters/resetAllSelectedFilters')
      this.$router.push({
        query: Object.assign({}, this.routeQuery, {
          categoriesFilters: '',
          offersFilters: ''
        }),
        params: this.routeParams
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-all-filters {
    max-width: 1090px;
    min-height: 810px;
    bottom: 0;
    left: 49px;
    z-index: 8;
  }
</style>
