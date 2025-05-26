# Bark 通知 Go SDK

这是一个用于 [Bark](https://github.com/Finb/Bark) iOS 推送通知服务的 Go 客户端。使用这个 SDK，您可以轻松地从 Go 应用程序向您的 iPhone 发送自定义通知。

## 特性

- 简洁、符合 Go 习惯的 API
- 支持所有 Bark 通知参数
- 灵活的 GET 或 POST 请求发送方式
- 兼容自托管的 Bark 服务器
- 提供完善的错误处理机制
- 代码文档完善，附带示例

## 安装

```bash
go get github.com/okx_brc20_app/3rdparty/notification/bark/go
```

## 使用方法

```go
package main

import (
	"fmt"
	
	"github.com/okx_brc20_app/3rdparty/notification/bark/go/bark"
)

func main() {
	// 使用您的 Bark 密钥创建客户端
	client, err := bark.NewClient("YOUR_BARK_KEY", "")
	if err != nil {
		fmt.Printf("创建客户端错误: %v\n", err)
		return
	}
	
	// 发送简单通知
	response, err := client.Send(bark.NotificationOptions{
		Body: "来自 Go 的问候！",
	})
	if err != nil {
		// 检查具体错误类型
		switch err {
		case bark.ErrEmptyBody:
			fmt.Println("错误: 通知内容不能为空")
		case bark.ErrInvalidLevel:
			fmt.Println("错误: 无效的通知级别")
		default:
			// 处理其他错误
			if barkErr, ok := err.(*bark.BarkError); ok {
				fmt.Printf("Bark 错误: %s (状态码: %d)\n", barkErr.Message, barkErr.StatusCode)
				if barkErr.Response != nil {
					fmt.Printf("响应: %+v\n", barkErr.Response)
				}
			} else {
				fmt.Printf("错误: %v\n", err)
			}
		}
	} else {
		fmt.Printf("成功! 状态码: %d, 消息: %s\n", response.Code, response.Message)
	}
	
	// 发送带有更多参数的通知
	response, err = client.Send(bark.NotificationOptions{
		Title:    "重要通知",
		Subtitle: "来自 Go SDK",
		Body:     "这是一条来自 Go 的测试通知",
		URL:      "https://github.com/Finb/Bark",
		Group:    "go-notifications",
		Sound:    "alarm",
		Level:    bark.LevelTimeSensitive,
	})
	if err != nil {
		fmt.Printf("错误: %v\n", err)
	} else {
		fmt.Printf("成功! 状态码: %d, 消息: %s\n", response.Code, response.Message)
	}
	
	// 使用 POST 请求代替 GET
	response, err = client.SendPost(bark.NotificationOptions{
		Title: "POST 通知",
		Body:  "这条通知使用 POST 发送",
	})
	if err != nil {
		fmt.Printf("错误: %v\n", err)
	} else {
		fmt.Printf("成功! 状态码: %d, 消息: %s\n", response.Code, response.Message)
	}
}
```

## GET 与 POST 方法的区别

本 SDK 提供了两种发送通知的方法：`Send()` (GET) 和 `SendPost()` (POST)。以下是它们的主要区别：

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

### Client

```go
// 创建新的 Bark 客户端
client, err := bark.NewClient(key, serverURL)
```

参数:
- `key` (string): 您的 Bark iOS 应用中的密钥
- `serverURL` (string, 可选): 自托管 Bark 服务器的 URL。如果为空，使用默认值 "https://api.day.app"

### Send

```go
response, err := client.Send(options)
```

使用 GET 请求发送通知。

### SendPost

```go
response, err := client.SendPost(options)
```

使用 POST 请求发送通知。

### NotificationOptions

```go
options := bark.NotificationOptions{
    Body:       "通知主要内容",
    Title:      "通知标题",
    Subtitle:   "通知副标题",
    URL:        "https://example.com",
    Group:      "notification-group",
    Icon:       "https://example.com/icon.png",
    Sound:      "alarm",
    Call:       false,
    Level:      bark.LevelActive, // 或 LevelTimeSensitive, LevelPassive, LevelCritical
    IsArchive:  false,
    Copy:       "要复制的文本",
    Ciphertext: "",
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `Body` | string | 通知的主要内容 (必填) |
| `Title` | string | 通知标题 |
| `Subtitle` | string | 通知副标题 |
| `URL` | string | 点击通知后打开的 URL |
| `Group` | string | 通知分组标识符 |
| `Icon` | string | 自定义图标 URL（仅适用于 iOS 15 及以上版本）|
| `Sound` | string | 自定义通知声音 |
| `Call` | bool | 如果为 true，将连续播放声音 30 秒 |
| `Level` | string | 通知重要性级别 |
| `IsArchive` | bool | 是否归档通知 |
| `Copy` | string | 按下通知时复制到剪贴板的文本 |
| `Ciphertext` | string | 加密的通知内容 |

### Response

```go
type Response struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}
```

### 错误处理

SDK 定义了以下错误类型以便更好地处理错误:

```go
var (
    // ErrEmptyKey 当没有提供 Bark 密钥时返回
    ErrEmptyKey = errors.New("bark key cannot be empty")

    // ErrEmptyBody 当没有提供通知内容时返回
    ErrEmptyBody = errors.New("notification body cannot be empty")

    // ErrInvalidLevel 当提供了无效的通知级别时返回
    ErrInvalidLevel = errors.New("invalid level value. must be one of: active, timeSensitive, passive, critical")
)

// BarkError 表示 Bark API 返回的错误
type BarkError struct {
    // Message 是错误消息
    Message string

    // StatusCode 是 HTTP 状态码
    StatusCode int

    // Response 是原始响应数据
    Response *Response
}
```

## 自托管服务器支持

如果您正在运行自己的 Bark 服务器，可以在创建客户端时指定服务器 URL：

```go
client, err := bark.NewClient("YOUR_BARK_KEY", "https://your-bark-server.com")
```

## 示例

查看 `example` 目录中的完整示例。

## 系统要求

- Go 1.13+

## 许可证

MIT

## 链接

- [Bark GitHub 仓库](https://github.com/Finb/Bark)
- [Bark 网站](https://bark.day.app/) 