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
    <br>
    <Page :total="pagination.total" :page-size="pagination.perPage" :current="pagination.currentPage" @on-change="pageChanged" />
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
      numberBindings: [],
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
      }
    }
  },
  computed: {
    paginationParams () {
      return {
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      }
    }
  },
  mounted () {
    this.fetchBindings()
  },
  methods: {
    pageChanged (newPage) {
      this.pagination.currentPage = newPage
      this.fetchBindings()
    },
    async fetchBindings () {
      const response = await axios.get('/private_numbers/bindings', { params: this.paginationParams })
      this.numberBindings = response.data.privateNumberBindings
      this.pagination = response.data.pagination
    }
  }
})
</script>
