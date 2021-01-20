<template>
  <section class="opening-hours">
    <h2 class="title mt0">
      {{ $t('Opening hours') }}
    </h2>
    <div class="mall pr20 mb20">
      <h3 class="mall-name fs14 lh14 mt0 mb5">
        {{ `Режим работы МЕГА ${currentMall.name}` }}
      </h3>
      <p class="mall-opening-hours fs14 lh22 my0">
        <span v-html="currentMallWorkTime" />
      </p>
    </div>
    <ul class="p0 m0 row">
      <li
        v-for="(object, i) in anchorTenants"
        :key="i"
        class="mall pr20 mb20"
      >
        <h3 class="mall-name fs14 lh14 mt0 mb5">
          {{ object.name }}
        </h3>
        <p class="mall-opening-hours fs14 lh22 my0">
          <template v-if="object.work_time[0]">
            <span>{{ object.work_time[0].name }}<template
              v-if="!isRoundTheClock(object.work_time[0].name)"
            >:</template></span>
            <template v-if="!isRoundTheClock(object.work_time[0].name)">
              <span>{{ object.work_time[0].work.from }} —</span>
              <span>{{ object.work_time[0].work.to }}</span>
            </template>
          </template>
          <template v-else>
            {{ $t('Store operates under mall opening hours') }}
          </template>
        </p>
        <p
          v-if="object.work_time[1]"
          class="mall-opening-hours fs14 lh22 my0"
        >
          <span>{{ object.work_time[1].name }}:</span>
          <span>{{ object.work_time[1].work.from }} —</span>
          <span>{{ object.work_time[1].work.to }}</span>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OpeningHours',
  computed: {
    ...mapState({
      currentMall: state => state.main.mall,
      anchorTenants: ({ mallObjects }) => mallObjects.anchorTenants
    }),
    currentMallWorkTime () {
      const currentWorkTime = this.currentMall.work_time
      if (currentWorkTime.includes('<br/>')) {
        let formattedWorkTime = currentWorkTime.split('<br/>')
        formattedWorkTime = formattedWorkTime.map((item, index) => {
          if (index === 1) {
            return `${item},<br/>`
          }
          if (index === formattedWorkTime.length - 1) {
            return item
          }
          return `${item},`
        })
          .join(' ')
        return formattedWorkTime
      }
      return currentWorkTime
    }
  },
  methods: {
    isRoundTheClock (string) {
      return string.includes('Круглосуточно')
    }
  }
}
</script>

<style lang="scss" scoped>

.opening-hours {
  max-width: 80%;
}
.mall-list {
  list-style: none;
}
.mall {
  min-width: 200px;
}
.skeleton {
  &:first-child {
    width: 100%!important;
  }
}
</style>
