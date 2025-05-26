/**
 * Bark Notification JavaScript SDK
 * 
 * A JavaScript client for the Bark iOS push notification service.
 * Send custom notifications to your iPhone easily.
 * 
 * Official GitHub: https://github.com/Finb/Bark
 */

/**
 * Base class for Bark SDK exceptions
 */
class BarkException extends Error {
  /**
   * Create a new BarkException
   * @param {string} message - Error message
   * @param {number} [statusCode] - HTTP status code
   * @param {object} [response] - Response object
   */
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.response = response;
    
    // This is for backward compatibility with native Error objects
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Exception for network errors when communicating with Bark server
 */
class BarkNetworkException extends BarkException {
  constructor(message, statusCode = null, response = null) {
    super(message, statusCode, response);
  }
}

/**
 * Exception for server errors returned by the Bark server
 */
class BarkServerException extends BarkException {
  constructor(message, statusCode = null, response = null) {
    super(message, statusCode, response);
  }
}

/**
 * Exception for client-side validation errors
 */
class BarkClientException extends BarkException {
  constructor(message) {
    super(message);
  }
}

class BarkNotification {
  /**
   * Create a new Bark notification client
   * @param {string} key - Your Bark key from the Bark iOS app
   * @param {string} [serverUrl="https://api.day.app"] - Custom server URL if you're self-hosting Bark
   * @throws {BarkClientException} If key is empty or invalid
   */
  constructor(key, serverUrl = 'https://api.day.app') {
    if (!key) {
      throw new BarkClientException('Bark key cannot be empty');
    }
    
    this.key = key;
    this.serverUrl = serverUrl;
    this.baseUrl = `${this.serverUrl}/${this.key}`;
  }

  /**
   * Send a notification using GET request
   * 
   * @param {Object} options - Notification options
   * @param {string} options.body - Main notification content
   * @param {string} [options.title] - Notification title
   * @param {string} [options.subtitle] - Notification subtitle
   * @param {string} [options.url] - URL to open when notification is tapped
   * @param {string} [options.group] - Group identifier for notifications
   * @param {string} [options.icon] - Custom icon URL (iOS 15+ only)
   * @param {string} [options.sound] - Custom notification sound
   * @param {boolean} [options.call] - If true, plays sound repeatedly for 30 seconds
   * @param {string} [options.level] - Notification importance level: "active", "timeSensitive", "passive", or "critical"
   * @param {boolean} [options.isArchive] - Whether to archive the notification
   * @param {string} [options.copy] - Text to copy to clipboard when notification is pressed
   * @param {string} [options.ciphertext] - Encrypted notification content
   * @returns {Promise<Object>} - Response from the Bark server
   * @throws {BarkClientException} If validation fails or parameters are invalid
   * @throws {BarkNetworkException} If there's a network error
   * @throws {BarkServerException} If the server returns an error response
   */
  async send({
    body,
    title,
    subtitle,
    url,
    group,
    icon,
    sound,
    call,
    level,
    isArchive,
    copy,
    ciphertext
  }) {
    if (!body) {
      throw new BarkClientException('Notification body is required');
    }
    
    // Validate level if provided
    if (level && !['active', 'timeSensitive', 'passive', 'critical'].includes(level)) {
      throw new BarkClientException('Invalid level value. Must be one of: active, timeSensitive, passive, critical');
    }

    try {
      // Build endpoint based on provided parameters
      const endpoint = this._buildEndpoint(body, title, subtitle);
      
      // Prepare parameters
      const params = new URLSearchParams();
      if (url) params.append('url', url);
      if (group) params.append('group', group);
      if (icon) params.append('icon', icon);
      if (sound) params.append('sound', sound);
      if (call) params.append('call', call ? '1' : '0');
      if (level) params.append('level', level);
      if (isArchive !== undefined) params.append('isArchive', isArchive ? '1' : '0');
      if (copy) params.append('copy', copy);
      if (ciphertext) params.append('ciphertext', ciphertext);
      
      // Build the final URL
      const queryString = params.toString();
      const requestUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
      
      // Send the request
      const response = await this._fetchWithTimeout(requestUrl);
      
      // Handle the response
      return this._handleResponse(response);
    } catch (error) {
      // Rethrow if it's already one of our custom exceptions
      if (error instanceof BarkException) {
        throw error;
      }
      
      // Otherwise wrap it in a BarkNetworkException
      throw new BarkNetworkException(`Request failed: ${error.message}`);
    }
  }

