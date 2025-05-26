/**
 * Bark Notification JavaScript SDK - TypeScript declarations
 */

export interface BarkNotificationOptions {
  /**
   * Main notification content
   */
  body: string;
  
  /**
   * Notification title
   */
  title?: string;
  
  /**
   * Notification subtitle
   */
  subtitle?: string;
  
  /**
   * URL to open when notification is tapped
   */
  url?: string;
  
  /**
   * Group identifier for notifications
   */
  group?: string;
  
  /**
   * Custom icon URL (iOS 15+ only)
   */
  icon?: string;
  
  /**
   * Custom notification sound
   */
  sound?: string;
  
  /**
   * If true, plays sound repeatedly for 30 seconds
   */
  call?: boolean;
  
  /**
   * Notification importance level: "active", "timeSensitive", "passive", or "critical"
   */
  level?: "active" | "timeSensitive" | "passive" | "critical";
  
  /**
   * Whether to archive the notification
   */
  isArchive?: boolean;
  
  /**
   * Text to copy to clipboard when notification is pressed
   */
  copy?: string;
  
  /**
   * Encrypted notification content
   */
  ciphertext?: string;
}

export interface BarkResponse {
  /**
   * Response code, 200 indicates success
   */
  code: number;
  
  /**
   * Response message
   */
  message: string;
  
  /**
   * Data returned by the server, if any
   */
  data?: any;
}

declare class BarkNotification {
  /**
   * Create a new Bark notification client
   * @param key - Your Bark key from the Bark iOS app
   * @param serverUrl - Custom server URL if you're self-hosting Bark
   */
  constructor(key: string, serverUrl?: string);
  
  /**
   * Send a notification using GET request
   * @param options - Notification options
   * @returns Promise resolving to the Bark server response
   */
  send(options: BarkNotificationOptions): Promise<BarkResponse>;
  
  /**
   * Send a notification using POST request
   * @param options - Notification options (see send method for details)
   * @returns Promise resolving to the Bark server response
   */
  sendPost(options: BarkNotificationOptions): Promise<BarkResponse>;
  
  /**
   * Build the endpoint URL based on provided parameters
   * @private
   * @param body - Main notification content
   * @param title - Notification title
   * @param subtitle - Notification subtitle
   * @returns The constructed endpoint URL
   */
  private _buildEndpoint(body: string, title?: string, subtitle?: string): string;
}

export default BarkNotification; 