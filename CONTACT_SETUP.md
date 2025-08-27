# Contact Setup Guide

## Telegram Contact Configuration

The headset icon (📞) in your application is now configured to open Telegram when clicked. Here's how to set it up:

### 1. Update Telegram Configuration

Edit the file `src/config/contact.ts` and replace the placeholder values:

```typescript
export const CONTACT_CONFIG = {
  telegram: {
    url: 'https://t.me/YOUR_ACTUAL_USERNAME', // Replace with your actual Telegram username
    username: 'YOUR_ACTUAL_USERNAME' // Replace with your actual Telegram username
  },
  support: {
    email: 'support@yourdomain.com', // Replace with your actual support email
    phone: '+84 xxx xxx xxx' // Replace with your actual support phone
  }
};
```

### 2. How to Get Your Telegram Username

1. Open Telegram
2. Go to Settings > Username
3. Note your username (without the @ symbol)
4. Use the format: `https://t.me/YOUR_USERNAME`

### 3. Where the Headset Icon Appears

The headset icon appears in three locations:

1. **Fixed Contact Icon** - Bottom right corner of every page
2. **User Profile Menu** - In the "Hỗ trợ khách hàng" menu item
3. **Admin Login Page** - In the "Liên hệ hỗ trợ" link

### 4. Features

- ✅ **Click to Open Telegram** - All headset icons now open Telegram
- ✅ **Visual Feedback** - Hover effects and pulse animation
- ✅ **Centralized Configuration** - Easy to update in one place
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **New Tab Opening** - Opens Telegram in a new tab

### 5. Customization

You can also customize:
- **Support Email** - For email contact functionality
- **Support Phone** - For phone contact functionality
- **Animation** - Modify the pulse animation in `src/App.css`

### 6. Testing

After updating the configuration:
1. Click the headset icon in the bottom right corner
2. Click "Hỗ trợ khách hàng" in the user profile menu
3. Click "Liên hệ hỗ trợ" on the admin login page

All should open your Telegram chat in a new tab.

### 7. Troubleshooting

If the Telegram link doesn't work:
1. Verify your Telegram username is correct
2. Make sure your Telegram account is public
3. Test the link directly in your browser: `https://t.me/YOUR_USERNAME`
