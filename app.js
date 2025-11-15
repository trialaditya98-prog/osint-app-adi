// API Configuration
const APIS = {
    phone: {
        url: 'https://shadow-x-osint.vercel.app/api?key=Shadow&type=mobile&term=',
        corsProxy: 'https://cors-anywhere.herokuapp.com/'
    },
    vehicle: {
        url: 'http://gaurav-vehicle-info-api.vercel.app?rc_number=',
        corsProxy: 'https://cors-anywhere.herokuapp.com/'
    },
    aadhaar: {
        url: 'https://chx-family-info.vercel.app/fetch?key=paidchx&aadhaar=',
        corsProxy: 'https://cors-anywhere.herokuapp.com/'
    },
    card: {
        // Internal lookup - no external API needed for basic card info
        corsProxy: 'https://cors-anywhere.herokuapp.com/'
    }
};

// Local storage keys
const STORAGE_KEYS = {
    history: 'osint_search_history',
    phoneCache: 'phone_lookup_cache',
    vehicleCache: 'vehicle_lookup_cache',
    aadhaarCache: 'aadhaar_lookup_cache',
    cardCache: 'card_lookup_cache'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupEnterKey();
});

// Setup Enter key for all inputs
function setupEnterKey() {
    document.getElementById('phoneInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') lookupPhone();
    });
    document.getElementById('vehicleInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') lookupVehicle();
    });
    document.getElementById('aadhaarInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') lookupAadhaar();
    });
    document.getElementById('cardInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') lookupCard();
    });
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('tab-active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.remove('hidden');
    
    // Add active class to clicked button
    event.target.closest('.tab-button').classList.add('tab-active');
}

// Phone Lookup
async function lookupPhone() {
    const phone = document.getElementById('phoneInput').value.trim();
    const resultDiv = document.getElementById('phoneResult');
    
    if (!phone) {
        showError(resultDiv, 'Please enter a phone number');
        return;
    }
    
    if (!/^\d{10}$/.test(phone.replace(/[^\d]/g, ''))) {
        showError(resultDiv, 'Please enter a valid 10-digit phone number');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const cachedResult = getCachedResult('phone', phone);
        if (cachedResult) {
            displayPhoneResult(resultDiv, cachedResult);
            addToHistory('Phone', phone);
            return;
        }
        
        const response = await fetchWithFallback(
            APIS.phone.url + phone,
            APIS.phone.corsProxy
        );
        
        const data = await response.json();
        
        if (data.success || data.data) {
            cacheResult('phone', phone, data);
            displayPhoneResult(resultDiv, data);
            addToHistory('Phone', phone);
        } else {
            showError(resultDiv, data.message || 'Phone number not found');
        }
    } catch (error) {
        showError(resultDiv, 'Error fetching phone data: ' + error.message);
    }
}

// Vehicle Lookup
async function lookupVehicle() {
    const rcNumber = document.getElementById('vehicleInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('vehicleResult');
    
    if (!rcNumber) {
        showError(resultDiv, 'Please enter an RC number');
        return;
    }
    
    if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(rcNumber)) {
        showError(resultDiv, 'Invalid RC number format (e.g., MP07SD7547)');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const cachedResult = getCachedResult('vehicle', rcNumber);
        if (cachedResult) {
            displayVehicleResult(resultDiv, cachedResult);
            addToHistory('Vehicle', rcNumber);
            return;
        }
        
        const response = await fetchWithFallback(
            APIS.vehicle.url + rcNumber,
            APIS.vehicle.corsProxy
        );
        
        const data = await response.json();
        
        if (data.success || data.data || Object.keys(data).length > 0) {
            cacheResult('vehicle', rcNumber, data);
            displayVehicleResult(resultDiv, data);
            addToHistory('Vehicle', rcNumber);
        } else {
            showError(resultDiv, 'Vehicle information not found');
        }
    } catch (error) {
        showError(resultDiv, 'Error fetching vehicle data: ' + error.message);
    }
}

