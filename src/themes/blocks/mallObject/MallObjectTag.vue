<template>
  <div>
    <p class="title weight-700 fs20 lh25 mb10">
      {{ $t('Tags:') }}
    </p>
    <div class="tags-area flex fl-start">
      <button-full
        v-for="(tag, index) in tags"
        :key="index"
        class="brdr-r-25 mr15 mb10"
        background="white"
        :title="tag.name.trim()"
        :link="{path: 'category-page', query: { categories: `${tag.id}`}}"
      />
    </div>
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
export default {
  name: 'MallObjectTag',
  components: {
    ButtonFull
  },
  props: {
    mallObject: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    tags () {
      return this.mallObject.categories.filter(tag => !tag.hidden)
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
