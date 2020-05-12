<template>
    <div class="pageMain">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="��Ա����">
            <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">��ѯ</el-button>
        </el-form-item>
        </el-form>
        <div class="boxMain">
            <p class="boxTitle">��Ա�б�</p>
            <div class="tableTopBtn clearfix" style="padding: 15px;">
                <el-button size="small" type="primary">����</el-button>
            </div>
            <template>
                <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="����"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="����"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="��ַ">
                </el-table-column>
                <el-table-column align="center" width="160" label="����">
                    <template>
                    <el-button size="mini" type="primary" >�༭</el-button>
                    <el-button size="mini" type="primary" >ɾ��</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
                </el-pagination>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        tableData: [{
            date: '2016-05-02',
            name: '��С��',
            address: '�Ϻ�����������ɳ��· 1518 Ū'
          }, {
            date: '2016-05-04',
            name: '��С��',
            address: '�Ϻ�����������ɳ��· 1517 Ū'
          }, {
            date: '2016-05-01',
            name: '��С��',
            address: '�Ϻ�����������ɳ��· 1519 Ū'
          }, {
            date: '2016-05-03',
            name: '��С��',
            address: '�Ϻ�����������ɳ��· 1516 Ū'
          }],
          currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleSizeChange(val) {
        console.log(`ÿҳ ${val} ��`);
      },
      handleCurrentChange(val) {
        console.log(`��ǰҳ: ${val}`);
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>