// Aadhaar Lookup
async function lookupAadhaar() {
    const aadhaar = document.getElementById('aadhaarInput').value.trim();
    const resultDiv = document.getElementById('aadhaarResult');
    
    if (!aadhaar) {
        showError(resultDiv, 'Please enter an Aadhaar number');
        return;
    }
    
    if (!/^\d{12}$/.test(aadhaar)) {
        showError(resultDiv, 'Please enter a valid 12-digit Aadhaar number');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const cachedResult = getCachedResult('aadhaar', aadhaar);
        if (cachedResult) {
            displayAadhaarResult(resultDiv, cachedResult);
            addToHistory('Aadhaar', aadhaar.slice(-4).padStart(12, '*'));
            return;
        }
        
        const response = await fetchWithFallback(
            APIS.aadhaar.url + aadhaar,
            APIS.aadhaar.corsProxy
        );
        
        const data = await response.json();
        
        if (data.success || data.data || Object.keys(data).length > 0) {
            cacheResult('aadhaar', aadhaar, data);
            displayAadhaarResult(resultDiv, data);
            addToHistory('Aadhaar', aadhaar.slice(-4).padStart(12, '*'));
        } else {
            showError(resultDiv, 'Aadhaar information not found');
        }
    } catch (error) {
        showError(resultDiv, 'Error fetching Aadhaar data: ' + error.message);
    }
}

// Card Lookup
async function lookupCard() {
    const cardNumber = document.getElementById('cardInput').value.trim().replace(/\s/g, '');
    const resultDiv = document.getElementById('cardResult');
    
    if (!cardNumber) {
        showError(resultDiv, 'Please enter a card number');
        return;
    }
    
    if (!/^\d{13,19}$/.test(cardNumber)) {
        showError(resultDiv, 'Please enter a valid card number (13-19 digits)');
        return;
    }
    
    // Validate with Luhn algorithm
    if (!luhnCheck(cardNumber)) {
        showError(resultDiv, 'Invalid card number (Luhn check failed)');
        return;
    }
    
    showLoading(resultDiv);
    
    try {
        const cachedResult = getCachedResult('card', cardNumber);
        if (cachedResult) {
            displayCardResult(resultDiv, cachedResult);
            addToHistory('Card', cardNumber.slice(-4).padStart(cardNumber.length, '*'));
            return;
        }
        
        const cardInfo = analyzeCard(cardNumber);
        cacheResult('card', cardNumber, cardInfo);
        displayCardResult(resultDiv, cardInfo);
        addToHistory('Card', cardNumber.slice(-4).padStart(cardNumber.length, '*'));
    } catch (error) {
        showError(resultDiv, 'Error analyzing card: ' + error.message);
    }
}

// Card Analysis Function
function analyzeCard(cardNumber) {
    const bin = cardNumber.slice(0, 6);
    const cardBrand = detectCardBrand(cardNumber);
    const cardType = detectCardType(cardNumber);
    const issuingBank = detectIssuingBank(cardNumber);
    
    return {
        number: cardNumber,
        bin: bin,
        last4: cardNumber.slice(-4),
        brand: cardBrand,
        type: cardType,
        bank: issuingBank,
        length: cardNumber.length,
        valid: true
    };
}

// Detect Card Brand
function detectCardBrand(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    const first2Digits = cardNumber.slice(0, 2);
    const first3Digits = cardNumber.slice(0, 3);
    const first4Digits = cardNumber.slice(0, 4);
    const first6Digits = cardNumber.slice(0, 6);
    
    if (firstDigit === '4') {
        return 'VISA';
    } else if ((first2Digits >= '51' && first2Digits <= '59') || 
               (first2Digits === '22' && parseInt(cardNumber.slice(2, 4)) >= 20 && parseInt(cardNumber.slice(2, 4)) <= 23)) {
        return 'MASTERCARD';
    } else if (first2Digits === '34' || first2Digits === '37') {
        return 'AMERICAN EXPRESS';
    } else if (first4Digits >= '6011' || first2Digits === '65' || first2Digits === '64') {
        return 'DISCOVER';
    } else if (first4Digits >= '3528' && first4Digits <= '3589') {
        return 'JCB';
    } else if (first2Digits === '36' || first2Digits === '38' || first2Digits === '39') {
        return 'DINERS CLUB';
    } else if (first2Digits === '62') {
        return 'UNIONPAY';
    } else if (first2Digits === '50') {
        return 'AURA';
    }
    
    return 'UNKNOWN';
}

