/**
 * Bark Notification JavaScript SDK - Node.js Example
 * 
 * This example demonstrates how to use the Bark SDK in a Node.js environment.
 */

// Import the Bark Notification client
const BarkNotification = require('./bark_sdk');

// Node.js environments need to use a fetch polyfill if running on Node.js < 18
// Uncomment the following lines if using Node.js < 18
/*
const fetch = require('node-fetch');
global.fetch = fetch;
*/

async function sendExampleNotifications() {
  // Create a notification client with your Bark key
  const bark = new BarkNotification('YOUR_BARK_KEY');
  
  try {
    // Example 1: Send a simple notification
    console.log('Sending simple notification...');
    const response1 = await bark.send({ body: 'Hello from Node.js!' });
    console.log('Response:', response1);
    
    // Example 2: Send a notification with more parameters
    console.log('\nSending notification with parameters...');
    const response2 = await bark.send({
      title: 'Node.js Example',
      subtitle: 'With Parameters',
      body: 'This is a test notification from Node.js.\nIt includes multiple parameters!',
      url: 'https://github.com/Finb/Bark',
      group: 'node-examples',
      sound: 'minuet',
      level: 'active'
    });
    console.log('Response:', response2);
    
    // Example 3: Send a notification using POST request
    console.log('\nSending notification using POST...');
    const response3 = await bark.sendPost({
      title: 'POST Request',
      body: 'This notification was sent using a POST request',
      group: 'node-examples',
      sound: 'bell'
    });
    console.log('Response:', response3);
    
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
}

// Run the examples
sendExampleNotifications(); 