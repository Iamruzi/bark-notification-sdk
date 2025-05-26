# Bark 通知 SDK

本项目提供了用于 [Bark](https://github.com/Finb/Bark) iOS 推送通知服务的 Python、JavaScript 和 Go 语言 SDK。Bark 是一个免费、简单且安全的方式，可以向您的 iPhone 发送自定义通知。

## 可用的 SDK

- [Python SDK](./python/)
- [JavaScript SDK](./javascript/)
- [Go SDK](./go/)

## 什么是 Bark？

[Bark](https://github.com/Finb/Bark) 是一款 iOS 应用，允许您向 iPhone 推送自定义通知。它是免费、开源的，利用 Apple 推送通知服务 (APNs) 工作，不会消耗设备电池。

Bark 支持 iOS 通知的多种高级功能，包括：
- 通知分组
- 自定义推送图标
- 自定义声音
- 时效性通知
- 紧急警报
- 等等

## 我们的 SDK 特性

- **简单集成**：Python、JavaScript 和 Go 的易用 API
- **全面参数支持**：支持所有 Bark 通知参数
- **灵活性**：通过 GET 或 POST 请求发送通知
- **自托管服务器支持**：兼容自托管的 Bark 服务器
- **完善的错误处理**：各语言 SDK 都提供了全面的错误捕获和处理机制
- **文档完善**：清晰的文档和使用示例

## GET 与 POST 方法的区别

我们的 SDK 提供了 GET 和 POST 两种方法发送通知。以下是主要区别：

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

5. **API 使用方式**：
   - Python：`bark.send()` vs `bark.send_post()`
   - JavaScript：`bark.send()` vs `bark.sendPost()`
   - Go：`client.Send()` vs `client.SendPost()`

在大多数情况下，对于简单的通知，两种方法都能正常工作，但对于包含特殊字符或较长内容的通知，推荐使用 POST 方法。

## 快速使用示例

### Python

```python
from bark_sdk import BarkNotification

# 使用您的 Bark 密钥初始化
bark = BarkNotification(key="YOUR_BARK_KEY")

# 发送简单通知
response = bark.send(body="来自 Python 的问候！")
```

### JavaScript

```javascript
// 使用您的 Bark 密钥初始化
const bark = new BarkNotification('YOUR_BARK_KEY');

// 发送简单通知
bark.send({ body: '来自 JavaScript 的问候！' })
  .then(response => console.log('通知已发送:', response))
  .catch(error => console.error('错误:', error));
```

### Go

```go
// 使用您的 Bark 密钥创建客户端
client, err := bark.NewClient("YOUR_BARK_KEY", "")

// 发送简单通知
response, err := client.Send(bark.NotificationOptions{
    Body: "来自 Go 的问候！",
})
```

## 许可证

MIT

## 链接

- [Bark GitHub 仓库](https://github.com/Finb/Bark)
- [Bark 网站](https://bark.day.app/)