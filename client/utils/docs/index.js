import spec from './openapi.yaml'

spec.servers = [
  { url: window.location.origin + '/api' }
]

export default spec 
