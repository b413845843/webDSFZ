<style scoped>

</style>
<template>
    <div class="layout">
        <Layout>
            <Header style="padding:0;width:100%;z-index:10000" class="layout">
                <topHeader></topHeader>
            </Header>
            <Layout style="margin-top:5px">
                <Sider ><left-nav></left-nav></Sider>
                    <Layout :style="{padding:'20px'}">
                        <Breadcrumb >
                            <BreadcrumbItem key="home" to="/">首页</BreadcrumbItem>
                            <BreadcrumbItem v-for="(item, index) in $route.meta.bread" :key="index" :to="item">{{item}}</BreadcrumbItem>
                        </Breadcrumb>
                        
                        <Content >
                            <Tabs value="name1">
                                <TabPane label="信息状态" name="name1" >
                                    <div>
                                        <router-view ></router-view>
                                    </div>
                                    
                                </TabPane>
                                <TabPane label="标签二" name="name2">标签二的内容</TabPane>
                                <TabPane label="标签三" name="name3">标签三的内容</TabPane>
                            </Tabs>
                        </Content>
                </Layout>
                
            </Layout>
        </Layout>
        <BackTop></BackTop>
    </div>
</template>

<style scoped>
.layout {
    /* background-color: #eee; */
}
.child-view {
  position: absolute;
  clear: both;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>

<script>
    import topHeader from '@/layout/iview/component/topHeader'
    import leftNav from '@/layout/iview/component/leftNav'
    export default {
        components:{topHeader,leftNav},
        data(){
            return {
                 transitionName: 'slide-left'
            }
        },
        beforeRouteUpdate (to, from, next) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
            next()
        }
    }
</script>

