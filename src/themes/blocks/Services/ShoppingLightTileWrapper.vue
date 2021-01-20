<template>
  <div class="flex">
    <shopping-light-tile
      v-for="(item, index) in items"
      :key="index"
      :number="index + 1"
      :description="item.title"
      :size="item.size"
      :image="item.image[item.size]"
      :button="item.button"
    />
  </div>
</template>

<script>
import ShoppingLightTile from 'theme/components/theme/blocks/Services/ShoppingLightTile.vue'

export default {
  name: 'ShoppingLightTileWrapper',
  components: { ShoppingLightTile },
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
