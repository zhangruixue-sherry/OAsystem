<template>
    <el-container>
    <el-header height="70px">
        <div class="company">河北金乌科技OA管理系统</div>
        <div class="user-info">您好：admin</div>
    </el-header>
    <el-container>
        <el-aside :width="asideWh+'px'">
            <el-row class="tac">
            <el-col :span="24">
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#1b3757"
                text-color="#fff"
                :collapse="isCollapse"
                unique-opened="true"
                collapse-transition="true"
                active-text-color="#fff">
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
                <p class="asideBtn" @click="openAside()">
                    <span><i class="el-icon-s-fold" style="color:#333;"></i></span>
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
            asideWh:'200',
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
        openAside(){
          if(this.isCollapse == false){
              this.isCollapse = true;
              this.asideWh = '64'
          }else{
              this.isCollapse = false;
              this.asideWh = '200'
          }
        },
    }
  }
</script>
