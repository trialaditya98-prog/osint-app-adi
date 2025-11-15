# OSINT Unified Lookup Web App

A comprehensive web application for searching and analyzing information from multiple sources: Phone numbers, Vehicle registrations, Aadhaar data, and Credit card information.

## Features

✨ **All-in-One Lookup Tool**
- 📱 **Phone Information** - Operator, circle, type, status, and more
- 🚗 **Vehicle Information** - RC number, owner details, registration, engine/chassis numbers
- 🆔 **Aadhaar Information** - Family details, address, demographics
- 💳 **Credit Card Information** - BIN lookup, card brand, issuing bank, validation

🎯 **Key Features**
- Clean, intuitive tabbed interface
- Real-time data caching for fast repeated searches
- Search history tracking (last 20 searches)
- CORS proxy support for API integration
- Input validation and error handling
- Responsive design for all devices
- Luhn algorithm validation for credit cards

## APIs Used

1. **Phone Lookup**: `https://shadow-x-osint.vercel.app/api?key=Shadow&type=mobile&term=`
2. **Vehicle Lookup**: `http://gaurav-vehicle-info-api.vercel.app?rc_number=`
3. **Aadhaar Lookup**: `https://chx-family-info.vercel.app/fetch?key=paidchx&aadhaar=`
4. **Credit Card**: Local analysis + BIN database

## Installation

### Option 1: Local Development
```bash
# Clone or download the repository
cd osint-web-app

# Open in a simple HTTP server (Python 3)
python -m http.server 8000

# Open in browser
http://localhost:8000
```

### Option 2: Deploy on Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "Deploy Manually"
3. Drag and drop the `osint-web-app` folder
4. Done! Your app is live

### Option 3: Deploy on Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project" → "Import Git Repository"
3. Or drag the folder for manual upload
4. Deploy

### Option 4: GitHub Pages
1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select branch to deploy
5. Done!

## File Structure

```
osint-web-app/
├── index.html       # Main HTML with UI structure
├── app.js          # JavaScript with all API integrations
└── README.md       # This file
```

## Usage Guide

### 1. Phone Information
- Enter a 10-digit phone number
- Get operator, circle, type, and more
- Supports Indian phone numbers

### 2. Vehicle Information
- Enter RC number in format: MP07SD7547
- Get owner name, vehicle type, registration date
- Engine and chassis details

### 3. Aadhaar Information
- Enter 12-digit Aadhaar number
- Get family member details, address, demographics
- **Note**: Only retrieve your own information

### 4. Credit Card Information
- Enter card number (13-19 digits)
- Get card brand, issuing bank, BIN info
- Automatically validates using Luhn algorithm
- Shows last 4 digits for privacy

## Features Explained

### Caching System
- **Phone Cache**: Stores lookups locally
- **Vehicle Cache**: Prevents repeated API calls
- **Aadhaar Cache**: 24-hour expiration
- **Card Cache**: Instant analysis

### Search History
- Last 20 searches are stored
- Shows type, value, and timestamp
- Clear all history with one click

### Error Handling
- Validates input before sending
- Falls back to CORS proxy if direct fetch fails
- User-friendly error messages
- Timeout protection (15 seconds)

### Security Features
- Masks sensitive data (Aadhaar, card numbers)
- Shows only last 4 digits
- No data stored on external servers
- Everything stored locally in browser

## API Configuration

If APIs stop working, you can update them in `app.js`:

```javascript
const APIS = {
    phone: {
        url: 'YOUR_NEW_API_URL?key=KEY&term=',
    },
    vehicle: {
        url: 'YOUR_NEW_VEHICLE_API?rc_number=',
    },
    aadhaar: {
        url: 'YOUR_NEW_AADHAAR_API?key=KEY&aadhaar=',
    },
};
```

## CORS Proxy

The app uses CORS proxy for APIs that don't allow direct requests:
```
https://cors-anywhere.herokuapp.com/
```

If this stops working, alternatives:
- `https://api.allorigins.win/raw?url=`
- `https://cors-api.herokuapp.com/`
- Host your own CORS proxy

## Validation Rules

### Phone Numbers
- Must be 10 digits
- Indian format supported

### Vehicle RC Numbers
- Format: 2 letters + 2 digits + 2 letters + 4 digits
- Example: MP07SD7547

### Aadhaar Numbers
- Must be exactly 12 digits
- No spaces or special characters

### Credit Cards
- 13-19 digits
- Must pass Luhn algorithm
- Detects: VISA, MASTERCARD, AMEX, DISCOVER, JCB, DINERS, UNIONPAY

## Browser Compatibility

✅ Chrome/Chromium
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers

## Legal Notice

This tool is for **educational and authorized use only**. Users are responsible for:
- Only accessing data they own or have permission to access
- Complying with local laws and regulations
- Not using data for unauthorized purposes
- Respecting privacy laws (GDPR, CCPA, etc.)

## Troubleshooting

### API Returns No Results
- Check if you're using the correct format
- Verify the API service is running
- Try CORS proxy manually

### Cached Data Seems Old
- Clear browser cache: Ctrl+Shift+Del
- Or click "Clear History" button
- Cache automatically expires after 24 hours

### CORS Errors
- App automatically tries CORS proxy
- If still failing, check internet connection
- Try a different browser

## Support

For issues or suggestions:
1. Check the error message carefully
2. Verify your input format
3. Try clearing cache and history
4. Check browser console (F12) for details

## License

Educational use only. Respect privacy and local laws.

## Author

Created for OSINT learning and research.

---

**Happy Searching!** 🔍
