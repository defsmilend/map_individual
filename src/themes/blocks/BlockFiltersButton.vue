<template>
  <div v-if="filters && filters.length">
    <p class="fs29 weight-700 mt0 mb13">
      {{ $t(title) }}
    </p>
    <div class="flex fl-start mb30">
      <div
        v-for="filter in filters"
        :key="filter.id"
        class="mr15 mb15"
      >
        <button-full
          :background="checkFilter(filter.id) ? 'edgewater' : 'gray2'"
          @click.native="changeFilter(filter.id)"
        >
          {{ filter.name }}
        </button-full>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import changeFilter from 'theme/mixins/Filters/changeFilter.js'

export default {
  name: 'BlockFiltersButton',
  components: {
    ButtonFull
  },
  mixins: [changeFilter]
}
</script>

<style scoped>

</style>
