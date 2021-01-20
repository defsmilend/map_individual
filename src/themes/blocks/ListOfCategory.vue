<template>
  <div>
    <div
      v-if="isShouldHeader"
      class="wrapper-header"
    >
      <p class="header">
        {{ $t(header) }}
      </p>
      <span class="list__counts">{{ headerCounts }}</span>
    </div>
    <ul class="flex list">
      <li
        v-for="item in arrItems"
        :key="item.id"
        class="list__item"
      >
        <router-link
          tag="div"
          :to="item.link"
          class="no-underline link"
        />
        <div class="amount">
          {{ item.count }}
        </div>
        <p>{{ $t(item.name) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ListOfCategory',
  props: {
    title: {
      type: String,
      required: true
    },
    isShouldHeader: {
      type: Boolean,
      required: false,
      default: true
    },
    arrItems: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      header: this.title,
      headerCounts: 0
    }
  },
  beforeMount () {
    this.allCountsTypes(this.arrItems)
  },
  methods: {
    allCountsTypes (arr) {
      this.headerCounts = this.counts(arr)
    },
    counts (arr) {
      const sum = arr.reduce((acc, v) => acc + v.count, 0)
      return sum
    }
  }
}
</script>

<style lang="scss" scoped>
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

.wrapper-header  {
  position: relative;
  width: auto;
  max-width: 100%;
  display: inline-flex;
  margin-top: 10px;
  margin-bottom: 20px;
}

.list {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  flex-wrap: wrap;

  &__counts {
    position: absolute;
    top: 0;
    right: -20px;
    color: #8B8B8B;
    font-family: Verdana;
    font-size: 12px;
    font-weight: bold;
    line-height: 15px;
  }

  &__item {
    position: relative;
    align-items: center;
    text-align: left;
    height: 70px;
    width: 270px;
    border-radius: 5px;
    background-color: #F2F2F2;
    margin-bottom: 15px;
    display: inline-flex;
    align-items: center;
    margin-right: 10px;

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
</style>
