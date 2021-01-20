
<template>
  <div class="mall-object-card-list">
    <template v-for="(mallObject, index) in mallObjects">
      <div
        :key="index"
        class="mall-object-card"
      >
        <mall-object-card
          :active="currentMallObject.id === mallObject.id"
          :mall-object="mallObject"
        />
      </div>
    </template>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import MallObjectCard from 'theme/components/theme/blocks/mallObject/MallObjectCard.vue'

export default {
  name: 'MallObjectCardList',
  components: {
    MallObjectCard
  },
  props: {
    mallObjects: {
      type: Array,
      required: true
    },
    currentMallObject: {
      type: Object,
      required: true
    }
  }
}
</script>
