import requests
import json
import urllib.parse
from typing import Optional, Dict, Any, Union


class BarkException(Exception):
    """Exception raised for Bark SDK errors."""
    
    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict[str, Any]] = None):
        self.message = message
        self.status_code = status_code
        self.response = response
        super().__init__(self.message)
    
    def __str__(self) -> str:
        if self.status_code:
            return f"{self.message} (Status code: {self.status_code})"
        return self.message


class BarkNetworkException(BarkException):
    """Exception raised for network errors when communicating with Bark server."""
    pass


class BarkServerException(BarkException):
    """Exception raised for server errors returned by the Bark server."""
    pass


class BarkClientException(BarkException):
    """Exception raised for client-side validation errors."""
    pass


class BarkNotification:
    """
    A Python SDK for Bark iOS push notification service.
    Bark allows sending custom notifications to your iPhone.
    
    Official GitHub: https://github.com/Finb/Bark
    """

    DEFAULT_SERVER = "https://api.day.app"
    
    def __init__(self, key: str, server_url: Optional[str] = None):
        """
        Initialize the Bark notification client.
        
        Args:
            key (str): Your Bark key from the Bark iOS app
            server_url (str, optional): Custom server URL if you're self-hosting Bark
        """
        if not key:
            raise BarkClientException("Bark key cannot be empty")
            
        self.key = key
        self.server_url = server_url or self.DEFAULT_SERVER
        self.base_url = f"{self.server_url}/{self.key}"
    
    def send(self, 
             body: str, 
             title: Optional[str] = None, 
             subtitle: Optional[str] = None, 
             url: Optional[str] = None, 
             group: Optional[str] = None, 
             icon: Optional[str] = None, 
             sound: Optional[str] = None, 
             call: Optional[bool] = None, 
             level: Optional[str] = None, 
             is_archive: Optional[bool] = None, 
             copy: Optional[str] = None, 
             ciphertext: Optional[str] = None) -> Dict[str, Any]:
        """
        Send a notification to your device.
        
        Args:
            body (str): Main notification content
            title (str, optional): Notification title
            subtitle (str, optional): Notification subtitle
            url (str, optional): URL to open when notification is tapped
            group (str, optional): Group identifier for notifications
            icon (str, optional): Custom icon URL (iOS 15+ only)
            sound (str, optional): Custom notification sound
            call (bool, optional): If True, plays sound repeatedly for 30 seconds
            level (str, optional): Notification importance level: "active", "timeSensitive", "passive", or "critical"
            is_archive (bool, optional): Whether to archive the notification
            copy (str, optional): Text to copy to clipboard when notification is pressed
            ciphertext (str, optional): Encrypted notification content
            
        Returns:
            dict: Response from the Bark server
            
        Raises:
            BarkClientException: If validation fails or parameters are invalid
            BarkNetworkException: If there's a network error
            BarkServerException: If the server returns an error response
        """
        if not body:
            raise BarkClientException("Notification body cannot be empty")
            
        # Validate level if provided
        if level and level not in ["active", "timeSensitive", "passive", "critical"]:
            raise BarkClientException(
                "Invalid level value. Must be one of: active, timeSensitive, passive, critical"
            )
        
        try:
            # Build endpoint based on provided parameters
            endpoint = self._build_endpoint(body, title, subtitle)
            
            # Prepare parameters
            params = {}
            if url:
                params['url'] = url
            if group:
                params['group'] = group
            if icon:
                params['icon'] = icon
            if sound:
                params['sound'] = sound
            if call:
                params['call'] = 1 if call else 0
            if level:
                params['level'] = level
            if is_archive is not None:
                params['isArchive'] = 1 if is_archive else 0
            if copy:
                params['copy'] = copy
            if ciphertext:
                params['ciphertext'] = ciphertext
                
            # Send the request
            try:
                response = requests.get(endpoint, params=params, timeout=10)
            except requests.RequestException as e:
                raise BarkNetworkException(f"Network error: {str(e)}")
            
            # Parse response
            return self._handle_response(response)
            
        except (ValueError, TypeError) as e:
            raise BarkClientException(f"Invalid parameter: {str(e)}")
    
    def send_post(self, 
                 body: str, 
                 title: Optional[str] = None, 
                 subtitle: Optional[str] = None, 
                 **kwargs) -> Dict[str, Any]:
        """
        Send a notification using POST request instead of GET.
        
        Args:
            body (str): Main notification content
            title (str, optional): Notification title
            subtitle (str, optional): Notification subtitle
            **kwargs: Additional parameters (see send method)
            
        Returns:
            dict: Response from the Bark server
            
        Raises:
            BarkClientException: If validation fails or parameters are invalid
            BarkNetworkException: If there's a network error
            BarkServerException: If the server returns an error response
        """
        if not body:
            raise BarkClientException("Notification body cannot be empty")
            
        # Validate level if provided
        if 'level' in kwargs and kwargs['level'] not in ["active", "timeSensitive", "passive", "critical"]:
            raise BarkClientException(
                "Invalid level value. Must be one of: active, timeSensitive, passive, critical"
            )
        
        try:
            # Prepare data
            data = {
                "body": body
            }
            
            if title:
                data["title"] = title
            if subtitle:
                data["subtitle"] = subtitle
                
            # Add other parameters
            for key, value in kwargs.items():
                data[key] = value
                
            # Send the request
            try:
                response = requests.post(f"{self.base_url}", json=data, timeout=10)
            except requests.RequestException as e:
                raise BarkNetworkException(f"Network error: {str(e)}")
            
            # Parse response
            return self._handle_response(response)
            
        except (ValueError, TypeError) as e:
            raise BarkClientException(f"Invalid parameter: {str(e)}")
    
    def _build_endpoint(self, body: str, title: Optional[str] = None, subtitle: Optional[str] = None) -> str:
        """
        Build the endpoint URL based on provided parameters.
        
        Args:
            body (str): Main notification content
            title (str, optional): Notification title
            subtitle (str, optional): Notification subtitle
            
        Returns:
            str: The constructed endpoint URL
        """
        try:
            if title and subtitle:
                return f"{self.base_url}/{urllib.parse.quote(title)}/{urllib.parse.quote(subtitle)}/{urllib.parse.quote(body)}"
            elif title:
                return f"{self.base_url}/{urllib.parse.quote(title)}/{urllib.parse.quote(body)}"
            else:
                return f"{self.base_url}/{urllib.parse.quote(body)}"
        except Exception as e:
            raise BarkClientException(f"Error building endpoint URL: {str(e)}")
    
    def _handle_response(self, response: requests.Response) -> Dict[str, Any]:
        """
        Handle the response from the Bark server.
        
        Args:
            response: Response from the Bark server
            
        Returns:
            dict: Parsed response
            
        Raises:
            BarkServerException: If the server returns an error response
        """
        try:
            # Check HTTP status code
            if response.status_code != 200:
                raise BarkServerException(
                    f"Server returned error: {response.text}",
                    status_code=response.status_code
                )
            
            # Parse JSON response
            json_response = response.json()
            
            # Check API response code
            if json_response.get('code') != 200:
                raise BarkServerException(
                    f"API error: {json_response.get('message', 'Unknown error')}",
                    status_code=response.status_code,
                    response=json_response
                )
                
            return json_response
            
        except json.JSONDecodeError:
            raise BarkServerException(
                f"Invalid JSON response: {response.text}",
                status_code=response.status_code
            )


# Usage example
if __name__ == "__main__":
    try:
        # Create a notification client with your Bark key
        bark = BarkNotification(key="YOUR_BARK_KEY")
        
        # Send a simple notification
        response = bark.send(body="Hello from Python SDK!")
        print(response)
        
        # Send a notification with more parameters
        response = bark.send(
            title="Notification Title",
            subtitle="Notification Subtitle",
            body="This is the main notification content.\nWith multiple lines!",
            url="https://example.com",
            group="example-notifications",
            sound="alarm",
            level="timeSensitive"
        )
        print(response)
    except BarkClientException as e:
        print(f"Client error: {e}")
    except BarkNetworkException as e:
        print(f"Network error: {e}")
    except BarkServerException as e:
        print(f"Server error: {e}")
        if e.response:
            print(f"Response details: {e.response}")
    except Exception as e:
        print(f"Unexpected error: {e}") 