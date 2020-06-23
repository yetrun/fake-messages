<template>
  <div>
    <Table :columns="columns" :data="templates"></Table>
  </div>
</template>

<script>
import axios from 'axios'
import websocket from '@/websocket'
import { Table, Page } from 'iview'

export default {
  name: 'TemplateList',
  components: {
    Table,
    Page
  },
  data() { 
    return {
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '时间',
          key: 'createdAt'
        }
      ],
      templates: []
    }
  },
  methods: {
    fetchTemplates () {
      axios.get('/templates')
        .then(response => {
          const data = response.data
          this.templates = data.templates
        })
        .catch(function () {
          console.error('error', arguments);
        })
    }
  },
  created () {
    this.fetchTemplates()
  }
}
</script>

<style scoped>
</style>
