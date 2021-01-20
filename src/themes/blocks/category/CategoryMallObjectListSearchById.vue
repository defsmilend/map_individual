<template>
  <div class="category-mall-object-list relative">
    <tb-skeleton
      v-for="i in 6"
      v-show="showLoader"
      :key="i"
      theme="gradient"
      style="padding-bottom: 108px; border-radius: 5px; margin-bottom: 5px; max-width: 1132px"
      bg-color="#f2f2f2"
    />
    <template v-if="!showLoader">
      <div
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        class="category-mall-object"
      >
        <category-mall-object-search-by-id
          :item="item"
        />
      </div>
    </template>
  </div>
</template>

<script>

import CategoryMallObjectSearchById from 'theme/components/theme/blocks/category/CategoryMallObjectSearchById.vue'

export default {
  name: 'CategoryMallObjectListSearchById',
  components: {
    CategoryMallObjectSearchById
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    showLoader: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .category-mall-object-list {
    border-radius: 5px;
    align-items: center;

    .category-mall-object {
      padding-bottom: 5px;
      transition: all .5s ease-out;

      &.category-transition {
        @for $i from 10 through 12 {
          &:nth-child(#{$i}) {
            transform: translate(101%, -300%);
          }
        }
      }
    }
  }
  .loader {
    height: 108px;
  }
</style>
