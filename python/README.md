# Bark Notification Python SDK

A Python client for the [Bark](https://github.com/Finb/Bark) iOS push notification service. This SDK allows you to easily send custom notifications to your iPhone from Python applications.

## Features

- Simple, Pythonic API with type hints
- Support for all Bark notification parameters
- Flexible sending via GET or POST requests
- Compatibility with self-hosted Bark servers
- Well-documented code with examples

## Installation

```bash
# Option 1: Copy the bark_sdk.py file to your project
cp bark_sdk.py /path/to/your/project/

# Option 2: Install from the directory using pip
pip install -e .
```

## Usage

```python
from bark_sdk import BarkNotification

# Initialize with your Bark key
bark = BarkNotification(key="YOUR_BARK_KEY")

# Send a simple notification
response = bark.send(body="Hello from Python!")
print(response)

# Send a notification with title and body
response = bark.send(
    title="Notification Title",
    body="Notification content"
)

# Send a comprehensive notification
response = bark.send(
    title="Title",
    subtitle="Subtitle",
    body="Main content with\nmultiple lines",
    url="https://example.com",
    group="my-notifications",
    sound="alarm",
    level="timeSensitive"
)

# Use POST instead of GET
response = bark.send_post(
    title="POST Notification",
    body="This notification uses POST",
    group="post-examples"
)
```

## GET vs POST Methods

This SDK provides two methods for sending notifications: `send()` (GET) and `send_post()` (POST). Here are the key differences:

1. **Parameter Transmission**: 
   - GET: Parameters are passed through URL path and query string
   - POST: Parameters are passed in the request body as JSON

2. **Data Size Limitations**:
   - GET: Limited by URL length (typically 2048 characters)
   - POST: Almost no length limitations, better for longer notification content

3. **Security**:
   - GET: Parameters are visible in the URL, less secure for sensitive information
   - POST: Parameters are in the request body, not visible in the URL

4. **URL Encoding**:
   - GET: Special characters must be properly encoded, which may cause encoding issues
   - POST: Data is sent as JSON, avoiding URL encoding problems

For simple notifications, both methods work well, but POST is recommended for notifications with special characters or longer content.

## API Reference

### `BarkNotification(key, server_url=None)`
- `key` (str): Your Bark key from the Bark iOS app
- `server_url` (str, optional): Custom server URL if you're self-hosting Bark

### `send(body, title=None, subtitle=None, url=None, group=None, icon=None, sound=None, call=None, level=None, is_archive=None, copy=None, ciphertext=None)`
- `body` (str): Main notification content
- `title` (str, optional): Notification title
- `subtitle` (str, optional): Notification subtitle
- `url` (str, optional): URL to open when notification is tapped
- `group` (str, optional): Group identifier for notifications
- `icon` (str, optional): Custom icon URL (iOS 15+ only)
- `sound` (str, optional): Custom notification sound
- `call` (bool, optional): If True, plays sound repeatedly for 30 seconds
- `level` (str, optional): Notification importance level: "active", "timeSensitive", "passive", or "critical"
- `is_archive` (bool, optional): Whether to archive the notification
- `copy` (str, optional): Text to copy to clipboard when notification is pressed
- `ciphertext` (str, optional): Encrypted notification content

### `send_post(body, title=None, subtitle=None, **kwargs)`
Send notifications using POST rather than GET.

## Self-hosted Server Support

If you're running your own Bark server, you can specify the server URL when initializing the client:

```python
bark = BarkNotification(key="YOUR_BARK_KEY", server_url="https://your-bark-server.com")
```

## Example

See the included example file:
- `example.py` - Examples of using the Python SDK

## Requirements

- Python 3.6+
- `requests` library

## License

MIT

## Links

- [Bark GitHub Repository](https://github.com/Finb/Bark)
- [Bark Website](https://bark.day.app/) 