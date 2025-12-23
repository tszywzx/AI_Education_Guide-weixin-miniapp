# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 工作准则与思考方法论

### 核心工作原则

**在开始任何任务前，必须遵循以下原则：**

1. **先问为什么，再解决问题**
   - 深入理解问题的本质和根本原因
   - 明确问题的上下文和影响范围
   - 确认需求的真实意图而非表面要求

2. **解决后必须验证确认**
   - 每次修改都要进行实测验证
   - 确保修改达到预期效果
   - 验证不仅限于功能，还包括性能、用户体验等

3. **深入思考连锁后果**
   - 从根本机制出发，而非仅修改表面现象
   - 评估修改对整个系统的影响
   - 考虑对现有功能、依赖关系、性能的潜在影响
   - 思考是否会引入新的问题或技术债务

4. **实测验证强制要求**
   - 所有代码修改必须经过实际测试
   - 测试应覆盖正常场景和边界情况
   - 记录测试结果和观察到的现象

### 六轮深度思考框架

**完成任务后，必须按以下六个角度进行深入思考以优化输出结果：**

> **适用场景说明：**
> - **必须应用完整六轮思考**：架构设计、核心功能修改、API变更、数据库迁移、安全相关修改
> - **应用关键轮次**（1、2、3、6轮）：功能增强、bug修复、性能优化
> - **快速思考**（1、2轮）：文档更新、样式调整、配置修改
> - **判断标准**：影响范围大、不可逆、涉及多个模块 → 必须完整思考

#### 第一轮：第一性原理思考
- 回归问题的本质和最基本的真理
- 剥离所有假设和惯性思维
- 从底层原理重新构建解决方案
- 问自己：这个问题的根本是什么？是否存在更简洁的解决路径？

#### 第二轮：理性逻辑推理
- 基于客观事实进行分析
- 建立清晰的因果关系链
- 验证推理过程的严密性
- 识别并排除情绪化判断和主观偏见
- 确保结论有充分的事实支撑

#### 第三轮：概率思维与风险评估
- 评估不同方案的成功概率
- 分析潜在风险及其影响程度
- 进行收益-成本分析
- 考虑最坏、最好和最可能的场景
- 制定风险缓解策略

#### 第四轮：迭代优化思维
- 将解决方案视为可持续改进的过程
- 识别当前方案的改进空间
- 设计渐进式优化路径
- 考虑短期解决方案与长期架构的平衡
- 为未来的扩展和维护留有余地

#### 第五轮：逆向思维
- 从相反的角度审视问题
- 思考"如果要让这个方案失败，我会怎么做"
- 识别隐藏的假设和盲点
- 探索非常规的解决路径
- 挑战既定的实现方式

#### 第六轮：批判性思维
- 质疑自己的解决方案
- 寻找逻辑漏洞和不一致之处
- 评估证据的可靠性和充分性
- 考虑是否存在认知偏差
- 邀请不同视角的审视

### 最终输出要求

完成六轮思考后，需要：
1. **总结每一轮的关键发现和优化点**
2. **综合所有思考角度，形成最终优化方案**
3. **明确说明：**
   - 采纳了哪些优化建议
   - 为什么某些优化未被采纳
   - 最终方案的权衡考虑
4. **提供验证计划和预期结果**

---

## 项目概述

这是一个基于微信小程序的教育辅助应用,名为"Indievolve",主要为教师提供备课、出题、评语生成等AI辅助功能。项目采用原生微信小程序开发,集成了多个AI模型服务(Claude、Gemini、Grok)。

## 核心架构

