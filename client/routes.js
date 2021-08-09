import EmailList from '@/pages/EmailList.vue'
import EmailDetails from '@/pages/EmailDetails.vue'
import MessageList from '@/pages/MessageList.vue'
import TemplateList from '@/pages/TemplateList.vue'
import Docs from '@/pages/Docs.vue'
import PrivateNumberBindings from '@/pages/PrivateNumberBindings'
import PrivateNumberCalls from '@/pages/PrivateNumberCalls'

export default [
  { name: 'index', path: '/', redirect: { name: 'emails' } },
  { name: 'emails', path: '/emails', component: EmailList },
  { name: 'email', path: '/emails/:id', component: EmailDetails },
  { name: 'messages', path: '/messages', component: MessageList },
  { name: 'private_numbers', path: '/private_numbers', redirect: '/private_numbers/bindings' },
  { name: 'private_numbers.bindings', path: '/private_numbers/bindings', component: PrivateNumberBindings },
  { name: 'private_numbers.calls', path: '/private_numbers/bindings/:bindingId/calls', component: PrivateNumberCalls },
  { name: 'templates', path: '/templates', component: TemplateList },
  { name: 'docs', path: '/docs', component: Docs }
]

