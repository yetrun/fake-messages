<template>
  <div>
    <Layout class="layout">
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="activeMenu">
          <div class="layout-logo">Fake Messages</div>
          <div class="layout-nav">
            <div>
              <MenuItem name="emails" :to="{ name: 'emails' }" class="main-menu">
                <Icon type="ios-mail"></Icon>
                邮件
              </MenuItem>
              <MenuItem name="sms" :to="{ name: 'sms' }" class="main-menu">
                <Icon type="ios-chatboxes"></Icon>
                短信
              </MenuItem>
              <MenuItem name="private_numbers" :to="{ name: 'private_numbers' }" class="main-menu">
                <Icon type="ios-call"></Icon>
                隐私号码
              </MenuItem>
              <MenuItem name="templates" :to="{ name: 'templates' }" class="main-menu">
                <Icon type="ios-albums"></Icon>
                模板
              </MenuItem>
            </div>
            <div>
              <Tooltip content="是否接收浏览器发送的全局通知">
                <Checkbox v-model="notificating">接收通知</Checkbox>
              </Tooltip>
              <router-link name="docs" :to="{ name: 'docs' }" class="secondary-menu">
                开发者文档
              </router-link>
            </div>
          </div>
        </Menu>
      </Header>
      <Content class="layout-content">
        <keep-alive include="EmailList">
          <router-view></router-view>
        </keep-alive>
      </Content>
    </Layout>
  </div>
</template>

<script>
import websocket from './websocket'

export default {
  name: 'App',
  data () {
    return {
      activeMenu: '',
      notificating: true
    }
  },
  watch: {
    notificating: {
      handler () {
        this.$global.notificating = this.notificating
      },
      immediate: true
    }
  },
  created () {
    this.activeMenu = this.$route.path.split('/')[1] || 'emails'

    websocket.connect()
  }
}
</script>

<style lang="scss" scoped>
.layout {
  background: #fff;
  position: relative;
  overflow: hidden;
}
.layout-logo {
  color: beige;
  float: left;
}
.layout-nav {
  margin-left: 140px;
  display: flex;
  justify-content: space-between;

  div:last-child {
    color: #ff9900;
  }

  a {
    color: #2db7f5;
  }
}
.main-menu {
  font-size: 1.2em;
}
.layout-content {
  margin: 40px 20px;
}
</style>
