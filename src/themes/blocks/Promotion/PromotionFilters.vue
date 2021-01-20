<template>
  <div class="flex mr30 promotion-filters weight-700 middle-xs">
    <base-radiobutton
      id="1"
      value="active"
      name="filter"
      class="active"
      :checked="activeFilter"
      @change="changeValue"
    >
      {{ $t('Current') }}
    </base-radiobutton>
    <base-radiobutton
      id="2"
      value="for_megacard_holders"
      name="filter"
      class="megacard"
      :checked="activeFilter"
      @change="changeValue"
    >
      {{ $t('Bonuses to MEGACARD holders') }}
    </base-radiobutton>
    <!--    <base-radiobutton-->
    <!--      id="3"-->
    <!--      value="for_the_whole_family"-->
    <!--      name="filter"-->
    <!--      class="for-the-whole-famaly"-->
    <!--      :checked="activeFilter"-->
    <!--      disabled-->
    <!--      @change="changeValue"-->
    <!--    >-->
    <!--      &lt;!&ndash;TODO: value поменять на поле для поиска. и убрать пропс disabled&ndash;&gt;-->
    <!--      {{ $t('For the whole family') }}-->
    <!--    </base-radiobutton>-->
  </div>
</template>

<script>
import BaseRadiobutton from 'theme/components/core/blocks/Form/BaseRadiobutton'

export default {
  name: 'PromotionFilters',
  components: {
    BaseRadiobutton
  },
  props: {
    activeFilter: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeValue (value) {
      this.$emit('change-value', value)
    }
  }
}
</script>

<style scoped lang="scss">
  .promotion-filters {
    height: 55px;
    margin-top: -7px;
  }
  .active {
    width: 155px;
  }
  .megacard {
    width: 187px;
    & /deep/ {
      label:before {
        top: 14px;
      }
      input:checked + label {
        top: 24px;
        &:after {
          top: 21px;
        }
      }
    }
  }
  .for-the-whole-famaly {
    width: 180px;
  }
</style>
