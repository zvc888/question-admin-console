# QUESTION-ADMIN 刷题管理后台web端

>  [gitee地址](https://gitee.com/zvc888/question-admin-console.git)

>  [github地址](https://github.com/zvc888/question-admin-console.git)


1. [JAVA接口服务](https://github.com/zvc888/question-admin.git)
2. [后端管理页面](https://github.com/zvc888/question-admin-console.git)
3. [小程序](https://github.com/zvc888/question-wx.git)

## 本项目为前后端分离的Web应用后端程序，采用技术框架如下：

[vue-admin-template](http://panjiachen.github.io/vue-admin-template)
[ueditor](https://github.com/fex-team/ueditor)

## 开发环境&运行

**一、开发环境**

1. nodejs
2. vue

**二、初始化**

1. 修改config/dev.env.js 后台服务ip和端口
2. src/views/operation/api里面的swagger接口地址
3. static\admin\components\ueditor\ueditor.config.js中后台服务和端口

**三、启动**

```bash

# Install dependencies
npm install

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```
