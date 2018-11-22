<template>
  <Layout style="height: 100%">
    <Sider breakpoint="md" :width="220" collapsible hide-trigger :collapsed-width="78" v-model="isCollapsed">
      <left-nav :class="menuitemClasses"></left-nav>
    </Sider>

    <Layout>
      <Header style="padding:0;width:100%;z-index:10000;backgroundColor:#FFF" class="layout">
        <topHeader :collapsed="isCollapsed" @on-change="handleCollpasedChange" :icon="icon">
          <user></user>
        </topHeader>
      </Header>
      <Layout style="padding:20px;overflow:auto">
        <Content>
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
    <BackTop></BackTop>
  </Layout>

</template>

<script>
  import './mainLayout.less'
  import TopHeader from '@/layout/iview/component/top-header'
  import LeftNav from '@/layout/iview/component/left-nav'
  import User from '@/layout/iview/component/user'
  export default {
    name: 'MainLayout',
    components: {
      TopHeader,
      LeftNav,
      User
    },
    data() {
      return {
        transitionName: 'slide-left',
        isCollapsed: false,
        icon: 'md-menu'
      }
    },
    beforeRouteUpdate(to, from, next) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      next()
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      handleCollpasedChange(state) {
        this.isCollapsed = state
      }
    }
  }

</script>