  /**
   * Send a notification using POST request
   * 
   * @param {Object} options - Notification options (see send method for details)
   * @returns {Promise<Object>} - Response from the Bark server
   * @throws {BarkClientException} If validation fails or parameters are invalid
   * @throws {BarkNetworkException} If there's a network error
   * @throws {BarkServerException} If the server returns an error response
   */
  async sendPost(options) {
    if (!options.body) {
      throw new BarkClientException('Notification body is required');
    }
    
    // Validate level if provided
    if (options.level && !['active', 'timeSensitive', 'passive', 'critical'].includes(options.level)) {
      throw new BarkClientException('Invalid level value. Must be one of: active, timeSensitive, passive, critical');
    }
    
    try {
      // Send the request
      const response = await this._fetchWithTimeout(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });
      
      // Handle the response
      return this._handleResponse(response);
    } catch (error) {
      // Rethrow if it's already one of our custom exceptions
      if (error instanceof BarkException) {
        throw error;
      }
      
      // Otherwise wrap it in a BarkNetworkException
      throw new BarkNetworkException(`Request failed: ${error.message}`);
    }
  }

  /**
   * Fetch with timeout to prevent hanging requests
   * 
   * @private
   * @param {string} url - The URL to fetch
   * @param {Object} [options] - Fetch options
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<Response>} - Fetch response
   * @throws {BarkNetworkException} If the request times out or fails
   */
  async _fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new BarkNetworkException(`Request timed out after ${timeout}ms`);
      }
      throw new BarkNetworkException(`Network error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle the response from the Bark server
   * 
   * @private
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} - Parsed response
   * @throws {BarkServerException} If the server returns an error response
   */
  async _handleResponse(response) {
    // Check HTTP status code
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unable to read error response';
      }
      
      throw new BarkServerException(
        `Server returned error: ${errorText}`,
        response.status
      );
    }
    
    // Parse JSON response
    try {
      const jsonResponse = await response.json();
      
      // Check API response code
      if (jsonResponse.code !== 200) {
        throw new BarkServerException(
          `API error: ${jsonResponse.message || 'Unknown error'}`,
          response.status,
          jsonResponse
        );
      }
      
      return jsonResponse;
    } catch (error) {
      if (error instanceof BarkException) {
        throw error;
      }
      
      throw new BarkServerException(
        `Invalid JSON response: ${error.message}`,
        response.status
      );
    }
  }

  /**
   * Build the endpoint URL based on provided parameters
   * 
   * @private
   * @param {string} body - Main notification content
   * @param {string} [title] - Notification title
   * @param {string} [subtitle] - Notification subtitle
   * @returns {string} - The constructed endpoint URL
   * @throws {BarkClientException} If there's an error building the URL
   */
  _buildEndpoint(body, title, subtitle) {
    try {
      if (title && subtitle) {
        return `${this.baseUrl}/${encodeURIComponent(title)}/${encodeURIComponent(subtitle)}/${encodeURIComponent(body)}`;
      } else if (title) {
        return `${this.baseUrl}/${encodeURIComponent(title)}/${encodeURIComponent(body)}`;
      } else {
        return `${this.baseUrl}/${encodeURIComponent(body)}`;
      }
    } catch (error) {
      throw new BarkClientException(`Error building endpoint URL: ${error.message}`);
    }
  }
}

// Export the main class and exception classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarkNotification;
  module.exports.BarkException = BarkException;
  module.exports.BarkNetworkException = BarkNetworkException;
  module.exports.BarkServerException = BarkServerException;
  module.exports.BarkClientException = BarkClientException;
}

// Usage example in browser:
/*
const bark = new BarkNotification('YOUR_BARK_KEY');

// Send a simple notification
bark.send({ body: 'Hello from JavaScript SDK!' })
  .then(response => console.log('Notification sent:', response))
  .catch(error => {
    if (error instanceof BarkClientException) {
      console.error('Client error:', error.message);
    } else if (error instanceof BarkNetworkException) {
      console.error('Network error:', error.message);
    } else if (error instanceof BarkServerException) {
      console.error('Server error:', error.message, 'Status:', error.statusCode);
      if (error.response) {
        console.error('Response details:', error.response);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  });
*/ 