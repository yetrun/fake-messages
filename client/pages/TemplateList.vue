<template>
  <div>
    <p class="add-line">
      <Button type="primary" @click="showModal()">添加</Button>
    </p>
    <br>
    <Table :columns="columns" :data="templates">
      <template slot="category" slot-scope="{ row }">
        {{ row.category === 'Email' ? '邮件' : '短信' }}
      </template>
      <template slot-scope="{ row }" slot="tags">
        <Tag v-for="tag in row.tags" :key="tag" @click.native="addTagFilter(tag)">
          {{ tag }}
        </Tag>
      </template>
      <template slot="operators" slot-scope="{ row, index }">
        <Button type="info" @click="showModal(row)">更新</Button>
        <Button type="error" @click="deleteTemplate(row)">删除</Button>
      </template>
    </Table>
    <Modal v-model="modal.shown" :title="modal.title" :width="960" @on-ok="saveTemplate">
      <Form>
        <FormItem>
          <Input type="text" v-model="modal.template.name" placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem>
          <RadioGroup v-model="modal.template.category">
            <Radio label="Email">
              <Icon type="ios-mail"></Icon>
              <span>邮件</span>
            </Radio>
            <Radio label="Message">
              <Icon type="ios-chatboxes"></Icon>
              <span>短信</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <!--TODO: iview 的 select 组件之坑 -->
          <Select v-model="modal.template.tags" multiple clearable allow-create filterable placeholder="选择标签">
            <Option v-for="tag in modal.template.tags" :value="tag" :key="tag">{{ tag }}</Option>
            <Option value="调皮">调皮</Option>
          </Select>
        </FormItem>
        <FormItem v-if="modal.template.category === 'Email'">
          <Input type="text" v-model="modal.template.subject" placeholder="填写主题"></Input>
        </FormItem>
        <FormItem>
          <RadioGroup v-model="modal.template.contentType">
            <Radio label="text">
              <span>text</span>
            </Radio>
            <Radio label="html">
              <span>html</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Input type="textarea" v-model="modal.template.content" :rows="12" placeholder="填写模板内容，其中变量名用形如 %{VAR} 的格式表示"></Input>
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
          title: '类别',
          slot: 'category'
        },
        {
          title: '标签',
          slot: 'tags'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '主题',
          key: 'subject'
        },
        {
          title: '格式',
          key: 'contentType'
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
      modal: {
        title: '',
        template: {
          tags: []
        },
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
        this.modal.template = Object.assign({}, template)
        this.modal.title = '更新模板'
      } else {
        this.modal.template = {
          category: 'Email',
          contentType: 'text',
          tags: []
        }
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
