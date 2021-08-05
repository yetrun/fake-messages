<template>
  <!-- 首页列出绑定的隐私号码 -->
  <div>
    <Table :columns="columns" :data="numberBindings">
      <template slot-scope="{ row }" slot="createdAt">
        {{ row.createdAt | datetime }}
      </template>
      <template slot="actions">
        <a href="#">拨打</a>
      </template>
    </Table>
  </div>
</template>

<script>
import axios from 'axios'

export default ({
  name: 'PrivateNumberIndex',
  data () {
    return {
      columns: [
        {
          title: '号码 A',
          key: 'phoneNumberA'
        },
        {
          title: '号码 B',
          key: 'phoneNumberB'
        },
        {
          title: '虚拟号',
          key: 'virtualNumber'
        },
        {
          title: '绑定时间',
          slot: 'createdAt'
        },
        {
          title: '动作',
          slot: 'actions'
        }
      ],
      numberBindings: [
        {
          phoneNumberA: '199',
          phoneNumberB: '188',
          virtualNumber: '177',
          createdAt: new Date()
        }
      ]
    }
  },
  async mounted () {
    const response = await axios.get('/private_numbers/bindings')
    this.numberBindings = response.data.privateNumberBindings
  }
})
</script>
