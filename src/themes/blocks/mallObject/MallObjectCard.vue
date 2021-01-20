<template>
  <div
    class="mall-object-card pointer bg-cl-white-smoke mb5 px30 py20 border-box brdr-r-5"
    :class="{ active: active, close: isClosed }"
    @click="click"
  >
    <div class="fs16 p5 pl0 weight-700">
      {{ mallObject.name }}
    </div>
    <div class="description fs14 py0 pr5">
      {{ discriptions }}
    </div>
    <div
      v-if="isClosed"
      class="closed fs14 lh15 py0 px5"
    >
      Магазин закрылся 27 мая 2019 года.
    </div>
  </div>
</template>

<script>

export default {
  name: 'MallObjectCard',
  props: {
    mallObject: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      category: []
    }
  },
  computed: {
    categories () {
      return this.category.join(', ')
    },
    isClosed () {
      return this.mallObject.closed
    },
    discriptions () {
      return this.categories.length > 30 ? this.categories.substring(0, 30) + ('...') : this.categories
    }
  },
  beforeMount () {
    if (this.mallObject.categories && this.mallObject.categories.length) {
      for (let i = this.mallObject.categories.length; i > 0; i--) {
        if (this.mallObject.categories[i - 1].active && !this.mallObject.categories[i - 1].hidden) {
          this.category.push(this.mallObject.categories[i - 1].name)
        }
      }
    }
  },
  methods: {
    click () {
      const currentRoute = this.$route
      this.$router.push({
        name: 'mall-object-page',
        query: Object.assign({}, currentRoute.query, {
          mallObject: this.mallObject.id
        }),
        params: currentRoute.params
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-pacific-blue: color(pacific-blue);

.mall-object-card {
  width: 270px;
  height: 108px;
  overflow: hidden;
  &.active {
    background: $color-pacific-blue;
  }
  &.close {
    opacity: 0.4;
  }
  .closed{
    width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
