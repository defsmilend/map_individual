<template>
  <div class="mall-object-closed relative">
    <div class="m40">
      <div class="title">
        <p class="fs24 lh25 mb15 weight-700">
          {{ mallObject.company.name }}
        </p>
        <p class="fs20 lh25 mt0">
          {{ mallObject.categories[0].name }}
        </p>
      </div>
      <div class="placeholder flex center-xs absolute">
        <img
          src="/assets/placeholders/shop-closed.png"
          alt="Магазин закрыт"
        >
      </div>
      <div class="discription mb20">
        <p class="fs20 lh25 mb15">
          Магазин закрылся 27 мая 2019 года.
        </p>
        <p class="fs20 lh25 mt0">
          {{ $t('We have stores selling similar products.') }}
        </p>
      </div>
      <div>
        <mall-object-tag :mall-object="mallObject" />
      </div>
    </div>
  </div>
</template>

<script>
import MallObjectTag from 'theme/components/theme/blocks/mallObject/MallObjectTag.vue'

export default {
  name: 'MallObjectClosed',
  components: {
    MallObjectTag
  },
  props: {
    mallObject: {
      type: Object,
      required: true
    }
  },
  computed: {
    categories () {
      return this.mallObject.categories
    }
  }
};
</script>

<style lang="scss" scoped>
.mall-object-closed {
  height: auto;
  .title {
    min-height: 115px;
    margin-bottom: 147px;
  }
  .discription{
    height: 181px;
    overflow: hidden;
  }
  .placeholder{
    width: 270px;
    height: 150px;
    top: 95px;
    left: 50%;
    transform: translateX(-50%);
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
