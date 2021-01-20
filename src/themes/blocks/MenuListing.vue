<template>
  <div
    class="main-content"
    :[dataAttribute]="currentSlug"
  >
    <tb-skeleton
      v-for="i in 12"
      v-show="isMenuLoad"
      :key="i"
      theme="gradient"
      style="padding-bottom: 220px; max-width: 270px;"
      bg-color="#f2f2f2"
      class="inline-block mb12 mr10 brdr-r-5"
    />

    <div
      class="scroll-area mb50 mr30"
      :class="{'shop-list': isShopsAndServices}"
    >
      <div class="list">
        <template v-for="submenu in submenus">
          <template v-if="submenu.categoriesList && submenu.categoriesList.length">
            <category-tile
              :key="submenu.id"
              :categories="submenu.categoriesList"
              :title="submenu.title"
              :image-id="submenu.image_id"
              :show-total="showTotalOnPage"
              :submenu-id="submenu.id"
              :data-submenu-button="'Ссылка на категорию: ' + submenu.title"
            />
          </template>
          <template v-else-if="submenu.mall_object">
            <object-tile
              :key="submenu.id"
              :object="submenu.mall_object"
              :data-submenu-button="`Ссылка на обьект: ${submenu.mall_object ? submenu.mall_object.name : ''}`"
            />
          </template>
          <template v-else-if="submenu.link">
            <link-tile
              :key="submenu.id"
              :link="submenu.link"
              :title="submenu.title"
              :image-id="submenu.image_id"
              :data-submenu-button="'Ссылка: ' + submenu.title"
            />
          </template>
        </template>
      </div>
      <template v-if="isShowTagsAndButton">
        <div class="flex end-xs">
          <template v-if="subtags && subtags.length">
            <renter-tags
              class="w-100 flex"
              :tags="subtags"
              :ids-category="allIdCategory"
            />
          </template>
          <div class="mt50">
            <button-more @click.native="goToAllList" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CategoryTile from 'theme/components/theme/blocks/menus/CategoryTile.vue'
import ObjectTile from 'theme/components/theme/blocks/menus/ObjectTile.vue'
import LinkTile from 'theme/components/theme/blocks/menus/LinkTile.vue'
import RenterTags from 'theme/components/theme/blocks/renter-tags/RenterTags.vue'
import { mapState } from 'vuex'
import ButtonMore from 'theme/components/theme/ButtonMore.vue'

export default {
  name: 'MenuListing',
  components: {
    CategoryTile,
    ObjectTile,
    LinkTile,
    RenterTags,
    ButtonMore
  },
  computed: {
    ...mapState({
      menusDetailed: state => state.menusDetailed.items || [],
      isMenuLoad: state => state.menusDetailed.isLoad,
      menusDetailedIds: state => state.main.mall.menus_detailed || [],
      types: state => state.config.types
    }),
    currentMenu () {
      return this.menusDetailed.find(item => item.code === this.currentSlug)
    },
    dataAttribute () {
      return this.isMenuLoad ? 'data-loading' : 'data-page-loaded'
    },
    submenus () {
      if (this.currentMenu && this.currentMenu.submenus && this.currentMenu.submenus.length) {
        return this.currentMenu.submenus
      } else {
        return []
      }
    },
    showTotalOnPage () {
      return this.currentSlug !== 'megaServices'
    },
    subtags () {
      if (this.currentMenu && this.currentMenu.subtags && this.currentMenu.subtags.length) {
        return this.currentMenu.subtags
      } else {
        return []
      }
    },
    currentSlug () {
      return this.$route.params.slug || this.$route.matched[0].props.default.slug
    },
    isShopsAndServices () {
      return this.currentSlug === 'shopsAndServices'
    },
    isShowTagsAndButton () {
      return this.currentSlug !== 'shopsAndServices' && this.currentSlug !== 'guestsWithChildren'
    },
    linkAllList () {
      return this.currentSlug === 'megaServices' ? 'all-services' : 'category-page'
    },
    allIdCategory () {
      let categories = []
      categories = this.foundCategories(this.submenus)
      categories = categories.concat(this.foundCategories(this.subtags))
      if (categories && categories.length) {
        return Array.from(new Set(categories.map(category => category.id))).join(',')
      } else {
        return ''
      }
    }
  },
  watch: {
    '$route.params.slug': {
      immediate: true,
      handler: function () {
        if (this.menusDetailedIds.length) {
          this.$store.dispatch('menusDetailed/loadMenusDetailed', { menuIds: this.menusDetailedIds })
        }
        this.$store.dispatch('categories/resetCategoriesByFilters')
      }
    }
  },
  methods: {
    goToAllList () {
      this.$store.dispatch('routeNavigate/setCurrentTitle', { title: `all ${this.currentSlug}`, isBig: false })
      this.$router.push(`/${this.linkAllList}?types=${this.types[this.currentSlug]}&categories=${this.allIdCategory}&menuCode=${this.currentSlug}`)
    },
    foundCategories (items) {
      let categories = []
      if (items && items.length) {
        items.forEach(item => {
          if (item.categoriesList && item.categoriesList.length) {
            categories = categories.concat(item.categoriesList)
          }
        })
      }
      return categories
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(4, 270px);
  grid-template-rows: 255px;
  gap: 14px;
  align-items: stretch;
}
.shop-list /deep/ {
  .list {
    grid-template-rows: 216px;
  }
  .link {
    height: 216px;
  }
  .object-name-wrap {
    height: 66px;
  }
  .category-tile-image-wrapper {
    img {
      height: 155px;
      width: auto;
    }
  }
}
</style>
