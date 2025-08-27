// Contact configuration
export const CONTACT_CONFIG = {
  telegram: {
    url: 'https://t.me/your_telegram_username', // Replace with your actual Telegram username
    username: 'your_telegram_username' // Replace with your actual Telegram username
  },
  support: {
    email: 'support@yourdomain.com', // Replace with your actual support email
    phone: '+84 xxx xxx xxx' // Replace with your actual support phone
  }
};

// Function to open Telegram
export const openTelegram = () => {
  window.open(CONTACT_CONFIG.telegram.url, '_blank');
};

// Function to open support email
export const openSupportEmail = () => {
  window.open(`mailto:${CONTACT_CONFIG.support.email}`, '_blank');
};

// Function to open support phone
export const openSupportPhone = () => {
  window.open(`tel:${CONTACT_CONFIG.support.phone}`, '_blank');
};
