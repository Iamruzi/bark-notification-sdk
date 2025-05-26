# Bark 通知 Python SDK

这是一个用于 [Bark](https://github.com/Finb/Bark) iOS 推送通知服务的 Python 客户端。使用这个 SDK，您可以轻松地从 Python 应用程序向您的 iPhone 发送自定义通知。

## 特性

- 简洁、Pythonic 的 API 设计，带有类型提示
- 支持所有 Bark 通知参数
- 灵活的 GET 或 POST 请求发送方式
- 兼容自托管的 Bark 服务器
- 代码文档完善，附带示例

## 安装

```bash
# 方式 1：将 bark_sdk.py 文件复制到您的项目中
cp bark_sdk.py /path/to/your/project/

# 方式 2：使用 pip 从目录安装
pip install -e .
```

## 使用方法

```python
from bark_sdk import BarkNotification, BarkClientException, BarkNetworkException, BarkServerException

try:
    # 使用您的 Bark 密钥初始化
    bark = BarkNotification(key="YOUR_BARK_KEY")
    
    # 发送简单通知
    response = bark.send(body="来自 Python 的问候！")
    print(response)
    
    # 发送带标题和正文的通知
    response = bark.send(
        title="通知标题",
        body="通知内容"
    )
    
    # 发送包含所有参数的通知
    response = bark.send(
        title="标题",
        subtitle="副标题",
        body="主要内容，\n可以包含多行文本！",
        url="https://example.com",
        group="my-notifications",
        sound="alarm",
        level="timeSensitive"
    )
    
    # 使用 POST 方法代替 GET
    response = bark.send_post(
        title="POST 通知",
        body="这条通知使用 POST 请求发送",
        group="post-examples"
    )
except BarkClientException as e:
    print(f"客户端错误: {e}")
except BarkNetworkException as e:
    print(f"网络错误: {e}")
except BarkServerException as e:
    print(f"服务器错误: {e}")
    if e.response:
        print(f"响应详情: {e.response}")
except Exception as e:
    print(f"未预期的错误: {e}")

## GET 与 POST 方法的区别

本 SDK 提供了两种发送通知的方法：`send()` (GET) 和 `send_post()` (POST)。以下是它们的主要区别：

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

### `BarkNotification(key, server_url=None)`
- `key` (str): 您的 Bark iOS 应用中的密钥
- `server_url` (str, 可选): 自托管 Bark 服务器的 URL

### `send(body, title=None, subtitle=None, url=None, group=None, icon=None, sound=None, call=None, level=None, is_archive=None, copy=None, ciphertext=None)`
- `body` (str): 通知的主要内容
- `title` (str, 可选): 通知标题
- `subtitle` (str, 可选): 通知副标题
- `url` (str, 可选): 点击通知后打开的 URL
- `group` (str, 可选): 通知分组标识符
- `icon` (str, 可选): 自定义图标 URL（仅适用于 iOS 15 及以上版本）
- `sound` (str, 可选): 自定义通知声音
- `call` (bool, 可选): 如果为 True，将连续播放声音 30 秒
- `level` (str, 可选): 通知重要性级别："active"、"timeSensitive"、"passive" 或 "critical"
- `is_archive` (bool, 可选): 是否归档通知
- `copy` (str, 可选): 按下通知时复制到剪贴板的文本
- `ciphertext` (str, 可选): 加密的通知内容

### `send_post(body, title=None, subtitle=None, **kwargs)`
使用 POST 请求而不是 GET 发送通知。

### 异常处理

SDK 定义了以下异常类型以便更好地处理错误:

- `BarkException`: 所有 Bark SDK 异常的基类
- `BarkClientException`: 客户端验证错误，例如参数无效
- `BarkNetworkException`: 与 Bark 服务器通信时的网络错误
- `BarkServerException`: Bark 服务器返回的错误响应

## 自托管服务器支持

如果您正在运行自己的 Bark 服务器，可以在初始化客户端时指定服务器 URL：

```python
bark = BarkNotification(key="YOUR_BARK_KEY", server_url="https://your-bark-server.com")
```

## 示例

查看包含的示例文件：
- `example.py` - Python SDK 使用示例

## 系统要求

- Python 3.6+
- `requests` 库

## 许可证

MIT

## 链接

- [Bark GitHub 仓库](https://github.com/Finb/Bark)
- [Bark 网站](https://bark.day.app/) 