<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading"  :rules="rules">
       <el-form-item label="科目" prop="subjectId" required>
        <el-select
            v-model="form.subjectId"
            class="filter-item"
            placeholder="请选择..."
          >
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
      </el-form-item>
      <el-form-item label="题干：" prop="title" required>
        <el-input v-model="form.title"   @focus="inputClick(form,'title')" />
      </el-form-item>
      <el-form-item label="填空答案：" required>
        <el-form-item :label="item.prefix" :key="item.prefix"  v-for="item in form.items"  label-width="50px" class="question-item-label">
          <el-input v-model="item.content"   @focus="inputClick(item,'content')"  class="question-item-content-input"  style="width: 80%"/>
          <span class="question-item-span">分数：</span><el-input v-model="item.score"  style="width:60px;" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="解析：" prop="analyze" required>
        <el-input v-model="form.analyze"  @focus="inputClick(form,'analyze')" />
      </el-form-item>
      <el-form-item label="分数：" prop="score" required>
        <el-input v-model="form.score" placeholder="分数支持小数点后一位"  />
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="form.difficult" class="question-item-rate"></el-rate>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
      </el-form-item>
    </el-form>
    <el-dialog  :visible.sync="richEditor.dialogVisible"  append-to-body :close-on-click-modal="false" style="width: 100%;height: 100%"   :show-close="false" center>
      <Ueditor @ready="editorReady"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorConfirm">确 定</el-button>
        <el-button @click="richEditor.dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :qType="questionShow.qType" :question="questionShow.question" :qLoading="questionShow.loading"/>
    </el-dialog>
  </div>
</template>

<script>
import QuestionShow from '../components/Show'
import Ueditor from '@/components/Ueditor'
import { getSubjectList} from "@/api/exam/subject";
import { mapGetters, mapState, mapActions } from 'vuex'
import { getList,findById,save,drop} from "@/api/exam/question";

export default {
  components: {
    Ueditor, 
    QuestionShow
  },
  data () {
    return {
      form: {
        id: null,
        questionType: 4,
        subjectId: null,
        title: '',
        items: [{ id: null, prefix: '1', content: '', score: '' }],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      },
      subjectList:[],
      formLoading: false,
      rules: {
       
        subjectId: [
          { required: true, message: '请选择科目', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        analyze: [
          { required: true, message: '请输入解析', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入分数', trigger: 'blur' }
        ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      }
    }
  },
  created () {
    let id = this.$route.query.id
    let _this = this
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      findById(id).then(re => {
        _this.form = re.data
        _this.formLoading = false
      })
    }
    this.getSubjectList()
  },
  methods: {
    getSubjectList(){
      getSubjectList().then(res => {
          if (res.result) {
            this.subjectList = res.data;
          } else {
            this.$message.error(res.code);
          }
        });
    },
    editorReady (instance) {
      this.richEditor.instance = instance
      let currentContent = this.richEditor.object[this.richEditor.parameterName]
      this.richEditor.instance.setContent(currentContent)
    },
    inputClick (object, parameterName) {
      this.richEditor.object = object
      this.richEditor.parameterName = parameterName
      this.richEditor.dialogVisible = true
    },
    editorConfirm () {
      let content = this.richEditor.instance.getContent()
      if (this.richEditor.parameterName === 'title') { // 题干的正确答案重置
        this.questionItemReset(content)
      }
      this.richEditor.object[this.richEditor.parameterName] = content
      this.richEditor.dialogVisible = false
    },
    questionItemReset (content) {
      let spanRegex = new RegExp('<span class="gapfilling-span (.*?)">(.*?)<\\/span>', 'g')
      let _this = this
      let newFormItem = []
      content.match(spanRegex).forEach(function (span, index) {
        let pairRegex = /<span class="gapfilling-span (.*?)">(.*?)<\/span>/
        pairRegex.test(span)
        newFormItem.push({ id: null, prefix: RegExp.$2, content: '', score: '0' })
      })

      newFormItem.forEach(function (item) {
        _this.form.items.some((oldItem, index) => {
          if (oldItem.itemUuid === item.itemUuid) {
            item.content = oldItem.content
            item.id = oldItem.id
            item.score = oldItem.score
            return true
          }
        })
      })
      _this.form.items = newFormItem
    },
    submitForm () {
      let _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          save(this.form).then(re => {
            if (re.code === 20000) {
              _this.form = re.data
              _this.$message.success(re.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.push('/exam/question')
              })
            } else {
              _this.$message.error(re.message)
              this.formLoading = false
            }
          }).catch(e => {
            this.formLoading = false
          })
        } else {
          return false
        }
      })
    },
    showQuestion () {
      let _this = this
      // this.questionShow.dialog = true
      // this.questionShow.loading = true
      // findById(this.form.id).then(re => {
      //   _this.questionShow.qType = re.response.questionType
      //   _this.questionShow.question = re.response
      //   _this.questionShow.loading = false
      // })
       _this.questionShow.dialog = true
      _this.questionShow.qType = this.form.questionType
      _this.questionShow.question = this.form
    },
    resetForm () {
      this.$refs['form'].resetFields()
    },
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      levelEnum: state => state.user.levelEnum
    }),
  }
}
</script>
