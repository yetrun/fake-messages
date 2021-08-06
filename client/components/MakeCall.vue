<template>
  <Modal v-model="visible" width="360">
    <p slot="header" style="text-align: center">
      <Icon type="ios-call"></Icon>
      <span>拨打电话</span>
    </p>

    <div>
      <Row :gutter="10">
        <Col span="21">
          <Form :label-width="80">
            <FormItem label="呼叫号码">
              <Input v-model="call.fromPhoneNumber" :readonly="true"></Input>
            </FormItem>
            <FormItem label="接听号码">
              <Input v-model="call.toPhoneNumber" :readonly="true"></Input>
            </FormItem>
            <FormItem label="虚拟号码">
              <Input v-model="call.virtualNumber" :readonly="true"></Input>
            </FormItem>
            <FormItem label="等待时间">
              <InputNumber :max="10" :min="1" v-model="call.waitingDuration"></InputNumber>
            </FormItem>
            <FormItem label="通话时间">
              <InputNumber :max="10" :min="1" v-model="call.duration"></InputNumber>
            </FormItem>
          </Form>
        </Col>
        <Col span="2">
          <Form>
            <FormItem>
              <Tooltip content="交换">
                <Button icon="ios-swap" @click="swap" />
              </Tooltip>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'MakeCallModal',
  data () {
    return {
      visible: false,
      call: {}
    }
  },
  methods: {
    show (binding) {
      this.visible = true

      this.call = {
        fromPhoneNumber: binding.phoneNumberA,
        toPhoneNumber: binding.phoneNumberB,
        virtualNumber: binding.virtualNumber
      }
    },
    swap () {
      [this.call.fromPhoneNumber, this.call.toPhoneNumber] = [this.call.toPhoneNumber, this.call.fromPhoneNumber]
    }
  }
}
</script>