// Detect Card Type
function detectCardType(cardNumber) {
    const brand = detectCardBrand(cardNumber);
    const firstDigit = cardNumber.charAt(0);
    
    // Most cards are CREDIT by default
    // DEBIT detection based on patterns
    if (['4', '5', '6'].includes(firstDigit)) {
        return 'CREDIT'; // Default assumption
    }
    
    return 'CREDIT';
}

// Detect Issuing Bank
function detectIssuingBank(cardNumber) {
    const bin = cardNumber.slice(0, 6);
    
    const bankDatabase = {
        '413000': 'STATE BANK OF INDIA (SBI)',
        '414000': 'AXIS BANK',
        '415000': 'HDFC BANK',
        '416000': 'ICICI BANK',
        '417000': 'KOTAK BANK',
        '418000': 'BANK OF BARODA',
        '419000': 'UNION BANK OF INDIA',
        '420000': 'BANK OF INDIA',
        '421000': 'PUNJAB NATIONAL BANK',
        '422000': 'CANARA BANK',
        '423000': 'BANK OF MAHARASHTRA',
        '424000': 'IDBI BANK',
        '425000': 'CENTRAL BANK OF INDIA',
        '451000': 'CITIBANK',
        '452000': 'HSBC BANK',
        '453000': 'STANDARD CHARTERED',
        '454000': 'DEUTSCHE BANK',
        '500000': 'MASTERCARD GENERIC',
        '510000': 'MASTERCARD GENERIC',
        '520000': 'MASTERCARD GENERIC',
        '530000': 'MASTERCARD GENERIC',
        '540000': 'MASTERCARD GENERIC',
        '550000': 'MASTERCARD GENERIC',
        '600000': 'DISCOVER/UNIONPAY',
        '640000': 'DISCOVER',
        '650000': 'DISCOVER',
    };
    
    return bankDatabase[bin] || 'UNKNOWN ISSUER';
}

// Luhn Algorithm Validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

// Fetch with CORS proxy fallback
async function fetchWithFallback(url, corsProxy, timeout = 15000) {
    const abortSignal = AbortSignal.timeout(timeout);
    
    try {
        // Try direct fetch first
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            signal: abortSignal
        });
        
        if (response.ok) {
            return response;
        }
        
        // If direct fails, try with CORS proxy
        throw new Error('Direct fetch failed');
    } catch (error) {
        try {
            // Try with CORS proxy
            const proxyUrl = corsProxy + url;
            const response = await fetch(proxyUrl, {
                headers: {
                    'Accept': 'application/json',
                },
                signal: abortSignal
            });
            
            if (response.ok) {
                return response;
            }
            
            throw new Error('CORS proxy fetch failed');
        } catch (proxyError) {
            throw new Error('Failed to fetch data from both direct and proxy: ' + error.message);
        }
    }
}

// Display Results
function displayPhoneResult(resultDiv, data) {
    const resultData = data.data || data;
    
    let html = '<div class="result-card mt-4">';
    
    if (resultData.phone) html += `<div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${resultData.phone}</span></div>`;
    if (resultData.name) html += `<div class="info-row"><span class="info-label">Name:</span><span class="info-value">${resultData.name}</span></div>`;
    if (resultData.operator) html += `<div class="info-row"><span class="info-label">Operator:</span><span class="info-value">${resultData.operator}</span></div>`;
    if (resultData.country) html += `<div class="info-row"><span class="info-label">Country:</span><span class="info-value">${resultData.country}</span></div>`;
    if (resultData.circle) html += `<div class="info-row"><span class="info-label">Circle:</span><span class="info-value">${resultData.circle}</span></div>`;
    if (resultData.type) html += `<div class="info-row"><span class="info-label">Type:</span><span class="info-value">${resultData.type}</span></div>`;
    if (resultData.status) html += `<div class="info-row"><span class="info-label">Status:</span><span class="info-value">${resultData.status}</span></div>`;
    if (resultData.city) html += `<div class="info-row"><span class="info-label">City:</span><span class="info-value">${resultData.city}</span></div>`;
    
    html += '</div>';
    resultDiv.innerHTML = html;
}

