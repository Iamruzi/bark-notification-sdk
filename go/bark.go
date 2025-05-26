// Package bark provides a Go client for Bark iOS push notification service.
// Bark allows sending custom notifications to your iPhone.
//
// Official GitHub: https://github.com/Finb/Bark
package bark

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	// DefaultServerURL is the default Bark server URL
	DefaultServerURL = "https://api.day.app"

	// Notification levels
	LevelActive        = "active"
	LevelTimeSensitive = "timeSensitive"
	LevelPassive       = "passive"
	LevelCritical      = "critical"
)

// Custom error types for better error handling
var (
	// ErrEmptyKey is returned when a Bark key is not provided
	ErrEmptyKey = errors.New("bark key cannot be empty")

	// ErrEmptyBody is returned when notification body is not provided
	ErrEmptyBody = errors.New("notification body cannot be empty")

	// ErrInvalidLevel is returned when an invalid notification level is provided
	ErrInvalidLevel = errors.New("invalid level value. must be one of: active, timeSensitive, passive, critical")
)

// BarkError represents an error returned by the Bark API
type BarkError struct {
	// Message is the error message
	Message string

	// StatusCode is the HTTP status code
	StatusCode int

	// Response is the raw response data
	Response *Response
}

// Error implements the error interface
func (e *BarkError) Error() string {
	if e.StatusCode > 0 {
		return fmt.Sprintf("%s (Status code: %d)", e.Message, e.StatusCode)
	}
	return e.Message
}

// Client represents a Bark notification client
type Client struct {
	// Key is your Bark key from the Bark iOS app
	Key string

	// ServerURL is the Bark server URL, defaults to DefaultServerURL
	ServerURL string

	// HTTPClient is the HTTP client used to make requests
	HTTPClient *http.Client
}

// NotificationOptions contains the options for a notification
type NotificationOptions struct {
	// Body is the main notification content (required)
	Body string `json:"body"`

	// Title is the notification title
	Title string `json:"title,omitempty"`

	// Subtitle is the notification subtitle
	Subtitle string `json:"subtitle,omitempty"`

	// URL to open when notification is tapped
	URL string `json:"url,omitempty"`

	// Group identifier for notifications
	Group string `json:"group,omitempty"`

	// Icon is custom icon URL (iOS 15+ only)
	Icon string `json:"icon,omitempty"`

	// Sound is custom notification sound
	Sound string `json:"sound,omitempty"`

	// Call plays sound repeatedly for 30 seconds if true
	Call bool `json:"call,omitempty"`

	// Level is notification importance level
	// Values: "active", "timeSensitive", "passive", "critical"
	Level string `json:"level,omitempty"`

	// IsArchive defines whether to archive the notification
	IsArchive bool `json:"isArchive,omitempty"`

	// Copy is text to copy to clipboard when notification is pressed
	Copy string `json:"copy,omitempty"`

	// Ciphertext is encrypted notification content
	Ciphertext string `json:"ciphertext,omitempty"`
}

// Response represents a response from the Bark server
type Response struct {
	// Code response code, 200 indicates success
	Code int `json:"code"`

	// Message response message
	Message string `json:"message"`

	// Data returned by the server, if any
	Data interface{} `json:"data,omitempty"`
}

// NewClient creates a new Bark notification client
func NewClient(key string, serverURL string) (*Client, error) {
	if key == "" {
		return nil, ErrEmptyKey
	}

	if serverURL == "" {
		serverURL = DefaultServerURL
	}

	return &Client{
		Key:       key,
		ServerURL: serverURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}, nil
}

