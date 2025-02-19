# 设置开发环境

本文档详细介绍了如何设置本地开发环境，以便您可以对项目进行更改并贡献代码！

## 基本要求

* 项目托管在 GitHub 上，因此您需要在那里拥有一个账户（如果您正在阅读本文，您可能已经有了！）
* 一个集成开发环境（IDE），例如 Microsoft VS Code IDE https://code.visualstudio.com/

## 设置 Git 仓库 Fork

您将把更改推送到 Langflow 仓库的一个 fork，然后从那里创建一个 Pull Request 到项目仓库。

Fork [Langflow GitHub 仓库](https://github.com/langflow-ai/langflow/fork)，并按照说明创建一个新的 fork。

在您的新 fork 上，点击“<> Code”按钮以获取 URL，使用您喜欢的方法[克隆](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)仓库；例如使用 `https`：

```bash
git clone https://github.com/<您的用户名>/langflow.git
```

最后，将项目仓库添加为 `upstream`：

```bash
cd langflow
git remote add upstream https://github.com/langflow-ai/langflow.git
git remote set-url --push upstream no_push
```

> [!TIP]
> **Windows/WSL 用户**：您可能会发现文件“更改”，特别是文件模式，例如“更改文件模式 100755 → 100644”。您可以通过 `git config core.filemode false` 来解决此问题。

## 设置环境

有两种选择：推荐且简单的选择是使用开发容器（“[Dev Container](https://containers.dev/)”），或者您可以选择使用自己的操作系统/环境。

### 选项 1（推荐）：使用开发容器

按照您的 IDE 的说明将此仓库作为开发容器打开。

#### Microsoft VS Code

* 请参阅[在容器内开发](https://code.visualstudio.com/docs/devcontainers/containers)
* 您可能还会发现与容器[共享 `git` 凭据](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)很有帮助

### 选项 2：使用您自己的环境

安装先决条件：

* **操作系统**：macOS 或 Linux；Windows 用户***必须***在 WSL 下进行开发。
* **`git`**：项目使用无处不在的 `git` 工具进行变更控制。
* **`make`**：项目使用 `make` 来协调打包。
* **`uv`**：该项目使用 `uv`（`>=0.4`），这是来自 Astral 的 Python 包和项目管理器。安装说明请参阅 https://docs.astral.sh/uv/getting-started/installation/。
* **`npm`**：前端文件使用 Node.js（`v22.12 LTS`）和 `npm`（`v10.9`）构建。安装说明请参阅 https://nodejs.org/en/download/package-manager。
  - Windows（WSL）用户：确保 `npm` 安装在 WSL 环境中；`which npm` 应解析为 Linux 位置，而不是 Windows 位置。

### 初始环境验证

通过运行以下命令设置并验证初始环境：

```bash
make init
```

这将通过安装后端和前端依赖项、构建前端静态文件并初始化项目来设置开发环境。它运行 `make install_backend`、`make install_frontend`、`make build_frontend`，最后运行 `uv run langflow run` 以启动应用程序。

一旦应用程序运行，命令输出应类似于：

```
╭───────────────────────────────────────────────────────────────────╮
│ Welcome to ⛓ Langflow                                             │
│                                                                   │
│                                                                   │
│ Collaborate, and contribute at our GitHub Repo 🌟                 │
│                                                                   │
│ We collect anonymous usage data to improve Langflow.              │
│ You can opt-out by setting DO_NOT_TRACK=true in your environment. │
│                                                                   │
│ Access http://127.0.0.1:7860                                      │
╰───────────────────────────────────────────────────────────────────╯
```

此时，通过打开显示的 URL 来验证您是否可以访问 UI。

这是应用程序通常的运行方式：编译（静态）前端页面，然后由 FastAPI 服务器提供“前端”服务；后端 API 也由 FastAPI 服务器提供服务。

然而，作为开发人员，您将希望继续下一步。通过按下 `Control（或 Command）-C` 来关闭 Langflow。

## 完成开发环境设置

在您准备好开始开发之前，还需要考虑一些其他步骤。

### 可选的 pre-commit 钩子

Pre-commit 钩子将帮助保持您的更改干净且格式良好。

> [!NOTE]
> 安装这些钩子后，`git commit` 命令需要在 Python 环境中运行；您的语法需要更改为 `uv run git commit`。

通过运行以下命令安装 pre-commit 钩子：

```bash
uv sync --dev
uv run pre-commit install
```

## 以“开发”模式运行 Langflow

通过上述验证，您现在可以以“热重载”您更改的方式运行后端（FastAPI）和前端（Node）服务。在此模式下，FastAPI 服务器需要一个 Node.js 服务器来提供前端页面，而不是直接提供它们。

> [!NOTE]
> 在正常的开发工作流程中，您可能会有多个终端会话处于活动状态。这些将注释为*后端终端*、*前端终端*、*文档终端*和*构建终端*。

### 调试模式

为 VS Code 用户提供了调试配置：可以从调试选项卡启动（后端调试模式可以直接通过 F5 键启动）。您可能更喜欢以这种模式启动服务。您可能仍然希望阅读以下小节以了解预期的控制台输出和服务准备情况。

### 启动后端服务

后端服务作为 Python 上的 FastAPI 服务运行，并负责处理 API 请求。在*后端终端*中，启动后端服务：

```bash
make backend
```

您将获得类似于以下的输出：

```
INFO:     Will watch for changes in these directories: ['/home/phil/git/langflow']
INFO:     Loading environment from '.env'
INFO:     Uvicorn running on http://0.0.0.0:7860 (Press CTRL+C to quit)
INFO:     Started reloader process [22330] using WatchFiles
Starting Langflow ...
```

此时，您可以在浏览器中检查 http://localhost:7860/health；当后端服务准备就绪时，它将返回一个类似于以下的文档：

```json
{"status":"ok"}
```

### 启动前端服务

前端（用户界面）在发布的代码中（即通过 `langflow run`）是静态编译的文件，后端 FastAPI 服务通过端口 `7860` 提供给客户端。在开发模式下，这些文件由 Node.js 服务在端口 `3000` 上提供。在*前端终端*中，启动前端服务：

```bash
make frontend
```

您将获得类似于以下的输出：

```
  VITE v5.4.11  ready in 552 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

此时，您可以在浏览器中导航到 http://localhost:3000/ 并访问 Langflow 用户界面。

### 构建和显示文档

如果您正在贡献文档更改（总是欢迎的！），这些文档是使用 [Docusaurus](https://docusaurus.io/) 构建的，并使用 Node.js 单独提供服务。

在*文档终端*中（从项目根目录），运行以下命令：

```bash
cd docs
yarn install
yarn start
```

如果前端服务在端口 `3000` 上运行，您可能会被提示 `Would you like to run the app on another port instead?`，在这种情况下回答“是”。您将获得类似于以下的输出：

```
[SUCCESS] Docusaurus website is running at: http://localhost:3001/
```

此时，您可以在浏览器中导航到 http://localhost:3001/ 并查看文档。文档更新将在保存时可见，尽管有时浏览器页面也需要刷新。

## 添加或修改组件

组件位于 `src/backend/base/langflow` 下的文件夹中，它们的单元测试位于 `src/backend/base/tests/unit/components` 下。

### 添加组件

将组件添加到适当的子目录，并将组件添加到 `__init__.py` 文件中（按字母顺序排列 `import` 和 `__all__` 列表）。假设后端和前端服务正在运行，后端服务将在这些文件更改时重新启动。新组件将在后端重新启动后可见，_*并且*_ 在浏览器中点击“刷新”后可见。

> [!TIP]
> 将组件代码从编辑器复制粘贴到 UI 中而不保存源代码会更快，一旦您满意它正在工作，您可以保存（重新启动后端）并刷新浏览器以确认它存在。

您应该尝试为您的组件添加单元测试，尽管模板和最佳实践仍在进行中。至少，请在单元测试子目录中创建一个与您的组件关联的 Markdown 文件（如果不存在则创建目录），文件名与组件相同，但扩展名为 `.md`。其中应包含您手动测试组件的步骤。

### 修改组件

修改组件与添加组件非常相似：通常在 UI 中进行更改然后在仓库中保存文件会更容易。请务必审查和修改单元测试；如果没有组件的单元测试，至少涵盖您更改的单元测试的添加将非常受欢迎！

> [!NOTE]
> 如果在保存更改并重新启动后端服务时画布上有旧版本的组件，则在重新加载画布时（即浏览器刷新），该组件应显示“更新可用”。[问题 5179](https://github.com/langflow-ai/langflow/issues/5179) 表明此行为在开发环境中并不一致。

## 构建和测试更改

当您准备好提交时，在提交之前，您应该考虑以下内容：

* `make lint`
* `make format_backend` 和 `make format_frontend` 将在各自的代码库上运行代码格式化程序
* `make unit_tests` 运行（后端）单元测试（有关测试的更多信息，请参阅“Quirks”部分）。

一旦这些更改准备就绪，将您的更改重新基于 `upstream` 的 `main` 分支是有帮助的，以确保您拥有最新的代码版本！当然，如果您必须将更改合并到您的组件中，您可能需要重新进行 lint/format/unit_test。

作为最终验证，停止后端和前端服务并运行 `make init`；这将进行干净构建，UI 应在端口 `7860` 上可用（因为它已调用 `langflow run`）。打开一个新的浏览器标签页访问此服务，并通过从组件列表中添加您的新/修改组件到画布上来进行最终检查。

## 提交、推送和 Pull Requests

一旦您对更改满意，提交它们并将更改推送到您自己的 fork（如果您按照上述说明操作，这将是 `origin`）。然后，您可以在 GitHub 界面或您的 IDE 中向项目仓库提出 Pull Request。

> [!TIP]
> 请记住，如果您启用了 pre-commit 钩子，您需要将 `git` 命令作为 `uv run git` 运行以激活必要的 Python 环境！

## 一些 Quirks！

您可能会观察到一些奇怪的事情：

### 测试

* 后端测试 `src/backend/tests/unit/test_database.py` 在运行 `make tests` 时可能会失败，但在手动运行时通过
  * 您可以通过顺序运行测试用例来验证这一点：`uv run pytest src/backend/tests/unit/test_database.py`
* 还有一些其他测试目标：`integration_tests`、`coverage`、`tests_frontend`，但这些需要本文档未涵盖的额外设置。

### 更改的文件

有些文件会在您没有进行更改的情况下发生变化：

* `src/backend/base/langflow/initial_setup/starter_projects` 中的文件在 `langflow run` 后修改；这些是格式化更改。您可以随意提交（或忽略）它们。
* `uv.lock` 和 `src/frontend/package-lock.json` 文件可能会被 `make` 目标修改；不应由个人贡献者提交更改。
   * 您可以在 git 中排除这些文件：`git update-index --assume-unchanged uv.lock src/frontend/package-lock.json`
   * 您可以在 git 中重新包含这些文件：`git update-index --no-assume-unchanged uv.lock src/frontend/package-lock.json`