function displayVehicleResult(resultDiv, data) {
    const resultData = data.data || data;
    
    let html = '<div class="result-card mt-4">';
    
    // Handle different response formats
    if (resultData.rc_number) html += `<div class="info-row"><span class="info-label">RC Number:</span><span class="info-value">${resultData.rc_number}</span></div>`;
    if (resultData.owner_name) html += `<div class="info-row"><span class="info-label">Owner:</span><span class="info-value">${resultData.owner_name}</span></div>`;
    if (resultData.vehicle_type) html += `<div class="info-row"><span class="info-label">Vehicle Type:</span><span class="info-value">${resultData.vehicle_type}</span></div>`;
    if (resultData.registration_number) html += `<div class="info-row"><span class="info-label">Registration:</span><span class="info-value">${resultData.registration_number}</span></div>`;
    if (resultData.maker_model) html += `<div class="info-row"><span class="info-label">Model:</span><span class="info-value">${resultData.maker_model}</span></div>`;
    if (resultData.chasis_number) html += `<div class="info-row"><span class="info-label">Chassis:</span><span class="info-value">${resultData.chasis_number}</span></div>`;
    if (resultData.engine_number) html += `<div class="info-row"><span class="info-label">Engine:</span><span class="info-value">${resultData.engine_number}</span></div>`;
    if (resultData.registration_date) html += `<div class="info-row"><span class="info-label">Registration Date:</span><span class="info-value">${resultData.registration_date}</span></div>`;
    if (resultData.fuel_type) html += `<div class="info-row"><span class="info-label">Fuel Type:</span><span class="info-value">${resultData.fuel_type}</span></div>`;
    if (resultData.color) html += `<div class="info-row"><span class="info-label">Color:</span><span class="info-value">${resultData.color}</span></div>`;
    if (resultData.phone_number) html += `<div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${resultData.phone_number}</span></div>`;
    if (resultData.address) html += `<div class="info-row"><span class="info-label">Address:</span><span class="info-value">${resultData.address}</span></div>`;
    
    html += '</div>';
    resultDiv.innerHTML = html;
}

function displayAadhaarResult(resultDiv, data) {
    const resultData = data.data || data;
    
    let html = '<div class="result-card mt-4">';
    
    if (resultData.name) html += `<div class="info-row"><span class="info-label">Name:</span><span class="info-value">${resultData.name}</span></div>`;
    if (resultData.gender) html += `<div class="info-row"><span class="info-label">Gender:</span><span class="info-value">${resultData.gender}</span></div>`;
    if (resultData.dob) html += `<div class="info-row"><span class="info-label">DOB:</span><span class="info-value">${resultData.dob}</span></div>`;
    if (resultData.aadhaar) html += `<div class="info-row"><span class="info-label">Aadhaar:</span><span class="info-value">${resultData.aadhaar}</span></div>`;
    if (resultData.address) html += `<div class="info-row"><span class="info-label">Address:</span><span class="info-value">${resultData.address}</span></div>`;
    if (resultData.state) html += `<div class="info-row"><span class="info-label">State:</span><span class="info-value">${resultData.state}</span></div>`;
    if (resultData.district) html += `<div class="info-row"><span class="info-label">District:</span><span class="info-value">${resultData.district}</span></div>`;
    if (resultData.phone) html += `<div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${resultData.phone}</span></div>`;
    if (resultData.email) html += `<div class="info-row"><span class="info-label">Email:</span><span class="info-value">${resultData.email}</span></div>`;
    if (resultData.family_members) html += `<div class="info-row"><span class="info-label">Family Members:</span><span class="info-value">${Array.isArray(resultData.family_members) ? resultData.family_members.join(', ') : resultData.family_members}</span></div>`;
    
    html += '</div>';
    resultDiv.innerHTML = html;
}

