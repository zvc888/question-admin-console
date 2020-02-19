<template>
  <div class="app-container">

    <data-grid url="/operation/feedback/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <!-- <el-form-item label="类别">
          <el-input v-model="listQuery.name" placeholder="类别" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" class="filter-item" placeholder="请选择..."  @keyup.enter.native="handleFilter" >
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <!-- <template slot="extendOperation">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="modify()">新增</el-button>
      </template> -->
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="id" label="ID" width="100px"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机" ></el-table-column>
        <el-table-column align="center" prop="wechat" label="微信" ></el-table-column>
        <el-table-column align="center" prop="content" label="内容" ></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter }}</el-tag>
          <!-- <el-tag type="info">禁用</el-tag> -->
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modifiedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="modify(scope.row)" >编辑</el-button>
            <!-- <el-button type="danger" size="mini" @click="dropRow(scope.row)" >删除</el-button> -->
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="反馈信息" :visible.sync="modifyVisible">
      <el-form :model="feedBackForm" :rules="rules" ref="categoryForm" label-width="70px"  label-position="right" style="width: 400px; margin-left:50px;">
        <el-form-item label="手机号" prop="phone" size="medium">
          <el-input v-model="feedBackForm.phone" disabled="disabled" class="filter-item" placeholder="手机号" ></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechat" size="medium">
          <el-input v-model="feedBackForm.wechat" disabled="disabled" class="filter-item" placeholder="微信" ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" size="medium">
          <el-input type="textrea" v-model="feedBackForm.content" disabled="disabled" class="filter-item" placeholder="内容" ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="feedBackForm.status" class="filter-item" placeholder="请选择...">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getList,findById,save,drop} from "@/api/operation/feedback";

//import Pagination from "@/components/Pagination";
import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

const statusOptions=[{'key':'未处理','value':1}, {'key':'已处理','value':0}]

const statusTypeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})

export default {
  name: "User",
  components: { DataGrid },
  directives: { waves },
  filters: {
    
    statusFilter(status) {
      return statusTypeKeyValue[status]
    },
    statusTagFilter(status){
      const statusMap = {
        "1": 'danger',
        "0": 'success'
      }
      return statusMap[status]
    },
    parseTime
  },
  data() {
    return {
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        id: null,
        name: null
      },

      modifyVisible:false,
      statusOptions:statusOptions,
      // erpFlagOptions:erpFlagOptions,
      feedBackForm:{
        status:''
      },
      rules: {
        // name: [
        //   { required: true, message: '账户是必填项', trigger: 'blur' },
        //   { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        // ],
        // password: [
        //   { validator: validatePass, trigger: 'blur' }
        // ]
      },
     
    };
  },
  watch: {
    // roleVisible(val) {
    //   if(!val){
    //     this.defaultSelected = [];
    //   }
    // }
  },
  created() {
  },
  methods: {
    onDataRest(){
      this.listQuery = {}
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(feedback){
      this.modifyVisible=true
      if(feedback){
        findById(feedback.id).then((res) => {
          if(res.result){
            this.feedBackForm=res.data;
          }else{
            this.$message.error(res.code);
          }
        });
      }else{
        this.feedBackForm.status= "1"
      }
    },
    submitForm() {// 保存
      // this.$refs["feedBackForm"].validate((valid) => {
        // if (valid) {
          // this.categoryForm.roleIds=this.$refs.multipleTree.getCheckedKeys();
				  let para = this.feedBackForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.$refs.dataList.fetchData();
			  	});
        // } else {
        //   return false;
        // }
      // });
    },
    dropRow(row){
      this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let params={};
          if(row.id){
            drop(row.id).then((res) => {
              this.$refs.dataList.fetchData();
            });
          }
				}).catch(() => {
      });
    }
  }
};
</script>
