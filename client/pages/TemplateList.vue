<template>
  <div>
    <p class="add-line">
      <Button type="primary" @click="showAddModal">添加</Button>
    </p>
    <br>
    <Table :columns="columns" :data="templates">
      <template slot="operators" slot-scope="{ row, index }">
        <Button type="info" @click="showUpdateModal(row)">更新</Button>
        <Button type="error" @click="deleteTemplate(row)">删除</Button>
      </template>
    </Table>
    <Modal v-model="isAddModalShown" title="新增模板" @on-ok="createTemplate">
      <Form>
        <FormItem>
          <Input type="text" v-model="template.name" placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem>
          <Input type="textarea" v-model="template.content" placeholder="填写模板内容"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isUpdateModalShown" title="更新模板" @on-ok="updateTemplate">
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
          title: 'ID',
          key: 'id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '创建于',
          key: 'createdAt'
        },
        {
          title: '操作',
          slot: 'operators'
        }
      ],
      templates: [],
      template: {},
      isAddModalShown: false,
      isUpdateModalShown: false
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
    },
    updateTemplate () {
      axios.put(`/templates/${this.template.id}`, { template: this.template })
        .then(response => {
          const { template } = response.data
          const i = this.templates.findIndex(temp => temp.id === template.id)
          this.templates.splice(i, 1, template)
        })
        .catch(() => {
          console.error('error', arguments)
        })
    },
    deleteTemplate (template) {
      axios.delete(`/templates/${template.id}`)
        .then(response => {
          const i = this.templates.findIndex(temp => temp.id === template.id)
          this.templates.splice(i, 1)
        })
        .catch(() => {
          console.error('error', arguments)
        })
    },
    showAddModal () {
      this.template = {}
      this.isAddModalShown = true
    },
    showUpdateModal (template) {
      this.template = Object.assign({}, template)
      this.isUpdateModalShown = true
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
