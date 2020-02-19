<template>
  <div class="app-container">

    <data-grid url="/exam/swiper/list" dataName="listQuery" ref="dataList" @dataRest="onDataRest" >
      <template slot="form">
        <el-form-item label="名称">
          <el-input v-model="listQuery.originName" placeholder="文件名" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="批次">
          <el-input v-model="listQuery.slotId" placeholder="批次" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </template>
      <!--extendOperation-->
      <template slot="extendOperation">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-upload2" @click="showUploadForm()">新增</el-button>
      </template>
      <!--body-->
      <template slot="body">
        <el-table-column align="center" prop="id" label="ID" width="100px"></el-table-column>
        <!-- <el-table-column align="center" prop="name" label="名称" ></el-table-column> -->
        <el-table-column align="center" prop="url" label="路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" prop="orderItem" label="排序" ></el-table-column>
        
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
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="dropRow(scope.row)" >禁用</el-button>
          </template>
        </el-table-column>
      </template>
    </data-grid>

    <el-dialog title="新增轮播图" :visible.sync="swiperVisible">
      <el-form :model="swiperForm"
        :rules="rules"
        ref="swiperForm"
        label-width="70px"
        label-position="right"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="排序">
          <el-input v-model="swiperForm.orderItem" placeholder="排序" size="small" class="filter-item" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="swiperForm.status" class="filter-item" placeholder="请选择...">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="swiperForm.url" readonly="readonly" placeholder="图片url" size="small" class="filter-item" />
          <el-button @click="showUpdateDialog" type="primary" size="mini"  > 上传</el-button>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary" size="mini" > 保存</el-button>
        <el-button @click="swiperVisible=false" size="mini">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="uploadVisible">
      <el-row>
        <el-col :span="24">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :action="uploadAction"
            :accept="acceptFileType"
            :limit="1"
            :headers="importHeaders"
            :data="fileUploadParam"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-progress="handleProgress"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button @click="submitUpload" type="primary" size="mini" :loading="uploadLoading" > 确定上传</el-button>
        <el-button @click="uploadVisible=false" size="mini">取消</el-button>
      </span>
      
    </el-dialog>
  </div>
</template>

<script>
import { getList,save,drop} from "@/api/exam/swiper";
import { getToken } from '@/utils/auth'
import DataGrid from "@/components/DataGrid";
import { parseTime,formatFileSize } from '@/utils'
import waves from "@/directive/waves"; // Waves directive

const statusOptions=[{'key':'正常','value':'1'}, {'key':'删除','value':'0'}]
export default {
  name: "User",
  components: { DataGrid },
  directives: { waves },
  filters: {
    parseTime,
    formatFileSize
  },
  data() {
    
    return {
      tableKey:0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10
      },
      statusOptions: statusOptions,
      swiperForm: {
        orderItem: null,
        url:null,
        status:null
      },
      rules: {
        url: [
          { required: true, message: 'url是必填项', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        orderItem: [
          // { validator: validatePass, trigger: 'blur' }
          { required: true, message: 'url是必填项', trigger: 'blur' }
        ]
      },
      importHeaders: {Authorization: getToken()},
      fileList: [],
      uploadAction: process.env.BASE_API + "/exam/swiper/upload",
      swiperVisible:false,
      uploadLoading:false,
      uploadVisible:false,
      acceptFileType:".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP",
      downLoadLoading:'',
      fileUploadParam:{
        sourceDir:"temp"
      }
    };
  },
  methods: {
    onDataRest(){
      this.listQuery = {}
    },
    handleFilter() {
      this.$refs.dataList.fetchData();
    },
    submitForm() {
      // 保存
      this.$refs["swiperForm"].validate(valid => {
        if (valid) {
          let para = this.swiperForm;
          save(para).then(res => {
            this.swiperVisible = false;
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
          let params={};
          if(row.id){
            params.id= row.id;
            drop(params).then((res) => {
              this.$refs.dataList.fetchData();
            });
          }
				}).catch(() => {
      });
    },
    showUpdateDialog(){
      this.uploadVisible=true;
    },
    showUploadForm(){
      this.swiperVisible=true;
    },
    handleExceed(files,fileList){
        this.$message.warning('只能选择1个文件!');
    },
    handleRemove(file,fileList){
        //console.log(file,fileList);
    },
    handlePreview(file){
        //console.log(file);
    },
    beforeUpload(file){
      //文件类型
      var fileName=file.name.substring(file.name.lastIndexOf('.')+1);
      // if(fileName!='xls'){
      //     that.$message({
      //         type:'error',
      //         showClose:true,
      //         duration:3000,
      //         message:'文件类型不是.xls文件!'
      //     });
      //     return false;
      // }
      //读取文件大小
      var fileSize=file.size;
      if(fileSize>1048576){
        this.$message({
          type:'error',
          showClose:true,
          duration:3000,
          message:'文件大于1M!'
        });
        return false;
      }
      return true;
    },
    handleProgress(event, file, fileList){
      this.downloadLoading=this.$loading({
        lock:true,
        text:'数据导入中...',
        spinner:'el-icon-loading',
        background:'rgba(0,0,0,0.7)'
      });
    },
    handleChange(file, fileList){
      if(this.downloadLoading){
        this.downloadLoading.close();
        this.uploadLoading=false;
      }
    },
    submitUpload(){
      // this.uploadLoading=true;
      var that=this;
      // setTimeout(function () {
        if(that.$refs.upload.$children[0].fileList.length==1){
          that.$refs.upload.submit();
        }else{
          that.uploadLoading=false;
          that.$message({
            type:'error',
            showClose:true,
            duration:3000,
            message:'请选择文件!'
          });
        };
      // },100);
    },
    
    handleSuccess(response, file, fileList){
      if(response.result){
        this.$message.success("上传成功");
        this.uploadVisible=false;
        this.swiperForm.url = response.data
        // this.$refs.dataList.fetchData();
      }else{
        this.$message({
          type:'error',
          showClose:true,
          duration:60000,
          message:response.message
        });
      }
    },
    handleError(err, file, fileList){
      this.$message({
        type:'error',
        showClose:true,
        duration:60000,
        message:'请求失败! error:'+err
      });
    }
  }
};
</script>
