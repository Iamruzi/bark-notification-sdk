#!/usr/bin/env python3
"""
Bark Notification Python SDK - Usage Examples

This script demonstrates how to use the Bark SDK in Python.
"""

from bark_sdk import BarkNotification
import time

def main():
    """Run examples of Bark notification SDK usage"""
    
    # Create a notification client with your Bark key
    bark = BarkNotification(key="YOUR_BARK_KEY")
    
    # Example 1: Send a simple notification
    print("Sending simple notification...")
    response = bark.send(body="Hello from Python SDK!")
    print(f"Response: {response}\n")
    
    # Wait a bit between notifications
    time.sleep(1)
    
    # Example 2: Send a notification with title and body
    print("Sending notification with title...")
    response = bark.send(
        title="Python Example",
        body="This is a test notification from Python"
    )
    print(f"Response: {response}\n")
    
    time.sleep(1)
    
    # Example 3: Send a notification with all parameters
    print("Sending notification with all parameters...")
    response = bark.send(
        title="Full Example",
        subtitle="With All Parameters",
        body="This is a comprehensive test notification.\nIt includes multiple lines!",
        url="https://github.com/Finb/Bark",
        group="python-examples",
        sound="minuet",
        level="timeSensitive"
    )
    print(f"Response: {response}\n")
    
    time.sleep(1)
    
    # Example 4: Send a notification using POST
    print("Sending notification using POST...")
    response = bark.send_post(
        title="POST Request",
        body="This notification was sent using a POST request",
        group="python-examples",
        sound="bell"
    )
    print(f"Response: {response}")

if __name__ == "__main__":
    main() 