<template>
  <Modal v-model="visible" title="推送通话记录" footer-hide>
    <Form>
      <FormItem prop="user">
        <Input type="text" v-model="pushUrl" @on-search="push" search enter-button="推送" placeholder="Enter something..." />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PushModal',
  data () {
    return {
      visible: false,
      call: {},
      pushUrl: ''
    }
  },
  methods: {
    show (call) {
      this.visible = true
      this.call = call
    },
    async push () {
      try {
        await axios.post(`/private_numbers/calls/${this.call.id}/push`, { pushUrl: this.pushUrl })
        this.$Message.success('推送成功')
      } catch (err) {
        this.$Message.error('推送失败')
      } finally {
        this.visible = false
      }
    }
  }
}
</script>
