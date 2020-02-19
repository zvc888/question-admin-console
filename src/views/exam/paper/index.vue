<template>
  <div class="app-container">

    <data-grid url="/exam/paper/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="题目ID">
          <el-input v-model="listQuery.id" placeholder="题目ID" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <!-- <el-form-item label="类别">
          <el-select v-model="listQuery.categoryId" class="filter-item" placeholder="请选择..." @change="getSubjectListByCategoryId" @keyup.enter.native="handleFilter" >
            <el-option v-for="item in categoryList" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="科目">
          <el-select v-model="listQuery.subjectId" class="filter-item" placeholder="请选择..."  @keyup.enter.native="handleFilter" >
            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="listQuery.questionType" class="filter-item" placeholder="请选择..."  @keyup.enter.native="handleFilter" >
            <el-option v-for="item in questionType" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" class="filter-item" placeholder="请选择..."  @keyup.enter.native="handleFilter" >
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-edit" @click="modify()">新增</el-button> -->
        <router-link :to="{path:'/exam/paper/edit'}" class="link-left">
          <el-button type="primary" class="filter-item" style="margin-left: 10px;" size="small" icon="el-icon-edit">添加</el-button>
        </router-link>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column prop="id" label="Id" width="90px"/>
      <el-table-column prop="subjectId" label="科目"  width="120px" />
      <el-table-column prop="name" label="名称"  />
      <el-table-column label="状态" align="center" width="60px">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter }}</el-tag>
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
      <el-table-column  label="操作" align="center"  width="160px">
        <template slot-scope="{row}">
          <el-button size="mini" @click="$router.push({path:'/exam/paper/edit',query:{id:row.id}})" >编辑</el-button>
          <el-button size="mini" type="danger" disabled @click="deletePaper(row)" class="link-left">删除</el-button>
        </template>
      </el-table-column>
      
      </template>
    </data-grid>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { getList,findById,save,drop} from "@/api/exam/paper";
// import { getAllList as getCategoryAllList } from "@/api/exam/category";
import { getSubjectList} from "@/api/exam/subject";
import Pagination from "@/components/Pagination";
import DataGrid from "@/components/DataGrid";
import { parseTime } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

const statusOptions=[{'key':'正常','value':'1'}, {'key':'删除','value':'0'}]
// const erpFlagOptions=[{'key':'否','value':'0'},{'key':'是','value':'1'}]

const statusTypeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key
  return acc
}, {})
// const erpFlagTypeKeyValue = erpFlagOptions.reduce((acc, cur) => {
//   acc[cur.value] = cur.key
//   return acc
// }, {})

export default {
  name: "Question",
  components: { DataGrid },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusTypeKeyValue[status]
    },
    statusTagFilter(status){
      const statusMap = {
        "1": 'success',
        "0": 'danger'
      }
      return statusMap[status]
    },
    erpFlagFilter(flag){
      return erpFlagTypeKeyValue[flag]
    },
    erpFlagTagFilter(flag){
      const statusMap = {
        "1": 'success',
        "0": 'info'
      }
      return statusMap[flag]
    },
    parseTime
  },
  data() {
    return {
      content:'',
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        id: null,
        name: null,
        questionType: null,
        // categoryId: null,
        subjectId: null
      },
      // categoryList:[],
      subjectList: [],
      // questionType:[],
      modifyVisible:false,
      statusOptions:statusOptions,
      // erpFlagOptions:erpFlagOptions,
      questionForm:{
        name:'',
        subjectId: null,
        status:'',
        // erpFlag: '0'
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      },
      rules: {
        name: [
          { required: true, message: '账户是必填项', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        // password: [
        //   { validator: validatePass, trigger: 'blur' }
        // ]
      },
      currentUserId:null,
      // roleVisible:false,
      dataNodes:null,
      defaultSelected:[],
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
    // this.getCategoryList()
    this.getSubjectList()
  },
  methods: {
    questionTypeFormatter (row, column, cellValue, index) {
      return this.enumFormat(this.questionType, cellValue)
    },
    editorReady(instance){
      this.tinyMceEditor.instance = instance
      let currentContent = '111'//this.tinyMceEditor.object[this.tinyMceEditor.parameterName]
      this.tinyMceEditor.instance.setContent(currentContent)
    },
    inputClick (object, parameterName) {
      this.tinyMceEditor.object = object
      this.tinyMceEditor.parameterName = parameterName
      this.tinyMceEditor.dialogVisible = true
    },
    editorConfirm () {
      let content = this.tinyMceEditor.instance.getContent()
      this.tinyMceEditor.object[this.tinyMceEditor.parameterName] = content
      this.tinyMceEditor.dialogVisible = false
    },
    getSubjectList(){
      // this.listQuery.subjectId = null;
      // let categoryId = this.listQuery.categoryId;
      // let params = {categoryId: categoryId}
      getSubjectList().then(res => {
          if (res.data) {
            this.subjectList = res.data;
          } else {
            this.$message.error(res.code);
          }
        });
    },
    getCategoryList() {
      getCategoryAllList().then(res => {
        if (res.data) {
          this.categoryList = res.data;
        } else {
          this.$message.error(res.code);
        }
      });
    },
    onDataRest(){
      this.listQuery = {}
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(user){
      this.modifyVisible=true
      if(user){
        // let params = {
        //   id: user.id
        // };
        findById(user.id).then((res) => {
          if(res.result){
            this.questionForm=res.data;
          }else{
            this.$message.error(res.code);
          }
        });
      }else{
        // this.questionForm.id=null
        this.questionForm.name=null
        // this.questionForm.password=null
        this.questionForm.status= "1"
        // this.questionForm.erpFlag= "0"
      }
    },
    submitForm() {// 保存
      this.$refs["questionForm"].validate((valid) => {
        if (valid) {
				  let para = this.questionForm;
			    save(para).then((res) => {
				    this.modifyVisible = false
            this.$refs.dataList.fetchData();
			  	});
        } else {
          return false;
        }
      });
    },
    dropRow(row){
      this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          let _this = this
          if(row.id){
            drop(row.id).then((res) => {
              this.$refs.dataList.fetchData();
            });
          }
				}).catch(() => {
      });
    },
    showQuestion(row) {
      let _this = this
      this.questionShow.dialog = true
      this.questionShow.loading = true
      findById(row.id).then(re => {
        _this.questionShow.qType = re.data.questionType
        _this.questionShow.question = re.data
        _this.questionShow.loading = false
      })
    },
    editQuestion (row) {
      let url = this.enumFormat(this.editUrlEnum, row.questionType)
      this.$router.push({ path: url, query: { id: row.id } })
    },
    deleteQuestion (row) {
      let _this = this
      questionApi.deleteQuestion(row.id).then(re => {
        if (re.code === 1) {
          _this.search()
          _this.$message.success(re.message)
        } else {
          _this.$message.error(re.message)
        }
      })
    },
  },
  computed:{
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionType: state => state.exam.question.typeEnum,
      editUrlEnum: state => state.exam.question.editUrlEnum
    }),
    // ...mapGetters('exam', ['subjectEnumFormat']),
    // ...mapState('exam', { subjects: state => state.subjects })
  }
};
</script>
<style scoped>
/* .el-input {
  width:80%;
} */
/* .tox-silver-sink{
    z-index: 3000;
} */
</style>