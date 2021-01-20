<template>
  <div class="keyboard pt100 weight-900">
    <div
      v-if="isInput"
      class="field bg-cl-white brdr-r-40 brdr-3 brdr-cl-black mb20 flex middle-xs between-xs relative"
    >
      <base-input
        :value="searchText"
        :class="{ pl40: !searchText }"
        class="search-input"
        type="text"
        focus
        autocomplete="off"
        :placeholder-inner="placeholder"
        :class-placeholder="true"
        @input="typeSymbol('add', $event[$event.length - 1])"
        @keyup.delete="typeSymbol('delete')"
      />
      <div
        v-if="!searchText"
        class="search-icon absolute"
      />
      <div
        v-show="searchText"
        class="button-wrapper flex middle-xs cross"
      >
        <div
          class="reset bg-cl-white brdr-r-40 cl-white fs31 center-xs lh28 pointer"
          @click="typeSymbol"
        >
          +
        </div>
      </div>
    </div>
    <div class="keyboard-wrap py35 relative">
      <div
        class="flex symbols-wrapper relative"
        :class="{ 'eng-theme': symbol === 'en', 'ru-theme' : symbol === 'ru', 'funny-theme' : symbol === 'funny', 'numbers-theme' : symbol === 'numbers' }"
      >
        <div
          v-for="(el, index) in keyboardData"
          :key="index"
          class="symbol brdr-r-30 bg-cl-gray2 fs14 lh46 uppercase center-xs mx5 mb10 pointer"
          @click="typeSymbol('add', el.symbol)"
        >
          {{ el.symbol }}
        </div>
        <div
          class="delete bg-cl-burn brdr-r-40 absolute pointer"
          @click="typeSymbol('delete')"
        />
        <div
          v-if="isInput"
          class="search-second cl-white bg-cl-mountain-meadow brdr-r-40 absolute pointer lh45 uppercase center-xs"
          @click="searchByText"
        >
          {{ $t('search') }}
        </div>
      </div>
      <div class="flex center-xs fs14 mt10 pl45">
        <div
          class="eng bg-cl-gray2 brdr-r-40 lh46 pointer"
          @click="switchLanguage"
        >
          {{ symbol === 'ru' ? 'ENG' : 'RUS' }}
        </div>
        <div
          class="space bg-cl-white-smoke2 brdr-r-40 mx10 pointer"
          @click="typeSymbol('space')"
        />
        <div
          class="funny bg-cl-gray2 brdr-r-40 lh46 pointer"
          @click="switchBySymbol('funny')"
        >
          #%+
        </div>
        <div
          class="number bg-cl-gray2 brdr-r-40 lh46 ml10 pointer"
          @click="switchBySymbol('numbers')"
        >
          123
        </div>
      </div>
      <div class="keyboard-footer absolute" />
    </div>
  </div>
</template>

<script>
import keyboard from 'theme/resource/keyboard.json'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Keyboard',
  components: {
    BaseInput
  },
  props: {
    isInput: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      keyboard,
      symbol: 'ru'
    }
  },
  computed: {
    ...mapState({
      searchText: state => state.keyboard.text
    }),
    keyboardData () {
      return this.keyboard[this.symbol]
    },
    placeholder () {
      return this.$t('What are we looking for?')
    }
  },
  beforeMount () {
    if (this.$route.query.searchText && this.$route.query.searchText.length) {
      this.setText(this.$route.query.searchText || '')
    }
  },
  beforeDestroy () {
    this.$bus.$off('reset-search-text', this.resetField)
  },
  methods: {
    ...mapActions('keyboard', ['setText', 'removeSymbol']),
    typeSymbol (method, symbol) {
      const methodAddSymbol = method === 'add' || method === 'space'
      if (this.searchText.length < 50 || !methodAddSymbol) {
        let text = this.searchText
        if (method === 'add') {
          text += symbol
        } else if (method === 'delete') {
          text = text.slice(0, -1)
        } else if (method === 'space') {
          text += ' '
        } else {
          text = ''
        }
        this.setText(text)
        this.$emit('change-input')
      }
    },
    searchByText () {
      this.$emit('search-by-text')
    },
    switchLanguage () {
      this.symbol = this.symbol === 'ru' ? 'en' : 'ru'
    },
    switchBySymbol (value) {
      this.symbol = value
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $yellow: color(yellow);
  $dove-gray: color(dove-gray);

  .keyboard {
    width: 890px;
    margin: 0 auto;
  }
  .symbols-wrapper {
    max-width: 665px;
    flex-wrap: wrap;
    min-height: 165px;
    padding-right: 126px;
    margin: 0 auto;
    user-select: none;
  }
  .symbol {
    width: 45px;
    height: 45px;
  }
  .search-second {
    top: 55px;
    right: 58px;
    height: 45px;
    width: 97px;
  }
  .eng {
    width: 70px;
    height: 45px;
    margin-left: -50px;
  }
  .space {
    width: 392px;
    height: 45px;
  }
  .funny, .number {
    width: 65px;
    height: 45px;
  }
  .ru-theme {
    .symbol {
      &:nth-child(13) {
        margin-left: 32px;
      }
      &:nth-child(24) {
        margin-left: 115px;
      }
    }
  }
  .eng-theme {
    margin: 0;
    .symbol {
      &:nth-child(1) {
        margin-left: 115px;
      }
      &:nth-child(11) {
        margin-left: 143px;
      }
      &:nth-child(20) {
        margin-left: 217px;
      }
    }
  }
  .funny-theme {
    .symbol {
      width: 60px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      &:nth-child(1) {
        margin-left: 15px;
      }
      &:nth-child(10) {
        margin-left: 116px;
      }
    }
  }
  .numbers-theme {
    .symbol {
      width: 70px;
      height: 70px;
      border-radius: 50px;
      line-height: 74px;
      font-size: 20px;
      &:nth-child(1) {
        margin-left: 143px;
      }
      &:nth-child(7) {
        margin-left: 182px;
      }
    }
  }
.keyboard-wrap {
  box-sizing: border-box;
  border-radius: 40px 40px 0 0;
  background-color: $yellow;
  left: 2px;
  & > div {
    -webkit-font-smoothing: subpixel-antialiased;
    transform: translateZ(0) scale(1.0, 1.0);
  }
}
.keyboard-footer {
  left: 0;
  bottom: -45px;
  width: 100%;
  height: 50px;
  background-color: $yellow;
  z-index: -1;
}
.field {
  height: 60px;
}
.search-input /deep/ input {
  margin-left: 25px;
  box-sizing: border-box;
  width: 95%;
  font-weight: bold;
  font-family: Verdana;
  &::placeholder {
    font-size: 20px;
    line-height: 24px;
    font-family: Verdana;
    color: $dove-gray;
    text-transform: none;
  }
}
</style>
