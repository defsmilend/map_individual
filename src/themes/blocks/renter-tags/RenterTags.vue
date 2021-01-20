<template>
  <div class="tags mt40">
    <ul class="tags-list">
      <template v-for="tag in tags">
        <template v-if="tag.categoriesList && tag.categoriesList.length">
          <li
            :key="tag.id"
            class="tags-item"
          >
            <div
              class="tags-text no-underline"
              @click="generateLink(tag)"
            >
              {{ tag.title }}
            </div>
          </li>
        </template>

        <template v-else-if="tag.mall_object_id">
          <li
            :key="tag.id"
            class="tags-item"
          >
            <router-link
              :to="`/mall-object-page?mallObject=${tag.mall_object_id}`"
              tag="div"
              class="tags-text no-underline"
            >
              {{ tag.title }}
            </router-link>
          </li>
        </template>

        <template v-else-if="tag.link">
          <li
            :key="tag.id"
            class="tags-item"
          >
            <router-link
              :to="tag.link"
              tag="div"
              class="tags-text no-underline"
            >
              {{ tag.title }}
            </router-link>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { generateMenuLink } from 'theme/helpers'
export default {
  name: 'RenterTags',
  props: {
    tags: {
      type: Array,
      required: true
    },
    idsCategory: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      generateMenuLink
    }
  },
  computed: {
    ...mapState({
      mallId: state => state.config.activeMall.mallId
    })
  },
  methods: {
    categoriesIds (categories) {
      return categories.map(category => category.id)
    },
    categoriesTypes (categories) {
      let types = []
      categories.forEach(category => {
        let mallInformation = category.mall_information.find(item => Number(item.mall_id) && Number(item.mall_id) === Number(this.mallId))
        if (mallInformation) {
          types = types.concat(mallInformation.types)
        }
      })
      return Array.from(new Set(types)).filter(v => !!v)
    },
    generateLink (tag) {
      this.$store.dispatch('routeNavigate/setCurrentTitle', { title: tag.title, isBig: false })
      const categoriesList = tag.categoriesList
      const types = this.categoriesTypes(categoriesList).join(',')
      const categoriesFilters = this.categoriesIds(categoriesList).join(',')
      this.$router.push(generateMenuLink({ item: tag, idsCategory: this.idsCategory, types, categoriesFilters }))
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
    color: #000;
    font-family: Verdana;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 15px;
  }
  .tags{
    position: relative;
    bottom: 0;
    left: 0;

    &-wrapper {
      width: 100%;
      height: 100%;
      max-width: 1120px;
      margin: 0 0 90px 40px;
      text-align: left;
      overflow: hidden;
    }

    &-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &-item {
      width: auto;
      height: auto;
      background: #F2F2F2;
      display: inline-block;
      padding: 14px 20px;
      margin-bottom: 10px;
      margin-right: 10px;
      border-radius: 25px;
    }

    &-text {
      color: #000;
      font-family: Verdana;
      font-size: 14px;
      font-weight: bold;
      line-height: 17px;
      text-align: center;
    }
  }
</style>
