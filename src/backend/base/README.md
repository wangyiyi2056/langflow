
```markdown:src/backend/base/README.md
# Langflow 后端架构说明

## 项目目录结构

```text
src/backend/
├── base/                    # 核心基础模块
│   ├── langflow/           # 主应用逻辑
│   │   ├── api/            # API 接口层
│   │   │   ├── v1/        # 版本化接口 (认证/流程/文件等)
│   │   │   └── v2/        # 新版接口规范
│   │   ├── components/     # 组件系统 (50+ 预置组件)
│   │   │   ├── logic/      # 逻辑控制组件
│   │   │   │   ├── conditional_router.py  # 条件路由
│   │   │   │   └── loop.py                # 循环控制
│   │   │   ├── data/       # 数据处理组件
│   │   │   │   ├── csv_to_data.py         # CSV 处理
│   │   │   │   └── sql_executor.py        # SQL 执行
│   │   │   ├── models/     # 大模型集成
│   │   │   │   └── baidu_qianfan_chat.py  # 百度千帆
│   │   │   └── crewai/     # 多智能体系统
│   │   ├── core/           # 运行时核心
│   │   │   ├── celery/     # 异步任务处理
│   │   │   └── caching/    # 缓存机制
│   │   ├── inputs/         # 输入类型系统
│   │   │   ├── bool_input.py    # 布尔类型
│   │   │   └── dropdown_input.py # 下拉选择
│   │   ├── services/       # 服务支撑层
│   │   │   ├── auth/       # 认证授权
│   │   │   ├── database/   # 数据库服务
│   │   │   └── task/       # 任务调度服务
│   │   ├── schema/         # 数据模型定义
│   │   │   ├── data.py     # 基础数据模型
│   │   │   └── message.py  # 消息协议
│   │   └── main.py         # FastAPI 入口
├── tests/                   # 测试套件
│   ├── unit/               # 单元测试
│   │   ├── components/     # 组件测试
│   │   └── services/       # 服务测试
│   ├── integration/       # 集成测试
│   └── performance/        # 性能测试
├── Dockerfile              # 容器化构建
├── Makefile                # 项目构建指令集
└── .gitignore              # 版本控制规则
```

## 核心模块说明

### 1. 组件系统 (components)
- **动态加载**：通过 `interface/initialize/loading.py` 实现热加载
- **分类存储**：
  - `logic/`: 流程控制组件（条件路由/循环等）
  - `data/`: 数据接入组件（API/数据库/文件等）
  - `models/`: 大模型接入组件（OpenAI/百度千帆等）
- **扩展机制**：支持用户自定义组件 (`~/.langflow/components`)

### 2. 服务层 (services)
- **认证服务**：JWT/OAuth2 实现
- **任务服务**：
  - Celery 异步任务
  - Redis 任务队列
- **存储服务**：本地/S3 文件存储抽象

### 3. API 设计
- **版本隔离**：v1/v2 接口独立路由
- **功能分组**：
  - `/flows`: 流程管理
  - `/files`: 文件操作
  - `/auth`: 认证相关
- **OpenAPI 3.0**：自动生成接口文档

## 开发指南

### 新增组件
1. 在 `components/` 对应分类中添加 Python 类
2. 实现 `build()` 方法定义组件逻辑
3. 在目录 `__init__.py` 中注册组件
```python
# components/new_category/__init__.py
from .your_component import YourComponent

__all__ = ["YourComponent"]
```

### 调试执行
```bash
# 启动开发服务器
make backend  # 热重载模式

# 运行单元测试
make test components=your_component
```

### 部署构建
```bash
# 生成生产镜像
docker build -f docker/prod.Dockerfile -t langflow-backend .

# 容器运行
docker run -p 7860:7860 -e LANGFLOW_LOG_LEVEL=info langflow-backend
```


