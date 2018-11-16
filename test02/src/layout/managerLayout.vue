<template>
    <el-container>

        <el-header class="header">
            <top-nav></top-nav>
        </el-header>
        <el-container class="aside">
            <el-aside width="200px">
            <leftNav></leftNav>
        </el-aside>

        <el-main class="content">
            <user-manager></user-manager>
        </el-main>
        </el-container>
        
    </el-container>
    
</template>

<script>

import LeftNav from './components/leftNav'
import UserManager from './components/userManager'
import TopNav from './components/topNav'
export default {
    name:'ManagerLayout',
    components:{
        LeftNav,
        UserManager,
        TopNav
    }
}
</script>

<style scoped>

.header{
    background-color: rgb(155, 225, 247);
}

.aside{
    background-color: #fff;
}

.content{
    padding: 30px;
    background-color: rgb(255, 253, 253);
}
</style>
