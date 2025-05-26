// Example program demonstrating how to use the Bark Go SDK
package main

import (
	"fmt"
	"time"

	bark "github.com/okx_brc20_app/3rdparty/notification/bark/go"
)

func main() {
	// Create a notification client with your Bark key
	client, err := bark.NewClient("YOUR_BARK_KEY", "")
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		return
	}

	// Example 1: Send a simple notification
	fmt.Println("Sending simple notification...")
	response, err := client.Send(bark.NotificationOptions{
		Body: "Hello from Go SDK!",
	})
	if err != nil {
		// Check specific error types
		switch err {
		case bark.ErrEmptyBody:
			fmt.Println("Error: Notification body cannot be empty")
		case bark.ErrInvalidLevel:
			fmt.Println("Error: Invalid notification level")
		default:
			// Handle other errors
			if barkErr, ok := err.(*bark.BarkError); ok {
				fmt.Printf("Bark error: %s (Status code: %d)\n", barkErr.Message, barkErr.StatusCode)
				if barkErr.Response != nil {
					fmt.Printf("Response: %+v\n", barkErr.Response)
				}
			} else {
				fmt.Printf("Error: %v\n", err)
			}
		}
	} else {
		fmt.Printf("Response: %+v\n\n", response)
	}

	// Wait a bit between notifications
	time.Sleep(1 * time.Second)

	// Example 2: Send a notification with title and body
	fmt.Println("Sending notification with title...")
	response, err = client.Send(bark.NotificationOptions{
		Title: "Go Example",
		Body:  "This is a test notification from Go",
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Response: %+v\n\n", response)
	}

	time.Sleep(1 * time.Second)

	// Example 3: Send a notification with all parameters
	fmt.Println("Sending notification with all parameters...")
	response, err = client.Send(bark.NotificationOptions{
		Title:     "Full Example",
		Subtitle:  "With All Parameters",
		Body:      "This is a comprehensive test notification.\nIt includes multiple lines!",
		URL:       "https://github.com/Finb/Bark",
		Group:     "go-examples",
		Sound:     "minuet",
		Level:     bark.LevelTimeSensitive,
		IsArchive: true,
		Copy:      "Text to copy",
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Response: %+v\n\n", response)
	}

	time.Sleep(1 * time.Second)

	// Example 4: Send a notification using POST
	fmt.Println("Sending notification using POST...")
	response, err = client.SendPost(bark.NotificationOptions{
		Title: "POST Request",
		Body:  "This notification was sent using a POST request",
		Group: "go-examples",
		Sound: "bell",
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Response: %+v\n", response)
	}

	// Example 5: Error handling examples (not executed, just for demonstration)
	fmt.Println("\nError handling examples (not actually executed):")
	fmt.Println("1. Empty body: client.Send(bark.NotificationOptions{})")
	fmt.Println("2. Invalid level: client.Send(bark.NotificationOptions{Body: \"test\", Level: \"invalid\"})")
	fmt.Println("3. Network error: Will be wrapped in a BarkError")
}
