# OSINT Web App - Quick Start Guide

## 🚀 30-Minute Setup

### Step 1: Deploy Web App (10 minutes)

**Choose ONE option:**

#### Option A: Vercel (Easiest)
```
1. Go to vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Upload osint-web-app folder
5. Click Deploy
6. Get your URL (e.g., osint-app-xyz.vercel.app)
```

#### Option B: Netlify
```
1. Go to netlify.com
2. Drag drop osint-web-app folder
3. Done! (auto generates URL)
```

#### Option C: Local (Testing)
```
cd osint-web-app
python -m http.server 8000
Open: http://localhost:8000
```

---

### Step 2: Update Bot (5 minutes)

**Edit `cc_bot.py` line ~3754:**

Find:
```python
web_app=WebAppInfo(url="https://osint-lookup.vercel.app")
```

Replace with YOUR URL:
```python
web_app=WebAppInfo(url="https://your-deployed-url.vercel.app")
```

Save and restart bot.

---

### Step 3: Test Everything (10 minutes)

**In Telegram:**
```
/phone 9993531301
/vehicle MP07SD7547
/aadhaar 499535722053
/osint
```

**In Web App:**
- Open each tab
- Enter test data
- Verify results display
- Check search history

---

## 📋 What Each Feature Does

### 1️⃣ Phone Information
**Input:** 10-digit phone number
**Example:** 9993531301
**Returns:**
- Operator (Jio, Airtel, Vodafone, etc.)
- Circle (which state)
- Type (Prepaid/Postpaid)
- Status (Active/Inactive)

### 2️⃣ Vehicle Information
**Input:** RC number
**Example:** MP07SD7547
**Returns:**
- Owner name
- Vehicle type/model
- Registration date
- Engine/Chassis numbers
- Color, fuel type

### 3️⃣ Aadhaar Information
**Input:** 12-digit Aadhaar number
**Example:** 499535722053
**Returns:**
- Name
- Address
- Family members
- DOB, Gender
- Contact info

### 4️⃣ Credit Card Analysis
**Input:** Card number (13-19 digits)
**Example:** 5623896208038734
**Returns:**
- Card brand (VISA, MASTERCARD, etc.)
- Issuing bank
- Card type (CREDIT/DEBIT)
- BIN information
- Validation status

---

## 🌐 Web App Features

### Search History
- Automatically saves all searches
- Shows last 20 searches
- Click to repeat search
- Clear all with one button

### Data Caching
- Results cached for 24 hours
- Faster repeat searches
- No extra API calls
- Automatic expiration

### Smart Error Handling
- Input validation before search
- Clear error messages
- Automatic CORS proxy fallback
- Timeout protection (15 seconds)

### Privacy Protection
- Sensitive data masked
- Only last 4 digits shown
- All data stored locally
- No server uploads

---

## 🎯 Bot Commands

```
/start               → Show welcome message
/chk {card}         → Check credit card
/bin {bin6}         → Get BIN information
/phone {number}     → Lookup phone
/vehicle {rc}       → Lookup vehicle
/aadhaar {number}   → Lookup Aadhaar
/osint              → Open web app
```

---

## ⚡ Key Features

✅ All-in-one lookup tool
✅ No installation needed
✅ Works in any browser
✅ Mobile friendly
✅ Automatic caching
✅ Search history
✅ Real-time validation
✅ Error recovery
✅ Privacy focused
✅ Blazing fast

---

## 🔧 Customization

### Change API URLs
Edit `osint-web-app/app.js` lines 1-9:
```javascript
const APIS = {
    phone: {
        url: 'YOUR_NEW_PHONE_API?term=',
    },
    vehicle: {
        url: 'YOUR_NEW_VEHICLE_API?rc=',
    },
    aadhaar: {
        url: 'YOUR_NEW_AADHAAR_API?id=',
    },
};
```

### Change Colors
Edit `osint-web-app/index.html` lines 15-16:
```html
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change UI Text
Edit the HTML labels and placeholders in `index.html`

---

## 🐛 Common Issues

### "API not responding"
→ Check internet connection
→ Try CORS proxy manually
→ Check API service status

### "No results found"
→ Verify input format
→ Check data exists
→ Try different input

### "Cache showing old data"
→ Click "Clear History"
→ Hard refresh (Ctrl+Shift+Del)
→ Wait 24 hours for auto-expire

### "Button not working on Telegram"
→ Update cc_bot.py with correct URL
→ Restart bot
→ Try in different chat

---

## 📊 Performance

| Operation | Time | Notes |
|-----------|------|-------|
| First search | 2-5s | API call + processing |
| Cached search | <1s | Instant from cache |
| UI load | <1s | No server needed |
| Form validation | <100ms | Instant feedback |

---

## 🔐 Legal Disclaimer

**Use responsibly:**
✅ Own data lookups
✅ Authorized access
✅ Educational purposes
✅ Research and testing

❌ Unauthorized access
❌ Privacy violations
❌ Commercial misuse
❌ Illegal activities

---

## 📚 File Reference

```
osint-web-app/
├── index.html          (2,100 lines - UI & Structure)
├── app.js             (850 lines - APIs & Logic)
└── README.md          (Deployment guide)

cc_bot.py
├── Lines 3598-3650    (Phone lookup command)
├── Lines 3652-3705    (Vehicle lookup command)
├── Lines 3707-3756    (Aadhaar lookup command)
└── Lines 3758-3771    (Web app button)
```

---

## 🎓 Learning Resources

- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **localStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **WebApp Integration:** https://core.telegram.org/bots/webapps

---

## 📞 Support

Check these if something doesn't work:

1. **Browser Console:** F12 → Console tab
2. **Network Tab:** F12 → Network tab (check API calls)
3. **Local Storage:** F12 → Application → localStorage
4. **Bot Logs:** Check cc_bot.py output

---

## ✨ Next Features (Optional)

- Export results to PDF
- API response logging
- Custom search templates
- Multi-language support
- Dark mode
- Advanced filtering
- Batch processing
- Database integration

---

## 🎉 You're All Set!

1. ✅ Web app created
2. ✅ Bot commands added
3. ✅ APIs integrated
4. ✅ Ready to deploy

**Next:** Deploy and test! 🚀

Any questions? Check browser console (F12) for error details.
