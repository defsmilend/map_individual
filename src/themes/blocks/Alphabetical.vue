<template>
  <div class="alphabetical">
    <tb-skeleton
      v-for="i in 5"
      v-show="showLoader"
      :key="i"
      theme="gradient"
      style="padding-bottom: 108px; border-radius: 5px; margin-bottom: 5px"
      bg-color="#f2f2f2"
    />
    <template v-if="!showLoader">
      <p class="fs16 weight-700 title mt0">
        {{ $t('Alphabetical search') }}
      </p>
      <div class="flex fl-start symbol-wrapper uppercase">
        <div class="flex fl-start w-100">
          <transition-group
            name="move-opacity"
            class="flex w-100 fl-start"
          >
            <template v-for="value in alphabetical">
              <div
                v-if="checkNumber(value.key)"
                :key="value.key"
                class="symbol lh45 bg-cl-gray2 align-center brdr-r-40 fs16 weight-700 mr5 mb5 pointer"
                @click="changeSymbol(value.key)"
              >
                <div class="mb20 symbol">
                  <div
                    class="cl-blue3"
                    :class="{'active': value.key === $route.query.searchText}"
                  >
                    {{ value.key }}
                  </div>
                </div>
              </div>
            </template>
          </transition-group>
        </div>
        <div class="flex fl-start w-100">
          <transition-group
            name="move-opacity"
            class="flex w-100 fl-start"
          >
            <template v-for="value in alphabetical">
              <div
                v-if="checkEnSymbol(value.key)"
                :key="value.key"
                class="symbol lh45 bg-cl-gray2 align-center brdr-r-40 fs16 weight-700 mr5 mb5 pointer"
                @click="changeSymbol(value.key)"
              >
                <div class="mb20">
                  <div
                    class="cl-blue3"
                    :class="{'active': value.key === $route.query.searchText}"
                  >
                    {{ value.key }}
                  </div>
                </div>
              </div>
            </template>
          </transition-group>
        </div>
        <div class="flex fl-start w-100">
          <transition-group
            name="move-opacity"
            class="flex w-100 fl-start"
          >
            <template v-for="value in alphabetical">
              <div
                v-if="checkRuSymbol(value.key)"
                :key="value.key"
                class="symbol lh45 bg-cl-gray2 align-center brdr-r-40 fs16 weight-700 mr5 mb5 pointer"
                @click="changeSymbol(value.key)"
              >
                <div class="mb20">
                  <div
                    class="cl-blue3"
                    :class="{'active': value.key === $route.query.searchText}"
                  >
                    {{ value.key }}
                  </div>
                </div>
              </div>
            </template>
          </transition-group>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  name: 'Alphabetical',
  props: {
    alphabetical: {
      type: Array,
      required: true
    },
    showLoader: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    changeSymbol (symbol) {
      this.$emit('change-symbol', symbol)
    },
    checkNumber (number) {
      let reg = /\d/
      return reg.test(number)
    },
    checkRuSymbol (ruSymbol) {
      let reg = /[а-я]/i
      return reg.test(ruSymbol)
    },
    checkEnSymbol (enSymbol) {
      let reg = /[a-z]/i
      return reg.test(enSymbol)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $black: color(black);

  .alphabetical {
    width: 188px;
  }
  .symbol-wrapper {
    position: relative;
    max-height: 555px;
    overflow-y: scroll;
  }
  .title {
    width: 100px;
  }
  .symbol {
    width: 45px;
    height: 45px;
    &:last-child {
      margin-bottom: 15px;
    }
  }
  .active {
    color: $black;
  }
</style>
