import { proxy } from 'valtio'

// Supported currencies
export const currencies = {
    INR: { symbol: '₹', name: 'Indian Rupee', rate: 83 },
    USD: { symbol: '$', name: 'US Dollar', rate: 1 },
    EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
    GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
    JPY: { symbol: '¥', name: 'Japanese Yen', rate: 148 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
    THB: { symbol: '฿', name: 'Thai Baht', rate: 35.5 },
}

// Country to currency mapping
export const countryToCurrency = {
    IN: 'INR', US: 'USD', GB: 'GBP', JP: 'JPY', AU: 'AUD',
    CA: 'CAD', SG: 'SGD', AE: 'AED', TH: 'THB', DE: 'EUR',
    FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
}

// Hardcoded countries list
const countriesList = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'TH', name: 'Thailand' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'PH', name: 'Philippines' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'KR', name: 'South Korea' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'ZA', name: 'South Africa' },
]

// Hardcoded states by country
const statesByCountry = {
    'India': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'],
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'],
    'Germany': ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Saxony'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawa', 'Kanagawa', 'Aichi'],
    'Singapore': ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
    'Thailand': ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Chonburi', 'Surat Thani'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
}

// Hardcoded cities by state
const citiesByState = {
    // India
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Munnar'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    'Madhya Pradesh': ['Dewas', 'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Prayagraj'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Darjeeling'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    // USA
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Brooklyn'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Springfield', 'Aurora', 'Naperville'],
    'Washington': ['Seattle', 'Tacoma', 'Spokane', 'Bellevue'],
    'Massachusetts': ['Boston', 'Cambridge', 'Worcester', 'Springfield'],
    'Nevada': ['Las Vegas', 'Reno', 'Henderson'],
    'Arizona': ['Phoenix', 'Tucson', 'Scottsdale', 'Mesa'],
    'Colorado': ['Denver', 'Colorado Springs', 'Boulder', 'Aurora'],
    // UK
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
    // Canada
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
    'British Columbia': ['Vancouver', 'Victoria', 'Kelowna', 'Surrey'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval'],
    // Japan
    'Tokyo': ['Shibuya', 'Shinjuku', 'Minato', 'Chiyoda', 'Setagaya'],
    'Osaka': ['Osaka', 'Sakai', 'Higashiosaka'],
    'Kyoto': ['Kyoto', 'Uji', 'Kameoka'],
    // Thailand
    'Bangkok': ['Sukhumvit', 'Silom', 'Siam', 'Chatuchak', 'Thonburi'],
    // France
    'Île-de-France': ['Paris', 'Versailles', 'Boulogne-Billancourt', 'Saint-Denis'],
    'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Cannes', 'Aix-en-Provence'],
    'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Annecy'],
    // Germany
    'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg'],
    'Berlin': ['Berlin', 'Potsdam'],
    'Hamburg': ['Hamburg'],
    // Australia
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
    // UAE
    'Dubai': ['Dubai', 'Deira', 'Jumeirah', 'Marina'],
    'Abu Dhabi': ['Abu Dhabi', 'Al Ain'],
}

// Location state
export const locationState = proxy({
    loading: false,
    showPrompt: false, // User can open it manually
    showPermissionDialog: true,
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    countryCode: 'IN',
    currency: 'INR',
    countries: countriesList,
    states: statesByCountry['India'] || [],
    cities: citiesByState['Madhya Pradesh'] || [],
    loadingStates: false,
    loadingCities: false,
})

// Detect location (Hardcoded to Indore as per user request)
export async function detectLocation() {
    locationState.loading = true

    // Simulate delay or just set immediately
    setTimeout(() => {
        locationState.city = 'Indore'
        locationState.state = 'Madhya Pradesh'
        locationState.country = 'India'
        locationState.countryCode = 'IN'
        locationState.currency = 'INR'

        // Load states for India
        locationState.states = statesByCountry['India'] || []

        locationState.loading = false
        locationState.showPrompt = false // Don't auto-prompt if hardcoded
    }, 500)
}

// Set currency
export function setCurrency(code) {
    locationState.currency = code
}

// Close location prompt
export function closeLocationPrompt() {
    locationState.showPrompt = false
}

// Open location prompt
export function openLocationPrompt() {
    locationState.showPrompt = true
}

// Set location manually
export function setLocation(city, state, country, countryCode) {
    locationState.city = city
    locationState.state = state
    locationState.country = country
    locationState.countryCode = countryCode
    locationState.currency = countryToCurrency[countryCode] || locationState.currency
}

// Fetch states for country (hardcoded)
export function fetchStates(countryName) {
    locationState.loadingStates = true
    setTimeout(() => {
        locationState.states = statesByCountry[countryName] || []
        locationState.loadingStates = false
    }, 100)
}

// Fetch cities for state (hardcoded)
export function fetchCities(countryName, stateName) {
    locationState.loadingCities = true
    setTimeout(() => {
        locationState.cities = citiesByState[stateName] || []
        locationState.loadingCities = false
    }, 100)
}

// Format currency
export function formatCurrency(amountUSD, currencyCode) {
    const curr = currencies[currencyCode] || currencies.USD
    const converted = Math.round(amountUSD * curr.rate)

    // Format with commas (Indian style for INR)
    if (currencyCode === 'INR') {
        return `${curr.symbol}${converted.toLocaleString('en-IN')}`
    }
    return `${curr.symbol}${converted.toLocaleString()}`
}
