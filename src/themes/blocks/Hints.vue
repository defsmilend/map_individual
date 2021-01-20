<template>
  <div
    class="often-wrapper flex column"
    :class="isShowPropose || isSearchEmpty ? 'center-xs' : 'end-xs'"
  >
    <div
      class="often align-left"
      :class="isShowPropose || isSearchEmpty ? 'mb35' : 'mb20'"
    >
      <template v-if="isShowPropose">
        <h2 class="m0 mb15 align-left fs24 lh30 weight-700">
          {{ $t('Often searched') }}:
        </h2>
      </template>
      <template v-else-if="!isSearchEmpty">
        <h2 class="m0 mb15 align-left fs24 lh30 weight-700">
          {{ $t('Perhaps you are looking') }}:
        </h2>
      </template>
      <no-content v-else />
      <div class="often__list m0 p0 relative">
        <transition-group
          name="move-opacity"
          tag="div"
        >
          <router-link
            v-for="(item, index) in list"
            :key="`${item.id}_${index}`"
            tag="div"
            class="often__item brdr-r-25 mb10 mr10 inline-block py14 px20"
            :to="getItemLink(item)"
            :data-submenu-button="'Тег:' + item.name"
          >
            <div
              class="cl-black fs14 weight-700 lh17 align-center no-underline uppercase"
            >
              {{ item.name | slicer }}
            </div>
          </router-link>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { generateItemLink } from 'theme/helpers'
import NoContent from './NoContent'

export default {
  name: 'Hints',
  components: {
    NoContent
  },
  filters: {
    slicer (value) {
      if (value && value.length > 19) {
        return `${String(value).substring(0, 19)}...`
      } else {
        return value
      }
    }
  },
  props: {
    isShowPropose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      foundItems: state => state.search.items
    }),
    ...mapState('categories', ['categories', 'foundCategories']),
    ...mapGetters('terminals', ['getProposed']),
    isSearchEmpty () {
      return !this.foundItems.length
    },
    list () {
      return this.isShowPropose ? this.getProposed : this.foundItems
    }
  },
  // this need for reset text state, when we navigate between mall-object and hint directly
  mounted () {
    this.$store.dispatch('keyboard/resetText')
  },
  methods: {
    getItemLink (item) {
      if (item.link) {
        return item.link
      } else if (item.landing_type) {
        return item.landing_type
      } else {
        return generateItemLink({item})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $gray2: color(gray2);

  .often-wrapper {
    height: 245px;
    padding-left: 105px;
  }
  .often {
    width: 900px;
    max-width: 1014px;
    overflow: hidden;

    &__list {
      list-style: none;
      max-height: 160px;
    }

    &__item {
      width: auto;
      height: auto;
      background: $gray2;
    }
  }
</style>
