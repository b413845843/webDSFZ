<template>
    <Menu mode="horizontal" theme="dark" active-name="1" style="padding:0px 50px;">
        <div class="layout-logo">
            <img src="@/assets/DSLogo.png" class="logo"></img>
            
        </div>
        <div class="layout-nav">
            <MenuItem name="1">
                <Icon type="ios-navigate"></Icon>
                Item 1
            </MenuItem>
            <MenuItem name="2">
                <Icon type="ios-keypad"></Icon>
                Item 2
            </MenuItem>
            <MenuItem name="3">
                <Icon type="ios-analytics"></Icon>
                Item 3
            </MenuItem>
            <MenuItem name="4">
                <Icon type="ios-paper"></Icon>
                Item 4
            </MenuItem>
        </div>
    </Menu>
</template>

<style scoped>
.logo{
    width: 30px;
    height: 30px;
}

.layout-logo{
    width: 100px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 0px;
    color: mediumblue
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>


<script>
export default {

}
</script>
