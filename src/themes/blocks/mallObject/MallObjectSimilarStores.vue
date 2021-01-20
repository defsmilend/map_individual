<template>
  <div>
    <p class="title fs24 lh25 cl-black weight-700 mt0 pt0">
      {{ $t('Similar stores') }}
    </p>
    <template v-if="mallFilterArray && mallFilterArray.length">
      <div
        v-for="mallObject in mallFilterArray"
        :key="mallObject.id"
        class="category-mall-object pb5"
      >
        <category-mall-object :item="mallObject" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CategoryMallObject from 'theme/components/theme/blocks/category/CategoryMallObject.vue'

export default {
  name: 'MallObjectSimilarStores',
  components: {
    CategoryMallObject
  },
  props: {
    mallFilterArray: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
