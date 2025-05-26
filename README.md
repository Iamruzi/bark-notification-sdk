# Bark Notification SDK

This package provides Python, JavaScript, and Go SDKs for the [Bark](https://github.com/Finb/Bark) iOS push notification service. Bark is a free, simple, and secure way to send custom notifications to your iPhone.

## Available SDKs

- [Python SDK](./python/)
- [JavaScript SDK](./javascript/)
- [Go SDK](./go/)

## What is Bark?

[Bark](https://github.com/Finb/Bark) is an iOS App which allows you to push custom notifications to your iPhone. It's free, open-source, and leverages Apple Push Notification service (APNs) without draining your device battery.

Bark supports many advanced features of iOS notifications, including:
- Notification grouping
- Custom push icons
- Custom sounds
- Time-sensitive notifications
- Critical alerts
- And more

## Features of our SDKs

- **Simple Integration**: Easy-to-use APIs for Python, JavaScript, and Go
- **Comprehensive Parameter Support**: All Bark notification parameters are supported
- **Flexible**: Send notifications via GET or POST requests
- **Self-hosted Support**: Compatible with self-hosted Bark servers
- **Well-documented**: Clear docstrings and examples

## GET vs POST Methods

Our SDKs provide both GET and POST methods for sending notifications. Here are the key differences:

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

5. **Usage in SDKs**:
   - Python: `bark.send()` vs `bark.send_post()`
   - JavaScript: `bark.send()` vs `bark.sendPost()`
   - Go: `client.Send()` vs `client.SendPost()`

For simple notifications, both methods work well, but POST is recommended for notifications with special characters or longer content.

## Quick Usage Examples

### Python

```python
from bark_sdk import BarkNotification

# Initialize with your Bark key
bark = BarkNotification(key="YOUR_BARK_KEY")

# Send a simple notification
response = bark.send(body="Hello from Python!")
```

### JavaScript

```javascript
// Initialize with your Bark key
const bark = new BarkNotification('YOUR_BARK_KEY');

// Send a simple notification
bark.send({ body: 'Hello from JavaScript!' })
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error:', error));
```

### Go

```go
// Create a client with your Bark key
client := bark.NewClient("YOUR_BARK_KEY", "")

// Send a simple notification
response, err := client.Send(bark.NotificationOptions{
    Body: "Hello from Go!",
})
```

## License

MIT

## Links

- [Bark GitHub Repository](https://github.com/Finb/Bark)
- [Bark Website](https://bark.day.app/) 