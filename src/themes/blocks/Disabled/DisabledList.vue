<template>
  <div class="flex">
    <template v-for="item in disabledList">
      <link-tile
        :key="item.id"
        :item="item"
        class="mr16"
      />
    </template>
  </div>
</template>

<script>
import LinkTile from 'theme/components/theme/blocks/Disabled/LinkTile.vue'

export default {
  name: 'DisabledList',
  components: {
    LinkTile
  },
  props: {
    disabledList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
