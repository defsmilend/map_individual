<template>
  <div class="info-trans">
    <p class="fs20 mb14 lh25">
      {{ route.description || route.local_description }}
    </p>
    <div class="flex info-trans__rest between-xs">
      <div
        v-if="isRouteDetailedInfoExist"
        class="trans-wrapper pr10 align-left"
      >
        <template v-if="route.fare">
          <h3>{{ $t('Fare') }}:</h3>
          <p>{{ route.fare }} ₽</p>
        </template>
        <template v-if="route.route_mode">
          <h3>{{ $t('Interval') }}:</h3>
          <p>{{ route.route_mode }}</p>
        </template>
        <template v-if="route.travel_time">
          <h3>{{ $t('Average travel time') }}:</h3>
          <p>{{ route.travel_time }}</p>
        </template>
        <template v-if="route.period">
          <h3>{{ $t('Route mode work') }}:</h3>
          <p>
            {{ route.period }}
          </p>
        </template>
      </div>
      <div class="mr20">
        <template v-if="station && station.length">
          <h3 class="fs18 weight-700 mb0">
            {{ $t('Stops on the route') }} № {{ route.name }}
          </h3>
          <ul class="info-trans__list-station pl0">
            <li
              v-for="(item, index) in station"
              :key="index"
              class="fs20 mb10"
            >
              {{ item.trim() }}
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoTrans',
  props: {
    route: {
      type: Object,
      required: true
    }
  },
  computed: {
    station () {
      let stationsText = this.route && this.route.route_from_mall ? this.route.route_from_mall : null
      if (!stationsText) return []
      stationsText = stationsText.replace(/(?:&nbsp;|<br>|<b>|<\/b>)/g, '') // удаление лишнего из строки
      return stationsText ? stationsText.split(/\n| - /) : []
    },
    isRouteDetailedInfoExist () {
      const route = this.route
      return route.fare || route.route_mode || route.travel_time || route.period
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$blue: color(blue);

.info-trans {
  &__rest {
    width: 100%;
    height: auto;
    p {
      font-size: 20px;
      font-weight: normal;
      line-height: 24px;
      margin: 0 0 20px 0;
    }
  }
  .trans-wrapper {
    h3 {
      font-size: 18px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 14px;
    }
  }
  &__list-station {
    list-style: none;
    max-width: 337px;
    min-width: 337px;
    li {
     &:before {
        content: "\2022";
        color: $blue;
        display: inline-block;
        width: 10px;
        margin-left: -4px;
      }
    }
  }
}
</style>
