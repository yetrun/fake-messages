<template>
  <Modal v-model="visible" width="360" @on-ok="makeCall">
    <p slot="header" style="text-align: center">
      <Icon type="ios-call"></Icon>
      <span>拨打电话</span>
    </p>

    <div>
      <Form :label-width="80">
        <FormItem label="呼叫号码">
          <Row :gutter="10">
            <Col span="18">
              <Input v-model="call.fromPhoneNumber" :readonly="true"></Input>
            </Col>
            <Col span="6">
              <Button type="warning" @click="swap" >交换</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="接听号码">
          <Row>
            <Col span="18">
              <Input v-model="call.toPhoneNumber" :readonly="true"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="虚拟号码">
          <Row>
            <Col span="18">
              <Input v-model="call.virtualNumber" :readonly="true"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="等待时间">
          <Row :gutter="10">
            <Col span="18">
              <SecondsSelector v-model="duration.connecting" />
            </Col>
            <Col span="6">
              <Button size="default" type="warning" @click="generateRandomTime('connecting')">随机</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="通话时间">
          <Row :gutter="10">
            <Col span="18">
              <SecondsSelector v-model="duration.calling" />
            </Col>
            <Col span="6">
              <Button size="default" type="warning" @click="generateRandomTime('calling')">随机</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import { addSeconds } from 'date-fns'
import axios from 'axios'
import SecondsSelector from './SecondsSelector'

export default {
  name: 'MakeCallModal',
  components: {
    SecondsSelector
  },
  data () {
    return {
      visible: false,
      call: {},
      duration: {
        conneting: 0,
        calling: 0
      }
    }
  },
  methods: {
    show (binding) {
      this.visible = true

      this.call = {
        bindingId: binding.id,
        fromPhoneNumber: binding.phoneNumberA,
        toPhoneNumber: binding.phoneNumberB,
        virtualNumber: binding.virtualNumber
      }
      this.duration = {
        connecting: 0,
        calling: 0
      }
    },
    swap () {
      [this.call.fromPhoneNumber, this.call.toPhoneNumber] = [this.call.toPhoneNumber, this.call.fromPhoneNumber]
    },
    makeCall () {
      const callingAt = new Date()
      const connectedAt = addSeconds(callingAt, this.duration.connecting)
      const hungUpAt = addSeconds(connectedAt, this.duration.calling)

      axios.post(`/private_numbers/calls`, { call: { ...this.call, ...{ callingAt, connectedAt, hungUpAt } } })
    },
    generateRandomTime (prop) {
      this.duration[prop] = Math.floor(Math.random() * 3600)
    }
  }
}
</script>
