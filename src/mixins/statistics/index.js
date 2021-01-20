import { mapState } from 'vuex'

export default {
  data () {
    return {
      startDate: new Date()
    }
  },
  methods: {
    setStatisticBanners (index, key) {
      if (String(this.config.statistic.activeStatisticCollection) === 'true' && this.collectionTimeDataStatistics) {
        const activeBanner = this.gallery[index]
        const endDate = new Date()
        const interval = Math.round((endDate - this.startDate) / 1000 * 10) / 10
        this.startDate = endDate
        this.$store.dispatch('statistic/setStatisticBanners', { interval, bannerId: activeBanner.id, key, bannerName: activeBanner.title })
      }
    },
    setDateTime (time, tomorrowsday) {
      let date = new Date()
      if (tomorrowsday) {
        date.setDate(date.getDate() + 1)
      }
      return date.setHours(time.slice(0, 2), time.slice(3, 4), '00')
    }
  },
  computed: {
    ...mapState({
      mall: state => state.main.mall || null,
      config: state => state.config
    }),
    collectionTimeDataStatistics: {
      cache: false,
      get: function () {
        const date = new Date()
        const dayOfWeek = date.getDay()
        const currentDate = this.setDateTime(date.toLocaleTimeString('ru-RU').slice(0, 5))
        const tomorrowsday = true
        let workTimeLocal = this.config.activeMall.defautlWorkTime
        if (this.mall && this.mall.work_time_extended_local && this.mall.work_time_extended_local.length) {
          const foundTime = this.mall.work_time_extended_local.find(time => time.weekday === dayOfWeek)
          if (foundTime.from && foundTime.to) {
            workTimeLocal = foundTime
          }
        }
        const from = this.setDateTime(workTimeLocal.from)
        let to = this.setDateTime(workTimeLocal.to)
        to = from >= to ? this.setDateTime(workTimeLocal.to, tomorrowsday) : to

        return currentDate > from && currentDate < to
      }
    }
  }
}
