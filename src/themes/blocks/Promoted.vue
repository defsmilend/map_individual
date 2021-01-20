<template>
  <div class="promoted">
    <div class="promoted__h-wrap">
      <p class="header">
        {{ $t(header) }}
      </p>
      <span class="promoted__all-counts">{{ headerCounts }}</span>
    </div>
    <ul class="flex promoted__list">
      <li
        v-for="item in arrBlock"
        :key="item.id"
      >
        <router-link
          tag="div"
          :to="item.link"
          class="no-underline link"
        />
        <div class="amount">
          {{ item.count }}
        </div>
        <img
          class="d-block"
          :src="item.image"
          :alt="item.name"
        >
        <p>{{ $t(item.name) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Promoted',
  props: {
    title: {
      type: String,
      required: true
    },
    blockPromoted: {
      type: Array,
      required: true
    },
    forTotalShops: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      header: this.title,
      headerCounts: 0,
      arrBlock: this.blockPromoted.slice(0, 4)
    }
  },
  beforeMount () {
    this.allCountsTypes(this.arrBlock)
  },
  methods: {
    allCountsTypes (promoArr) {
      this.headerCounts = this.counts(this.forTotalShops.concat(promoArr))
    },
    counts (arr) {
      const sum = arr.reduce((acc, v) => acc + v.count, 0)
      return sum
    }
  }
}
</script>

<style lang="scss" scoped>
.promoted {
  text-align: left;

  .header {
    width: auto;
    color: #000;
    font-family: Verdana;
    font-size: 24px;
    font-weight: bold;
    line-height: 29px;
    text-transform: uppercase;
    margin: 0;
    padding: 0;
  }

  &__h-wrap {
    position: relative;
    width: auto;
    max-width: 100%;
    display: inline-flex;
  }

  &__all-counts {
    position: absolute;
    top: 0;
    right: -20px;
    color: #8B8B8B;
    font-family: Verdana;
    font-size: 12px;
    font-weight: bold;
    line-height: 15px;
  }

  &__list {
    width: 100%;
    margin: 0;
    padding: 18px 0;
    justify-content: space-between;
    align-items: flex-end;
    overflow: hidden;

    li {
      position: relative;
      text-align: left;
      height: 140px;
      width: 270px;
      border-radius: 5px;
      background-color: #F2F2F2;
      margin-right: 14px;

      p {
        margin: 12px 30px;
        color: #000;
        font-family: Verdana;
        font-size: 18px;
        font-weight: bold;
        line-height: 20px;
        word-break: break-word;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 1px;
      }

      img {
        height: 50px;
        width: 50px;
        margin-top: 20px;
        margin-left: 30px;
      }

      .amount {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #8B8B8B;
        font-family: Verdana;
        font-size: 12px;
        font-weight: bold;
        line-height: 15px;
        text-align: right;
      }

      .link {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
}

</style>