function displayCardResult(resultDiv, cardInfo) {
    let html = `
        <div class="result-card mt-4">
            <div class="card-preview">
                <div style="font-size: 24px; letter-spacing: 2px; margin-bottom: 15px;">
                    ${'•'.repeat(cardInfo.length - 4)} ${cardInfo.last4}
                </div>
                <div style="font-size: 12px; opacity: 0.8;">Card Holder Name</div>
            </div>
            
            <div class="info-row"><span class="info-label">Card Number:</span><span class="info-value">${cardInfo.number.slice(0, 4)} •••• •••• ${cardInfo.last4}</span></div>
            <div class="info-row"><span class="info-label">BIN:</span><span class="info-value">${cardInfo.bin}</span></div>
            <div class="info-row"><span class="info-label">Brand:</span><span class="info-value">${cardInfo.brand}</span></div>
            <div class="info-row"><span class="info-label">Card Type:</span><span class="info-value">${cardInfo.type}</span></div>
            <div class="info-row"><span class="info-label">Issuing Bank:</span><span class="info-value">${cardInfo.bank}</span></div>
            <div class="info-row"><span class="info-label">Card Length:</span><span class="info-value">${cardInfo.length} digits</span></div>
            <div class="info-row"><span class="info-label">Valid:</span><span class="info-value">${cardInfo.valid ? '✅ Yes' : '❌ No'}</span></div>
        </div>
    `;
    resultDiv.innerHTML = html;
}

// Utility Functions
function showLoading(resultDiv) {
    resultDiv.innerHTML = '<div class="flex items-center justify-center py-8"><div class="loader"></div><span class="ml-4 text-white">Searching...</span></div>';
}

function showError(resultDiv, message) {
    resultDiv.innerHTML = `<div class="error-box mt-4"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}

function showSuccess(resultDiv, message) {
    resultDiv.innerHTML = `<div class="success-box mt-4"><i class="fas fa-check-circle"></i> ${message}</div>`;
}

// Cache Management
function cacheResult(type, key, data) {
    const cacheKey = STORAGE_KEYS[type + 'Cache'];
    let cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    cache[key] = {
        data: data,
        timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
}

function getCachedResult(type, key) {
    const cacheKey = STORAGE_KEYS[type + 'Cache'];
    let cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const cached = cache[key];
    
    if (cached) {
        // Cache valid for 24 hours
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            return cached.data;
        } else {
            // Remove expired cache
            delete cache[key];
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        }
    }
    
    return null;
}

// History Management
function addToHistory(type, value) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
    
    // Add new entry
    history.unshift({
        type: type,
        value: value,
        timestamp: new Date().toLocaleString()
    });
    
    // Keep only last 20 searches
    history = history.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
    const historyDiv = document.getElementById('history');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="text-white/60">No searches yet</p>';
        return;
    }
    
    let html = '';
    history.forEach(item => {
        const icons = {
            'Phone': '<i class="fas fa-phone"></i>',
            'Vehicle': '<i class="fas fa-car"></i>',
            'Aadhaar': '<i class="fas fa-id-card"></i>',
            'Card': '<i class="fas fa-credit-card"></i>'
        };
        
        html += `
            <div class="flex justify-between items-center p-2 bg-white/10 rounded text-white/80 text-sm">
                <span>${icons[item.type]} ${item.type}: ${item.value}</span>
                <span class="text-white/50 text-xs">${item.timestamp}</span>
            </div>
        `;
    });
    
    historyDiv.innerHTML = html;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all search history?')) {
        localStorage.removeItem(STORAGE_KEYS.history);
        loadHistory();
    }
}
