<template>
  <Layout style="height: 100%">
    <Sider breakpoint="md" :width="220" collapsible hide-trigger :collapsed-width="78" v-model="isCollapsed">
      <left-nav :class="menuitemClasses"></left-nav>
    </Sider>

    <Layout>
      <Header style="padding:0;width:100%;z-index:10000;backgroundColor:#FFF" class="layout">
        <topHeader :collapsed="isCollapsed" @on-change="handleCollpasedChange"></topHeader>
      </Header>
      <Layout :style="{padding:'20px'}">
        <Content>
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
    <BackTop></BackTop>
  </Layout>

</template>

<style scoped>
  .child-view {
    position: absolute;
    clear: both;
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }

</style>

<script>
  import topHeader from '@/layout/iview/component/topHeader'
  import leftNav from '@/layout/iview/component/leftNav'
  export default {
    components: {
      topHeader,
      leftNav
    },
    data() {
      return {
        transitionName: 'slide-left',
        isCollapsed: false
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
