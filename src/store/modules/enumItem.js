// initial state
const state = {
  user: {
    sexEnum: [{ key: 1, value: '男' }, { key: 2, value: '女' }],
    statusEnum: [{ key: 1, value: '启用' }, { key: 2, value: '禁用' }],
    statusTag: [{ key: 1, value: 'success' }, { key: 2, value: 'danger' }],
    statusBtn: [{ key: 1, value: '禁用' }, { key: 2, value: '启用' }]
  },
  exam: {
    examPaper: {
      paperTypeEnum: [{ key: 1, value: '固定试卷' }, { key: 4, value: '时段试卷' }, { key: 6, value: '任务试卷' }]
    },
    question: {
      typeEnum: [{
        key: 1,
        value: '单选题'
      }, {
        key: 2,
        value: '多选题'
      }, {
        key: 3,
        value: '判断题'
      }, {
        key: 4,
        value: '填空题'
      }, {
        key: 5,
        value: '简答题'
      }],
      editUrlEnum: [{
          key: 1,
          value: '/exam/question/edit/single-choice',
          name: '单选题'
        },
        {
          key: 2,
          value: '/exam/question/edit/multiple-choice',
          name: '多选题'
        },
        {
          key: 3,
          value: '/exam/question/edit/true-false',
          name: '判断题'
        },
        {
          key: 4,
          value: '/exam/question/edit/gap-filling',
          name: '填空题'
        },
        {
          key: 5,
          value: '/exam/question/edit/short-answer',
          name: '简答题'
        }
      ]
    }
  }
}

// getters
const getters = {
  enumFormat: (state) => (arrary, key) => {
    return format(arrary, key)
  }
}

// actions
const actions = {}

// mutations
const mutations = {}

const format = function (array, key) {
  for (let item of array) {
    if (item.key === key) {
      return item.value
    }
  }
  return null
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
