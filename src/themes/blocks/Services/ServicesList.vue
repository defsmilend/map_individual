<template>
  <div v-if="servicesList && servicesList.length">
    <div
      v-for="service in servicesList"
      :key="service.id"
      class="bg-cl-white-smoke px30 mb5 w-100 link-tile-wrapper"
      :class="{'transition-link': isHalf}"
    >
      <link-tile :item="service" />
    </div>
  </div>
</template>

<script>
import LinkTile from 'theme/components/theme/blocks/Services/LinkTile.vue'
export default {
  name: 'ServicesList',
  components: {
    LinkTile
  },
  props: {
    servicesList: {
      type: Array,
      default: () => []
    },
    isHalf: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
  .link-tile-wrapper {
    transition: .4s ease-out;
  }
  .transition-link {
    width: 44.5%;
    @for $i from 4 through 6 {
      &:nth-child(#{$i}) {
        transform: translate(101%, -315%);
      }
    }
  }
</style>
