# Bark Notification Go SDK

A Go client for the [Bark](https://github.com/Finb/Bark) iOS push notification service. This SDK allows you to easily send custom notifications to your iPhone from Go applications.

## Features

- Simple, idiomatic Go API
- Support for all Bark notification parameters
- Flexible sending via GET or POST requests
- Compatibility with self-hosted Bark servers
- Well-documented code with examples

## Installation

```bash
go get github.com/okx_brc20_app/3rdparty/notification/bark/go
```

## Usage

```go
package main

import (
	"fmt"
	
	"github.com/okx_brc20_app/3rdparty/notification/bark/go/bark"
)

func main() {
	// Create a client with your Bark key
	client := bark.NewClient("YOUR_BARK_KEY", "")
	
	// Send a simple notification
	response, err := client.Send(bark.NotificationOptions{
		Body: "Hello from Go!",
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success! Code: %d, Message: %s\n", response.Code, response.Message)
	}
	
	// Send a notification with more parameters
	response, err = client.Send(bark.NotificationOptions{
		Title:    "Important Notice",
		Subtitle: "From Go SDK",
		Body:     "This is a test notification from Go",
		URL:      "https://github.com/Finb/Bark",
		Group:    "go-notifications",
		Sound:    "alarm",
		Level:    bark.LevelTimeSensitive,
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success! Code: %d, Message: %s\n", response.Code, response.Message)
	}
	
	// Using POST request instead of GET
	response, err = client.SendPost(bark.NotificationOptions{
		Title: "POST Notification",
		Body:  "This notification was sent using POST",
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Success! Code: %d, Message: %s\n", response.Code, response.Message)
	}
}

## GET vs POST Methods

This SDK provides two methods for sending notifications: `Send()` (GET) and `SendPost()` (POST). Here are the key differences:

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

### Client

```go
// Create a new Bark client
client := bark.NewClient(key, serverURL)
```

Parameters:
- `key` (string): Your Bark key from the Bark iOS app
- `serverURL` (string, optional): Custom server URL if you're self-hosting Bark. Uses "https://api.day.app" if empty.

### Send

```go
response, err := client.Send(options)
```

Sends a notification using GET request.

### SendPost

```go
response, err := client.SendPost(options)
```

Sends a notification using POST request.

### NotificationOptions

```go
options := bark.NotificationOptions{
    Body:       "Main notification content",
    Title:      "Notification title",
    Subtitle:   "Notification subtitle",
    URL:        "https://example.com",
    Group:      "notification-group",
    Icon:       "https://example.com/icon.png",
    Sound:      "alarm",
    Call:       false,
    Level:      bark.LevelActive, // or LevelTimeSensitive, LevelPassive, LevelCritical
    IsArchive:  false,
    Copy:       "Text to copy",
    Ciphertext: "",
}
```

| Field | Type | Description |
|-------|------|-------------|
| `Body` | string | Main notification content (required) |
| `Title` | string | Notification title |
| `Subtitle` | string | Notification subtitle |
| `URL` | string | URL to open when notification is tapped |
| `Group` | string | Group identifier for notifications |
| `Icon` | string | Custom icon URL (iOS 15+ only) |
| `Sound` | string | Custom notification sound |
| `Call` | bool | If true, plays sound repeatedly for 30 seconds |
| `Level` | string | Notification importance level |
| `IsArchive` | bool | Whether to archive the notification |
| `Copy` | string | Text to copy to clipboard when notification is pressed |
| `Ciphertext` | string | Encrypted notification content |

### Response

```go
type Response struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}
```

## Self-hosted Server Support

If you're running your own Bark server, specify the server URL when creating the client:

```go
client := bark.NewClient("YOUR_BARK_KEY", "https://your-bark-server.com")
```

## License

MIT

## Links

- [Bark GitHub Repository](https://github.com/Finb/Bark)
- [Bark Website](https://bark.day.app/) 