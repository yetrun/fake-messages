<template>
  <TimePicker :value="formatedTime" @on-change="onChange" />
</template>

<script>
export default {
  name: 'SecondsSelector',
  props: {
    value: {
      type: Number,
      default() { return 0 }
    }
  },
  computed: {
    formatedTime () {
      const totalSeconds = this.value

      const seconds = totalSeconds % 60
      const totalMinutes = (totalSeconds - seconds) / 60

      const minutes = totalMinutes % 60
      const hours = (totalMinutes - minutes) / 60

      return `${hours}:${minutes}:${seconds}`
    }
  },
  methods: {
    onChange (value) {
      const [hours, minutes, seconds] = value.split(':').map(n => parseInt(n))

      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      this.$emit('input', totalSeconds)
    }
  }
}
</script>
