# Bark Notification JavaScript SDK

A JavaScript client for the [Bark](https://github.com/Finb/Bark) iOS push notification service. This SDK allows you to easily send custom notifications to your iPhone from JavaScript applications.

## Features

- Modern ES6+ JavaScript with Promise-based API
- TypeScript declarations for better IDE support
- Browser and Node.js compatibility
- Support for all Bark notification parameters
- Flexible sending via GET or POST requests
- Compatibility with self-hosted Bark servers

## Installation

### Browser

```html
<!-- Include the SDK in your HTML -->
<script src="path/to/bark_sdk.js"></script>
```

### Node.js

```bash
# Option 1: Copy the bark_sdk.js and bark_sdk.d.ts files to your project
cp bark_sdk.js bark_sdk.d.ts /path/to/your/project/

# Option 2: Install from the directory using npm
npm install .

# For Node.js < 18, you'll also need to install the fetch polyfill
npm install node-fetch
```

## Usage

### Browser

```javascript
// Initialize with your Bark key
const bark = new BarkNotification('YOUR_BARK_KEY');

// Send a simple notification
bark.send({ body: 'Hello from JavaScript!' })
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error:', error));

// Send a comprehensive notification
bark.send({
  title: 'Title',
  subtitle: 'Subtitle',
  body: 'Main content with\nmultiple lines',
  url: 'https://example.com',
  group: 'my-notifications',
  sound: 'alarm',
  level: 'timeSensitive'
})
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error:', error));

// Use POST instead of GET
bark.sendPost({
  title: 'POST Notification',
  body: 'This notification uses POST',
  group: 'post-examples'
})
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error:', error));
```

### Node.js

```javascript
const BarkNotification = require('./bark_sdk');

// For Node.js < 18, you need to set up the fetch polyfill
// const fetch = require('node-fetch');
// global.fetch = fetch;

// Initialize with your Bark key
const bark = new BarkNotification('YOUR_BARK_KEY');

// Send notifications as in the browser example
bark.send({ body: 'Hello from Node.js!' })
  .then(response => console.log('Notification sent:', response))
  .catch(error => console.error('Error:', error));
```

## GET vs POST Methods

This SDK provides two methods for sending notifications: `send()` (GET) and `sendPost()` (POST). Here are the key differences:

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

### `new BarkNotification(key, serverUrl='https://api.day.app')`
- `key` (string): Your Bark key from the Bark iOS app
- `serverUrl` (string, optional): Custom server URL if you're self-hosting Bark

### `send(options)`
- `options.body` (string): Main notification content
- `options.title` (string, optional): Notification title
- `options.subtitle` (string, optional): Notification subtitle
- `options.url` (string, optional): URL to open when notification is tapped
- `options.group` (string, optional): Group identifier for notifications
- `options.icon` (string, optional): Custom icon URL (iOS 15+ only)
- `options.sound` (string, optional): Custom notification sound
- `options.call` (boolean, optional): If true, plays sound repeatedly for 30 seconds
- `options.level` (string, optional): Notification importance level: "active", "timeSensitive", "passive", or "critical"
- `options.isArchive` (boolean, optional): Whether to archive the notification
- `options.copy` (string, optional): Text to copy to clipboard when notification is pressed
- `options.ciphertext` (string, optional): Encrypted notification content

### `sendPost(options)`
Send notifications using POST rather than GET. Same options as `send()`.

## TypeScript Support

This SDK includes TypeScript declarations in `bark_sdk.d.ts`, providing full type checking and IDE autocompletion for TypeScript projects.

## Self-hosted Server Support

If you're running your own Bark server, you can specify the server URL when initializing the client:

```javascript
const bark = new BarkNotification('YOUR_BARK_KEY', 'https://your-bark-server.com');
```

## Example

See the included example file:
- `example.js` - Examples of using the JavaScript SDK in Node.js

## Requirements

- Modern browser or Node.js 12+
- For Node.js < 18: `node-fetch` library

## License

MIT

## Links

- [Bark GitHub Repository](https://github.com/Finb/Bark)
- [Bark Website](https://bark.day.app/) 