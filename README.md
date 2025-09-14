<p align="center">
  <img src="assets/icons/qwacky.png" alt="Qwacky Logo" width="128" height="128">
</p>

# 为什么选择 Qwacky？

我使用 [DuckDuckGo 邮件保护](https://duckduckgo.com/email) 服务已经有一段时间了，并且非常欣赏它。然而，安装完整的 DuckDuckGo 扩展程序带来了一些挑战：

- 您无法全局禁用跟踪保护功能
- 您需要为每个网站手动禁用跟踪保护
- 该扩展程序会将您的默认搜索引擎更改为 DuckDuckGo
- 无法单独使用邮件保护服务

这就是我创建 Qwacky 的原因 - 最初是为了个人使用，但我意识到其他人可能面临同样的问题。作为一个一直想通过有用的工具为开源社区做出贡献的人，我决定公开分享这个项目。

## 下载

<p align="center">
<a href="https://chromewebstore.google.com/detail/qwacky/kieehbhdbincplacegpjdkoglfakboeo"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="获取 Chrome 版 Qwacky"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/qwacky/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="获取 Firefox 版 Qwacky"></a>
</p>

## 功能特性
- 生成和管理私有的 @duck.com 邮件地址
- 将生成的地址复制到剪贴板
- 从上下文菜单自动填充和复制输入框中的地址，快速生成地址
- 在本地存储生成的地址
- 支持多个账户
- 为每个生成的地址添加备注
- 导出/导入设置（CSV 和 JSON）

### 浏览器兼容性

Qwacky 旨在与 Chrome 和 Firefox 无缝协作。构建过程会自动处理特定于浏览器的要求：

- **Chrome**：使用服务工作线程作为后台脚本（Manifest V3）
- **Firefox**：使用带有 polyfill 支持的后台脚本（Manifest V3）

两个版本在保持功能对等的同时，都遵循各自浏览器的最佳实践和安全模型。

## 截图
![Qwacky 横幅](assets/images/banner2.png)
> **非常感谢 [@m.miriam12398](https://www.instagram.com/m.miriam12398/) 为项目贡献了如此酷炫的设计！**

# 安全与隐私
- 使用功能所需的最小权限
- 所有数据都存储在您的本地设备上
- 无跟踪或分析
- Manifest V3 提供更好的安全性
- 开源以确保透明度

### 权限
- `Storage`：需要在本地存储您生成的地址和设置
- `上下文菜单自动填充`：此开关启用从上下文菜单生成别名，自动检测电子邮件字段，它需要以下可选权限：
  - `contextMenus`：启用上下文菜单以快速生成地址
  - `activeTab`：仅在您明确与扩展程序交互时（例如，使用上下文菜单填充电子邮件地址）才需要访问和向当前选项卡注入脚本
  - `clipboardWrite`：需要将生成的地址复制到剪贴板
  - `scripting`：在使用上下文菜单时以编程方式注入内容脚本所必需的

### 特定于浏览器的权限处理和限制

Firefox 和 Chrome 在管理和显示扩展权限（如 `contextMenus`）方面有所不同：

- **Firefox** 要求在安装时将 `contextMenus` 列入清单的 `permissions` 块中。与 Chrome 不同，Firefox **不支持**在 Manifest V3 中将 `contextMenus` 作为可选权限请求。这是因为该权限直接影响浏览器 UI 元素（如右键菜单），Firefox 强制要求此类更改必须预先明确声明。
- **Chrome** 另一方面，允许 `contextMenus` 在 `optional_permissions` 中声明并在运行时请求。然而，即使在使用 `chrome.permissions.remove()` 以编程方式移除权限后，它们在 `chrome://extensions` 下可能仍显示为"已授予"——即使它们不再处于活动状态。

为了保持兼容性并避免意外行为：
- 我们将 `contextMenus` 包含在 Firefox 的必需权限中。
- 我们尽可能在 Chrome 中使用运行时权限请求，以符合其模型。

这种行为差异是 Chrome 中一个已知的限制，Chromium 团队已经讨论过：
- [Chromium 扩展组 – 可选权限移除行为](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/tqbVLwgVh58)
- [Chrome 开发者文档 – 可选权限](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#optional-permissions)
- [Mozilla Discourse – Firefox 不支持将 `contextMenus` 作为可选权限](https://discourse.mozilla.org/t/contextmenus-as-an-optional-permission/64181)

# 手动安装

#### Chrome
1. 从 [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) 页面下载最新版本
2. 解压下载的文件
3. 打开 Chrome 并转到 `chrome://extensions/`
4. 在右上角启用"开发者模式"
5. 点击"加载已解压的扩展程序"并选择解压后的文件夹

#### Firefox
1. 从 [GitHub Releases](https://github.com/Lanshuns/Qwacky/releases) 页面下载 Firefox 版本（.xpi 文件）
2. 打开 Firefox 并转到 `about:addons`
3. 点击齿轮图标并选择"从文件安装附加组件..."
4. 选择下载的 .xpi 文件

# 开发

### 前提条件
- Node.js（v16 或更高版本）
- npm（v7 或更高版本）

### 设置
```bash
# 1. 克隆仓库
git clone https://github.com/Lanshuns/Qwacky.git
cd qwacky
# 2. 安装依赖
npm install
```

### 开发模式

```bash
# 对于 Chrome
npm run dev
# 对于 Firefox
npm run dev:firefox
```

### 生产构建

```bash
# 对于 Chrome
npm run build
# 对于 Firefox
npm run build:firefox
```

构建的扩展程序将在 `dist` 目录中可用。

> **注意**：对于 Firefox 中的开发和临时安装，您可以使用 `about:debugging` 方法：
> 1. 转到 `about:debugging`
> 2. 在左侧边栏中点击"This Firefox"
> 3. 点击"加载临时附加组件"
> 4. 从解压后的文件夹中选择 `manifest.json` 文件

# 致谢

本项目是基于 DuckDuckGo 的邮件保护服务的衍生作品，该服务根据 Apache License 2.0 许可。原作品的版权声明：

版权所有 (c) 2010-2021 Duck Duck Go, Inc.

完整的许可证文本，请参见 [APACHE-LICENSE](https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/main/LICENSE.md)。

---

**English Version**: [README_en.md](README_en.md)
**原作者项目**: [Lanshuns/Qwacky](https://github.com/Lanshuns/Qwacky)