### 1. 页面结构
- **pages/indievolve/** - 核心业务页面
  - `home.js` - 首页,展示各类教学场景入口(备课、出题、评语等)
  - `scene_detail.js` - 场景详情页,处理用户与AI的交互
  - `community.js` - 社区页面
  - `workspace.js` - 个人工作空间
  - `onboarding.js` - 引导页
  - `tutorial.js` - 教程页

- **pages/tabBar/** - 示例和演示页面(component、API、extUI、template)
- **pages/API/** - 微信API功能演示页面(子包)
- **pages/extUI/** - uni-ui扩展组件演示(子包)

### 2. 服务层
- **services/llm.js** - LLM服务封装层
  - `callGemini()` - 统一调用Claude API(实际上已重定向到Claude)
  - `callClaude()` - 调用Claude 3.5 Sonnet,支持文本和图像输入
  - `callGrok()` - 已重定向到Claude
  - 所有API调用通过代理服务器 `PROXY_URL` 完成

### 3. 配置层
- **config/api.js** - API配置中心
  - 包含Gemini、Grok、Claude的API密钥和URL
  - `PROXY_URL` - 后端代理服务器地址(阿里云ECS: http://47.111.107.63:9100)

### 4. 后端代理服务器
- **server_new.js** - Express服务器(端口9100)
  - `POST /proxy/upload` - 文件解析(PDF、DOCX)
  - `POST /proxy/claude` - Claude API代理,支持文本和图像
  - `POST /proxy/export` - 导出Word文档
  - `GET /proxy/download` - 文件下载

- **cloudfunctions/proxyLLM/** - 微信云函数(备用)
  - `index.js` - 云函数入口,用于API调用代理

### 5. 状态管理
- **store/index.js** - Vuex + Pinia双状态管理
  - 用户信息、登录状态、使用统计等

### 6. UI组件
- **uni_modules/** - uni-ui组件库(forms、icons、popup、card等)
- **wxcomponents/vant/** - Vant Weapp组件库(button、icon、loading等)
- **components/** - 自定义组件

## 开发工作流

### 启动开发
```bash
# 微信开发者工具直接打开项目目录即可
# 项目根目录: E:\indievolve\mp-weixin
```

### 启动后端代理服务器
```bash
# 安装依赖(如果尚未安装)
cd E:\indievolve\mp-weixin
npm install --prefix . -f package_server.json

# 启动服务器
node server_new.js
```

服务器将在 http://localhost:9100 启动。

### 云函数部署
```bash
# 在微信开发者工具中:
# 1. 右键 cloudfunctions/proxyLLM
# 2. 选择"上传并部署:云端安装依赖"
```

## 关键技术点

### AI集成策略
- **统一使用Claude**: 所有LLM调用(包括Gemini、Grok)最终都路由到Claude 3.5 Sonnet
- **代理模式**: 小程序通过自建代理服务器调用OpenRouter API,避免跨域和密钥暴露
- **多模态支持**: 支持文本+图像输入(base64编码)

### 数据流
1. 用户在小程序前端输入prompt/上传图片
2. 调用 `services/llm.js` 中的方法
3. 通过 `wx.request` 发送到 `server_new.js` 代理服务器
4. 代理服务器调用OpenRouter API
5. 返回结果渲染到页面

### 文件处理
- **上传**: 使用 `multer` 中间件处理文件上传
- **解析**: PDF用 `pdf-parse`、DOCX用 `mammoth`
- **导出**: DOCX用 `docx` 库生成

## 项目配置文件

### project.config.json
- `appid`: wx7e6f5a4dd2af8897
- `cloudfunctionRoot`: cloudfunctions/
- `libVersion`: 3.11.3
- 云函数、分包配置

### app.json
- tabBar配置: 首页、社区、我的
- 分包结构: API示例、扩展UI、模板页
- 插件: WechatSI(微信同声传译)

## 安全注意事项

⚠️ **config/api.js 和 server_new.js 包含明文API密钥,切勿提交到公共仓库**
- 在生产环境中应使用环境变量
- 建议将 `config/api.js` 添加到 `.gitignore`

## 常见场景处理

### 添加新的教学场景
1. 在 `home.js` 的 `categories` 数组中添加新项
2. 在 `scene_detail.js` 中配置对应场景的prompt模板
3. 测试场景导航和AI响应

### 修改AI模型
1. 编辑 `config/api.js` 中的 `CLAUDE_MODEL` 字段
2. 或在 `services/llm.js` 的方法调用中传入 `model` 参数

### 调试API调用
- 检查 `server_new.js` 日志输出
- 在微信开发者工具控制台查看 `wx.request` 请求详情
- 验证 `PROXY_URL` 可访问性

## 依赖管理

### 小程序依赖
- 在 `app.json` 中配置 `usingComponents`
- uni_modules通过HBuilderX导入

### 服务器依赖(package_server.json)
```json
{
  "axios": "^1.7.9",
  "express": "^4.21.2",
  "multer": "^1.4.5-lts.1",
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.8.0",
  "docx": "^8.5.0",
  "pdfkit": "^0.14.0"
}
```

## 项目特点

- **混合架构**: 原生小程序 + uni-app组件库
- **双代理模式**: 云函数 + 自建服务器两种API调用方式
- **教育垂直领域**: 专注教师工作场景(备课、出题、评语、论文等)
- **多模态交互**: 支持文本、图像、语音(语音识别待完善)输入
