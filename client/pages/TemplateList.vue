<template>
  <div>
    <p class="add-line">
      <Button type="primary" @click="showModal()">添加</Button>
    </p>
    <br>
    <Table :columns="columns" :data="templates">
      <template slot="operators" slot-scope="{ row, index }">
        <Button type="info" @click="showModal(row)">更新</Button>
        <Button type="error" @click="deleteTemplate(row)">删除</Button>
      </template>
    </Table>
    <Modal v-model="modal.shown" :title="modal.title" @on-ok="saveTemplate">
      <Form>
        <FormItem>
          <Input type="text" v-model="modal.template.name" placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem>
          <Input type="textarea" v-model="modal.template.content" placeholder="填写模板内容"></Input>
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
          key: 'id',
          maxWidth: 80
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 120
        },
        {
          title: '内容',
          key: 'content',
          minWidth: 400 
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
      modal: {
        title: '',
        template: {},
        shown: false
      }
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
    createTemplate (template) {
      axios.post('/templates', { template })
        .then(response => {
          const { template } = response.data
          this.templates.push(template)
        })
        .catch(() => {
          console.error('error', arguments)
        })
    },
    updateTemplate (template) {
      axios.put(`/templates/${template.id}`, { template })
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
    saveTemplate () {
      if ('id' in this.modal.template) {
        this.updateTemplate(this.modal.template)
      } else {
        this.createTemplate(this.modal.template)
      }
    },
    showModal (template) {
      this.modal.shown = true
      if (template) {
        this.modal.template = template
        this.modal.title = '更新模板'
      } else {
        this.modal.template = {}
        this.modal.title = '新增模板'
      }
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
