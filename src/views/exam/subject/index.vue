<template>
  <div class="app-container">
    <data-grid url="/exam/subject/list" data-name="listQuery" ref="dataList" @dataRest="onDataRest">
      <template slot="form">
        <el-form-item label="类别">
          <el-select
            v-model="listQuery.categoryId"
            class="filter-item"
            placeholder="请选择..."
            @keyup.enter.native="handleFilter"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-input
            v-model="listQuery.name"
            placeholder="科目"
            size="small"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="listQuery.status"
            class="filter-item"
            placeholder="请选择..."
            @keyup.enter.native="handleFilter"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          size="small"
          icon="el-icon-edit"
          @click="modify()"
        >新增</el-button>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="id" label="ID" width="100px"></el-table-column>
        <el-table-column align="center" prop="name" label="科目"></el-table-column>
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
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="dropRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="类别信息" :visible.sync="modifyVisible">
      <el-form
        :model="categoryForm"
        :rules="rules"
        ref="categoryForm"
        label-width="70px"
        label-position="right"
        style="width: 400px; margin-left:50px;"
      >
      <el-form-item label="类别">
          <el-select
            v-model="categoryForm.categoryId"
            class="filter-item"
            placeholder="请选择..."
            @keyup.enter.native="handleFilter"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科目" prop="name" size="medium">
          <el-input v-model="categoryForm.name" class="filter-item" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="categoryForm.status" class="filter-item" placeholder="请选择...">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="角色" :visible.sync="roleVisible">
      <el-tree ref="tree2"
        :data="dataNodes"
        :props="defaultProps"
        accordion
        show-checkbox
        node-key="id"
        :default-expanded-keys="[0,1]"
        :default-checked-keys="defaultSelected"
        :expand-on-click-node="false" >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserRole">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import { getList, findById, save, drop } from "@/api/exam/subject";
import { getAllList as getCategoryAllList } from "@/api/exam/category";

// import { findAllRoleList} from "@/api/sysmgr/role";
//import Pagination from "@/components/Pagination";
import DataGrid from "@/components/DataGrid";
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // Waves directive

const statusOptions = [
  { key: "正常", value: "1" },
  { key: "删除", value: "0" }
];
// const erpFlagOptions=[{'key':'否','value':'0'},{'key':'是','value':'1'}]

const statusTypeKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.key;
  return acc;
}, {});
// const erpFlagTypeKeyValue = erpFlagOptions.reduce((acc, cur) => {
//   acc[cur.value] = cur.key
//   return acc
// }, {})

export default {
  name: "Subject",
  components: { DataGrid },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusTypeKeyValue[status];
    },
    statusTagFilter(status) {
      const statusMap = {
        "1": "success",
        "0": "danger"
      };
      return statusMap[status];
    },
    erpFlagFilter(flag) {
      return erpFlagTypeKeyValue[flag];
    },
    erpFlagTagFilter(flag) {
      const statusMap = {
        "1": "success",
        "0": "info"
      };
      return statusMap[flag];
    },
    parseTime
  },
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (!value && this.categoryForm.erpFlag==='0') {
    //     callback(new Error('请输入密码'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      tableKey: 0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        id: null,
        name: null,
        categoryId: null
      },
      categoryList: [],
      modifyVisible: false,
      

      statusOptions: statusOptions,
      // erpFlagOptions:erpFlagOptions,
      categoryForm: {
        name: "",
        // password:'',
        // email:'',
        status: "",
        categoryId: ''
        // erpFlag: '0'
      },
      rules: {
        name: [
          { required: true, message: '账户是必填项', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        // password: [
        //   { validator: validatePass, trigger: 'blur' }
        // ]
      },
      // currentUserId: null,
      // roleVisible:false,
      // dataNodes: null,
      // defaultSelected: [],
      // roleTreeLoading: false,
      // defaultProps: {
      //   children: "children",
      //   label: "name"
      // }
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
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
        getCategoryAllList().then(res => {
          if (res.result) {
            this.categoryList = res.data;
          } else {
            this.$message.error(res.code);
          }
        });
      // }
    },
    onDataRest() {
      this.listQuery = {};
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    modify(subject) {
      this.modifyVisible = true;
      if (subject) {
        // this.getCategoryList();
        if(!this.categoryList){
          this.getCategoryList();
        }
        // let params = {
        //   id: user.id
        // };
        findById(subject.id).then(res => {
          if (res.result) {
            this.categoryForm = res.data;
          } else {
            this.$message.error(res.code);
          }
        });
      } else {
        // this.categoryForm.id=null
        this.categoryForm.name = null;
        // this.categoryForm.password=null
        this.categoryForm.status = "1";
        // this.categoryForm.erpFlag= "0"
      }
    },
    submitForm() {
      // 保存
      this.$refs["categoryForm"].validate(valid => {
        if (valid) {
          let para = this.categoryForm;
          save(para).then(res => {
            this.modifyVisible = false;
            this.$refs.dataList.fetchData();
          });
        } else {
          return false;
        }
      });
    },
    dropRow(row) {
      this.$confirm("您确定要删除该数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          if (row.id) {
            drop(row.id).then(res => {
              this.$refs.dataList.fetchData();
            });
          }
        })
        .catch(() => {});
    }
  }
};
</script>
