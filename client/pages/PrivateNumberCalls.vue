<template>
  <div>
    <div class="header">
      <span>号码A：{{ binding.phoneNumberA }}</span>
      <span>号码B：{{ binding.phoneNumberB }}</span>
      <span>虚拟号码：{{ binding.virtualNumber }}</span>
      <span>绑定时间：{{ binding.createdAt }}</span>
    </div>
    <br><br>

    <Table :columns="columns" :data="calls">
      <template slot-scope="{ row }" slot="callingAt">
        {{ row.callingAt | datetime }}
      </template>
      <template slot-scope="{ row }" slot="connectedAt">
        {{ row.connectedAt | datetime }}
      </template>
      <template slot-scope="{ row }" slot="hungUpAt">
        {{ row.hungUpAt | datetime }}
      </template>
      <template slot-scope="{ row }" slot="actions">
        <a href="#" @click.prevent.stop="push(row)">推送</a>
      </template>
    </Table>

    <PushModal ref="pushModal" />
  </div>
</template>

<script>
import axios from 'axios'
import PushModal from '@/components/PushModal'

export default {
  name: 'PrivateNumberCalls',
  components: {
    PushModal
  },
  data () {
    return {
      columns: [
        {
          title: '呼叫号码',
          key: 'fromPhoneNumber'
        },
        {
          title: '接听号码',
          key: 'toPhoneNumber'
        },
        {
          title: '虚拟号码',
          key: 'virtualNumber'
        },
        {
          title: '呼叫时间',
          slot: 'callingAt'
        },
        {
          title: '接通时间',
          slot: 'connectedAt'
        },
        {
          title: '挂断时间',
          slot: 'hungUpAt'
        },
        {
          title: '动作',
          slot: 'actions'
        }
      ],
      binding: {},
      calls: []
    }
  },
  async mounted () {
    const bindingId = this.$route.params.bindingId
    
    this.fetchBinding(bindingId)
    this.fetchCalls(bindingId)
  },
  methods: {
    async fetchBinding (bindingId) {
      const response = await axios.get(`/private_numbers/bindings/${bindingId}`)
      this.binding = response.data.privateNumberBinding
    },
    async fetchCalls (bindingId) {
      const response = await axios.get(`/private_numbers/calls?bindingId=${bindingId}`)
      this.calls = response.data.privateNumberCalls
    },
    push (call) {
      // TODO: 尝试用路由创建对话框
      this.$refs.pushModal.show(call)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  > * {
    margin: 24px;
  }
}
</style>
