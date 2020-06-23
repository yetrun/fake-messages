<template>
  <div>
    <p class="add-line">
      <Button type="primary" @click="showAddModal = true">添加</Button>
    </p>
    <br>
    <Table :columns="columns" :data="templates">
      <template slot="operators">
        <div>操作</div>
      </template>
    </Table>
    <Modal v-model="showAddModal" title="新增模板" @on-ok="createTemplate">
      <Form>
        <FormItem>
          <Input type="text" v-model="template.name" placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem>
          <Input type="textarea" v-model="template.content" placeholder="填写模板内容"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TemplateList',
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
        },
        {
          title: '操作',
          slot: 'operators'
        }
      ],
      templates: [],
      template: {},
      showAddModal: false
    }
  },
  methods: {
    fetchTemplates () {
      axios.get('/templates')
        .then(response => {
          const data = response.data
          this.templates = data.templates
        })
        .catch(() => {
          console.error('error', arguments);
        })
    },
    createTemplate () {
      axios.post('/templates', { template: this.template })
        .then(response => {
          const { template } = response.data
          this.templates.push(template)
        })
        .catch(() => {
          console.error('error', arguments)
        })
    }
  },
  mounted () {
    this.fetchTemplates()
  }
}
</script>

<style scoped>
.add-line {
  text-align: right;
}
</style>
