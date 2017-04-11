import DateTitle from './mixins/date-title'
import DateHeader from './mixins/date-header'
import DateTable from './mixins/date-table'
import DateYears from './mixins/date-years'
import CardActions from '../../mixins/card-actions'

export default {
  name: 'date-picker',

  mixins: [CardActions, DateTitle, DateHeader, DateTable, DateYears],

  data () {
    return {
      tableDate: new Date(this.value ? `${this.value} 12:00:00` : Date.now()),
      originalDate: this.value,
      currentDay: null,
      currentMonth: null,
      currentYear: null,
      isSelected: false,
      isReversing: false
    }
  },

  props: {
    actions: Boolean,
    dark: Boolean,
    dateFormat: {
      type: Function,
      default: val => {
        return new Date(val).toISOString().substring(0, 10)
      }
    },
    days: {
      type: Array,
      default: () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    landscape: Boolean,
    months: {
      type: Array,
      default: () => [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    },
    value: {
      required: true
    }
  },

  computed: {
    inputDate: {
      get () {
        return new Date(this.value ? `${this.value} 12:00:00` : Date.now())
      },
      set (val) {
        this.$emit('input', val ? this.dateFormat(val) : this.originalDate)
      }
    },
    day () {
      return this.inputDate.getDate()
    },
    month () {
      return this.inputDate.getMonth()
    },
    year () {
      return this.inputDate.getFullYear()
    },
    tableMonth () {
      return this.tableDate.getMonth()
    },
    tableYear () {
      return this.tableDate.getFullYear()
    },
    dayName () {
      return this.inputDate ? this.days[this.inputDate.getDay()] : ''
    },
    monthName () {
      return this.inputDate ? this.months[this.month] : ''
    },
    computedTransition () {
      return this.isReversing ? 'v-tab-reverse-transition' : 'v-tab-transition'
    }
  },

  watch: {
    isSelected (val) {
      val && this.$nextTick(() => {
        this.$refs.years.scrollTop = this.$refs.years.scrollHeight / 2 - 165
      })
    },
    tableDate (val, prev) {
      this.isReversing = val < prev
    },
    value (val) {
      if (val) this.tableDate = this.inputDate
      if (!this.$scopedSlots.default && !this.actions) this.originalDate = val
    }
  },

  methods: {
    actionCancel () {
      this.inputDate = this.originalDate
      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    },
    actionOk () {
      this.originalDate = this.value
      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    }
  },

  mounted () {
    const currentDate = new Date(Date.now())
    this.currentDay = currentDate.getDate()
    this.currentMonth = currentDate.getMonth()
    this.currentYear = currentDate.getFullYear()
  },

  render (h) {
    const children = [this.genTitle()]

    if (!this.isSelected) {
      const bodyChildren = []

      bodyChildren.push(this.genHeader())
      bodyChildren.push(this.genTable())
      bodyChildren.push(this.genFooter(this.$scopedSlots.default))

      children.push(h('div', {
        'class': 'date-picker__body'
      }, bodyChildren))
    } else {
      children.push(this.genYears())
    }

    return h('v-card', {
      'class': {
        'date-picker': true,
        'date-picker--dark': this.dark,
        'date-picker--landscape': this.landscape
      },
      props: {
        height: this.landscape ? '310px' : null
      }
    }, children)
  }
}