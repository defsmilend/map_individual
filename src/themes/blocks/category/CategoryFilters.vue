<template>
  <div ref="categoryFilters">
    <tb-skeleton
      v-for="i in 15"
      v-show="showLoader"
      :key="i"
      theme="gradient"
      style="padding-bottom: 51px; border-radius: 5px; margin-bottom: 5px; position: relative;"
      bg-color="#f2f2f2"
    />
    <template v-if="isShowFilters">
      <div
        :class="{ 'show-all-filter': isShowFiltersButton }"
      >
        <block-filters-checkbox
          :key="'1'"
          title="categories"
          :filters="categoryFilters"
          filter-name="categoriesFilters"
          name-set-filters="categories.id"
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
    <template v-if="isShowFiltersButton && !showLoader">
      <button-full
        class="all-filters-button absolute"
        @click.native="openModalAllFilters"
      >
        {{ $t('All filters') }}
      </button-full>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BlockFiltersCheckbox from 'theme/components/theme/BlockFiltersCheckbox.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'

export default {
  name: 'CategoryFilters',
  components: {
    BlockFiltersCheckbox,
    ButtonFull
  },
  props: {
    showLoader: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      isShowFiltersButton: false
    }
  },
  computed: {
    ...mapState({
      isOpenModalAllFilters: state => state.modalAllFilters.isShowModal,
      categoryFilters: state => state.categories.categoriesByFilters,
      offers: state => state.config.offers
    }),
    isShowFilters () {
      return !this.showLoader && !this.isOpenModalAllFilters && this.categoryFilters.length
    }
  },
  watch: {
    showLoader () {
      this.isShowButton()
      this.$store.dispatch('filters/setTypes', this.types)
    }
  },
  methods: {
    isShowButton () {
      this.$nextTick(() => {
        let height = this.$refs.categoryFilters.clientHeight
        let maxHeight = 625
        this.isShowFiltersButton = height > maxHeight
      })
    },
    openModalAllFilters () {
      this.$store.dispatch('modalAllFilters/isShow', true)
    }
  }
}
</script>

<style lang="scss" scoped>
div /deep/ label {
  line-height: 19px;
  padding-left: 35px;
  margin-bottom: 15px;
}
.show-all-filter {
  overflow: hidden;
  height: 605px;
  .button-full {
    display: inline;
    min-width: 158px;
  }
}
.show-all-type-theme {
  height: 450px;
  overflow: hidden;
}
.show-all-alphabetical-theme {
  height: 540px;
  overflow: hidden;
}
.all-filters-button /deep/ {
  bottom: 50px;
  right: 0;
  .button-full {
    display: inline;
    min-width: 158px;
  }
}
</style>