// Send sends a notification using GET request
func (c *Client) Send(options NotificationOptions) (*Response, error) {
	// Validate required fields
	if options.Body == "" {
		return nil, ErrEmptyBody
	}

	// Validate level if provided
	if options.Level != "" && !isValidLevel(options.Level) {
		return nil, ErrInvalidLevel
	}

	// Build the endpoint URL
	endpoint, err := c.buildEndpoint(options.Body, options.Title, options.Subtitle)
	if err != nil {
		return nil, err
	}

	// Prepare query parameters
	params := url.Values{}
	if options.URL != "" {
		params.Add("url", options.URL)
	}
	if options.Group != "" {
		params.Add("group", options.Group)
	}
	if options.Icon != "" {
		params.Add("icon", options.Icon)
	}
	if options.Sound != "" {
		params.Add("sound", options.Sound)
	}
	if options.Call {
		params.Add("call", "1")
	}
	if options.Level != "" {
		params.Add("level", options.Level)
	}
	if options.IsArchive {
		params.Add("isArchive", "1")
	}
	if options.Copy != "" {
		params.Add("copy", options.Copy)
	}
	if options.Ciphertext != "" {
		params.Add("ciphertext", options.Ciphertext)
	}

	// Build the final URL
	requestURL := endpoint
	if len(params) > 0 {
		requestURL = fmt.Sprintf("%s?%s", endpoint, params.Encode())
	}

	// Create the request
	req, err := http.NewRequest(http.MethodGet, requestURL, nil)
	if err != nil {
		return nil, &BarkError{
			Message: fmt.Sprintf("failed to create request: %v", err),
		}
	}

	// Send the request
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, &BarkError{
			Message: fmt.Sprintf("request failed: %v", err),
		}
	}
	defer resp.Body.Close()

	// Parse the response
	return parseResponse(resp)
}

// SendPost sends a notification using POST request
func (c *Client) SendPost(options NotificationOptions) (*Response, error) {
	// Validate required fields
	if options.Body == "" {
		return nil, ErrEmptyBody
	}

	// Validate level if provided
	if options.Level != "" && !isValidLevel(options.Level) {
		return nil, ErrInvalidLevel
	}

	// Prepare the request URL
	requestURL := fmt.Sprintf("%s/%s", c.ServerURL, c.Key)

	// Marshal the options to JSON
	data, err := json.Marshal(options)
	if err != nil {
		return nil, &BarkError{
			Message: fmt.Sprintf("failed to marshal request body: %v", err),
		}
	}

	// Create the request
	req, err := http.NewRequest(http.MethodPost, requestURL, bytes.NewReader(data))
	if err != nil {
		return nil, &BarkError{
			Message: fmt.Sprintf("failed to create request: %v", err),
		}
	}
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, &BarkError{
			Message: fmt.Sprintf("request failed: %v", err),
		}
	}
	defer resp.Body.Close()

	// Parse the response
	return parseResponse(resp)
}

// buildEndpoint builds the endpoint URL based on provided parameters
func (c *Client) buildEndpoint(body, title, subtitle string) (string, error) {
	baseURL := fmt.Sprintf("%s/%s", c.ServerURL, c.Key)

	// Safely encode parameters
	var escapedBody, escapedTitle, escapedSubtitle string
	var err error

	escapedBody = url.PathEscape(body)
	if title != "" {
		escapedTitle = url.PathEscape(title)
	}
	if subtitle != "" {
		escapedSubtitle = url.PathEscape(subtitle)
	}

	if err != nil {
		return "", &BarkError{
			Message: fmt.Sprintf("failed to encode parameters: %v", err),
		}
	}

	if title != "" && subtitle != "" {
		return fmt.Sprintf("%s/%s/%s/%s", baseURL, escapedTitle, escapedSubtitle, escapedBody), nil
	} else if title != "" {
		return fmt.Sprintf("%s/%s/%s", baseURL, escapedTitle, escapedBody), nil
	}
	return fmt.Sprintf("%s/%s", baseURL, escapedBody), nil
}

// parseResponse parses the HTTP response into a Response struct
func parseResponse(resp *http.Response) (*Response, error) {
	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, &BarkError{
			Message:    fmt.Sprintf("failed to read response body: %v", err),
			StatusCode: resp.StatusCode,
		}
	}

	// Check if the response was successful
	if resp.StatusCode != http.StatusOK {
		return nil, &BarkError{
			Message:    fmt.Sprintf("server returned error: %s", strings.TrimSpace(string(body))),
			StatusCode: resp.StatusCode,
		}
	}

	// Parse the response
	var response Response
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, &BarkError{
			Message:    fmt.Sprintf("failed to parse response: %v", err),
			StatusCode: resp.StatusCode,
		}
	}

	// Check API response code
	if response.Code != 200 {
		return nil, &BarkError{
			Message:    fmt.Sprintf("API error: %s", response.Message),
			StatusCode: resp.StatusCode,
			Response:   &response,
		}
	}

	return &response, nil
}

// isValidLevel checks if the level value is valid
func isValidLevel(level string) bool {
	return level == LevelActive ||
		level == LevelTimeSensitive ||
		level == LevelPassive ||
		level == LevelCritical
}
