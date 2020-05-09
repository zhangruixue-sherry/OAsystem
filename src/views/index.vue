<template>
    <el-container>
    <el-header height="70px">
        <div class="company">河北金乌科技OA管理系统</div>
        <div class="user-info">您好：admin</div>
    </el-header>
    <el-container>
        <el-aside width="200px">
            <el-row class="tac">
            <el-col :span="12">
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#1b3757"
                text-color="#fff"
                active-text-color="#fff"
                :collapse="isCollapse">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                    </template>
                    <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1"  @click="$router.push({ path: '/member', })">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                </el-menu-item>
                </el-menu>
            </el-col>
            </el-row>
        </el-aside>
        <el-main>
            <div class="crumb clearfix">
                <p class="asideBtn">
                    <span><i class="el-icon-document"></i></span>
                </p>
            </div>
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
  export default { 
    data () {
        return {
            isCollapse:false,
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }

    
  }
</script>

<style>
  .el-header, .el-footer {
    background-color: #1c4062;
    color: #ffffff;
    text-align: center;
    line-height: 70px;
  }
  
  .el-aside {
    background-color: #1b3757;
    color: #ffffff;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #ffffff;
    color: #ffffff;
    text-align: center;
    padding-top: 70px !important;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-container{
  position: absolute; 
  width: 100%; 
  top: 0px ; 
  left: 0 ; 
  bottom: 0;
}
.el-header{
  padding: 0;
  z-index: 1000;
}

.el-header .fr{
  float: right;
}
.el-header .el-menu{
  border-bottom: none;
}
.el-aside, .el-main{
  padding-top: 60px;
}
.el-aside{
  background: #1b3757;
  text-align: center;
}
.el-aside .el-menu{
  border-right: none;
}

.company{
    font-size: 22px;
    float:left;
}

.user-info{
    font-size: 14px;
    float: right;
    padding-right: 20px;
}

.crumb{
    height: 56px;
    border-bottom:1px solid #e5e5e5;
}
.crumb p.asideBtn{
    height: 100%;
    padding: 15px 0;
    text-align: center;
    box-sizing: border-box;
}
.crumb p.asideBtn span{
    display: block;
    padding: 2px 15px;
    text-align: center;
    box-sizing: border-box;
    border-right: 1px solid #e5e5e5;
}
.crumb p.asideBtn span i{
    font-size: 22px;
}
.asideBtn{
    float: left;
}
</style>
