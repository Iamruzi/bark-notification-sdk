# Bark 通知 JavaScript SDK

这是一个用于 [Bark](https://github.com/Finb/Bark) iOS 推送通知服务的 JavaScript 客户端。使用这个 SDK，您可以轻松地从 JavaScript 应用程序向您的 iPhone 发送自定义通知。

## 特性

- 使用基于 Promise 的 API 的现代 ES6+ JavaScript
- 提供 TypeScript 声明文件以获得更好的 IDE 支持
- 兼容浏览器和 Node.js 环境
- 支持所有 Bark 通知参数
- 灵活的 GET 或 POST 请求发送方式
- 兼容自托管的 Bark 服务器
- 完善的错误处理机制

## 安装

### 浏览器

```html
<!-- 在 HTML 中引入 SDK -->
<script src="path/to/bark_sdk.js"></script>
```

### Node.js

```bash
# 方式 1：将 bark_sdk.js 和 bark_sdk.d.ts 文件复制到您的项目中
cp bark_sdk.js bark_sdk.d.ts /path/to/your/project/

# 方式 2：使用 npm 从目录安装
npm install .

# 对于 Node.js < 18，您还需要安装 fetch polyfill
npm install node-fetch
```

## 使用方法

### 浏览器

```javascript
// 使用您的 Bark 密钥初始化
const bark = new BarkNotification('YOUR_BARK_KEY');

// 发送简单通知
bark.send({ body: '来自 JavaScript 的问候！' })
  .then(response => console.log('通知已发送:', response))
  .catch(error => {
    if (error instanceof BarkClientException) {
      console.error('客户端错误:', error.message);
    } else if (error instanceof BarkNetworkException) {
      console.error('网络错误:', error.message);
    } else if (error instanceof BarkServerException) {
      console.error('服务器错误:', error.message, '状态码:', error.statusCode);
      if (error.response) {
        console.error('响应详情:', error.response);
      }
    } else {
      console.error('未预期的错误:', error);
    }
  });

// 发送包含所有参数的通知
bark.send({
  title: '标题',
  subtitle: '副标题',
  body: '主要内容，\n可以包含多行文本！',
  url: 'https://example.com',
  group: 'my-notifications',
  sound: 'alarm',
  level: 'timeSensitive'
})
  .then(response => console.log('通知已发送:', response))
  .catch(error => console.error('发送通知时出错:', error));

// 使用 POST 方法代替 GET
bark.sendPost({
  title: 'POST 通知',
  body: '这条通知使用 POST 请求发送',
  group: 'post-examples'
})
  .then(response => console.log('通知已发送:', response))
  .catch(error => console.error('发送通知时出错:', error));
```

### Node.js

```javascript
const BarkNotification = require('./bark_sdk');
const { BarkClientException, BarkNetworkException, BarkServerException } = require('./bark_sdk');

// 对于 Node.js < 18，您需要设置 fetch polyfill
// const fetch = require('node-fetch');
// global.fetch = fetch;

// 使用您的 Bark 密钥初始化
const bark = new BarkNotification('YOUR_BARK_KEY');

// 发送通知（与浏览器示例相同）
bark.send({ body: '来自 Node.js 的问候！' })
  .then(response => console.log('通知已发送:', response))
  .catch(error => {
    // 类型化的错误处理
    if (error instanceof BarkClientException) {
      console.error('客户端错误:', error.message);
    } else if (error instanceof BarkNetworkException) {
      console.error('网络错误:', error.message);
    } else if (error instanceof BarkServerException) {
      console.error('服务器错误:', error.message, '状态码:', error.statusCode);
    } else {
      console.error('未预期的错误:', error);
    }
  });
```

## GET 与 POST 方法的区别

本 SDK 提供了两种发送通知的方法：`send()` (GET) 和 `sendPost()` (POST)。以下是它们的主要区别：

1. **参数传递方式**：
   - GET：参数通过 URL 路径和查询字符串传递
   - POST：参数通过请求体 (JSON) 传递

2. **数据量限制**：
   - GET：受 URL 长度限制（通常 2048 字符），不适合发送长文本
   - POST：几乎没有长度限制，可以发送更长的通知内容

3. **安全性**：
   - GET：参数在 URL 中可见，对敏感信息安全性较低
   - POST：参数在请求体中，不会显示在 URL 中，相对更安全

4. **URL 编码问题**：
   - GET：必须正确编码特殊字符，可能出现编码问题
   - POST：JSON 格式传递数据，避免 URL 编码问题

在大多数情况下，对于简单的通知，两种方法都能正常工作，但对于包含特殊字符或较长内容的通知，推荐使用 POST 方法。

## API 参考

### `new BarkNotification(key, serverUrl='https://api.day.app')`
- `key` (string): 您的 Bark iOS 应用中的密钥
- `serverUrl` (string, 可选): 自托管 Bark 服务器的 URL

### `send(options)`
- `options.body` (string): 通知的主要内容
- `options.title` (string, 可选): 通知标题
- `options.subtitle` (string, 可选): 通知副标题
- `options.url` (string, 可选): 点击通知后打开的 URL
- `options.group` (string, 可选): 通知分组标识符
- `options.icon` (string, 可选): 自定义图标 URL（仅适用于 iOS 15 及以上版本）
- `options.sound` (string, 可选): 自定义通知声音
- `options.call` (boolean, 可选): 如果为 true，将连续播放声音 30 秒
- `options.level` (string, 可选): 通知重要性级别："active"、"timeSensitive"、"passive" 或 "critical"
- `options.isArchive` (boolean, 可选): 是否归档通知
- `options.copy` (string, 可选): 按下通知时复制到剪贴板的文本
- `options.ciphertext` (string, 可选): 加密的通知内容

### `sendPost(options)`
使用 POST 请求而不是 GET 发送通知。选项与 `send()` 相同。

### 异常处理

SDK 定义了以下异常类型以便更好地处理错误:

- `BarkException`: 所有 Bark SDK 异常的基类
- `BarkClientException`: 客户端验证错误，例如参数无效
- `BarkNetworkException`: 与 Bark 服务器通信时的网络错误
- `BarkServerException`: Bark 服务器返回的错误响应

## TypeScript 支持

此 SDK 包含 `bark_sdk.d.ts` 中的 TypeScript 声明，为 TypeScript 项目提供完整的类型检查和 IDE 自动完成功能。

## 自托管服务器支持

如果您正在运行自己的 Bark 服务器，可以在初始化客户端时指定服务器 URL：

```javascript
const bark = new BarkNotification('YOUR_BARK_KEY', 'https://your-bark-server.com');
```

## 示例

查看包含的示例文件：
- `example.js` - Node.js 环境中使用 JavaScript SDK 的示例

## 系统要求

- 现代浏览器或 Node.js 12+
- 对于 Node.js < 18: 需要 `node-fetch` 库

## 许可证

MIT

## 链接

- [Bark GitHub 仓库](https://github.com/Finb/Bark)
- [Bark 网站](https://bark.day.app/) 