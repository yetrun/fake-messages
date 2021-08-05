import EmailList from '@/pages/EmailList.vue'
import EmailDetails from '@/pages/EmailDetails.vue'
import MessageList from '@/pages/MessageList.vue'
import TemplateList from '@/pages/TemplateList.vue'
import Docs from '@/pages/Docs.vue'
import PrivateNumberIndex from '@/pages/PrivateNumberIndex'

export default [
  { name: 'index', path: '/', redirect: { name: 'emails' } },
  { name: 'emails', path: '/emails', component: EmailList },
  { name: 'email', path: '/emails/:id', component: EmailDetails },
  { name: 'messages', path: '/messages', component: MessageList },
  { name: 'private_numbers', path: '/private_numbers', component: PrivateNumberIndex },
  { name: 'templates', path: '/templates', component: TemplateList },
  { name: 'docs', path: '/docs', component: Docs }
]

