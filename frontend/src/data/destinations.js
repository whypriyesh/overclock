// 150 Hardcoded Travel Destinations with Rich Metadata
export const allDestinations = [
    // --- INDIA (Domestic) ---
    // Spiritual
    { id: 101, name: 'Varanasi', country: 'India', description: 'Spiritual capital of India along the Ganges.', highlights: 'Ganga Aarti, Kashi Vishwanath, Ghats', estimatedCost: 1000, bestTime: 'October-March', tripType: 'spiritual', terrain: 'city' },
    { id: 102, name: 'Rishikesh', country: 'India', description: 'Yoga capital of the world in the Himalayas.', highlights: 'River Rafting, Yoga Ashrams, Laxman Jhula', estimatedCost: 1200, bestTime: 'September-November, March-May', tripType: 'spiritual', terrain: 'mountain' },
    { id: 103, name: 'Amritsar', country: 'India', description: 'Home to the Golden Temple.', highlights: 'Golden Temple, Wagah Border, Jallianwala Bagh', estimatedCost: 1100, bestTime: 'November-March', tripType: 'spiritual', terrain: 'city' },
    { id: 104, name: 'Tirupati', country: 'India', description: 'Major pilgrimage site in Andhra Pradesh.', highlights: 'Venkateswara Temple, Silathoranam', estimatedCost: 900, bestTime: 'September-February', tripType: 'spiritual', terrain: 'mountain' },

    // Mountains
    { id: 105, name: 'Leh Ladakh', country: 'India', description: 'High-altitude desert and monasteries.', highlights: 'Pangong Lake, Nubra Valley, Monasteries', estimatedCost: 2500, bestTime: 'June-September', tripType: 'adventure', terrain: 'mountain' },
    { id: 106, name: 'Manali', country: 'India', description: 'Himalayan resort town backpacker center.', highlights: 'Solang Valley, Rohtang Pass, Old Manali', estimatedCost: 1500, bestTime: 'October-June', tripType: 'adventure', terrain: 'mountain' },
    { id: 107, name: 'Sikkim', country: 'India', description: 'Organic state with Kangchenjunga views.', highlights: 'Nathula Pass, Tsomgo Lake, Gangtok', estimatedCost: 1800, bestTime: 'March-May, October-December', tripType: 'relaxation', terrain: 'mountain' },
    { id: 108, name: 'Gulmarg', country: 'India', description: 'Skiing destination in Kashmir.', highlights: 'Gondola Ride, Skiing, Snow', estimatedCost: 2200, bestTime: 'December-March', tripType: 'adventure', terrain: 'mountain' },

    // Beach
    { id: 109, name: 'Goa', country: 'India', description: 'Party capital with sunny beaches.', highlights: 'Baga Beach, Fort Aguada, Dudhsagar Falls', estimatedCost: 1600, bestTime: 'November-February', tripType: 'party', terrain: 'beach' },
    { id: 110, name: 'Andaman', country: 'India', description: 'Pristine islands and coral reefs.', highlights: 'Radhanagar Beach, Scuba Diving, Havelock', estimatedCost: 2800, bestTime: 'October-May', tripType: 'romantic', terrain: 'beach' },
    { id: 111, name: 'Varkala', country: 'India', description: 'Coastal town with red cliffs.', highlights: 'Varkala Beach, Janardanaswamy Temple', estimatedCost: 1200, bestTime: 'October-March', tripType: 'relaxation', terrain: 'beach' },
    { id: 112, name: 'Pondicherry', country: 'India', description: 'French colonial settlement.', highlights: 'Promenade Beach, Auroville, French Quarter', estimatedCost: 1400, bestTime: 'October-March', tripType: 'cultural', terrain: 'beach' },

    // Cultural / City / Countryside
    { id: 113, name: 'Udaipur', country: 'India', description: 'City of Lakes with lavish palaces.', highlights: 'City Palace, Lake Pichola, Jag Mandir', estimatedCost: 2000, bestTime: 'September-March', tripType: 'romantic', terrain: 'city' },
    { id: 114, name: 'Hampi', country: 'India', description: 'Ancient ruins of Vijayanagara Empire.', highlights: 'Virupaksha Temple, Stone Chariot', estimatedCost: 1100, bestTime: 'October-February', tripType: 'cultural', terrain: 'countryside' },
    { id: 115, name: 'Coorg', country: 'India', description: 'Coffee plantations and misty hills.', highlights: 'Abbey Falls, Coffee Tours, Raja Seat', estimatedCost: 1500, bestTime: 'October-March', tripType: 'romantic', terrain: 'countryside' },
    { id: 116, name: 'Jaisalmer', country: 'India', description: 'Golden City in the Thar Desert.', highlights: 'Jaisalmer Fort, Sam Sand Dunes, Camel Safari', estimatedCost: 1700, bestTime: 'November-March', tripType: 'adventure', terrain: 'countryside' },
    { id: 117, name: 'Lucknow', country: 'India', description: 'City of Nawabs and kebabs.', highlights: 'Bara Imambara, Tunday Kababi, Rumi Darwaza', estimatedCost: 1300, bestTime: 'October-March', tripType: 'foodie', terrain: 'city' },
    { id: 118, name: 'Delhi', country: 'India', description: 'Historic capital with amazing street food.', highlights: 'Chandni Chowk, Red Fort, Humayun Tomb', estimatedCost: 1500, bestTime: 'October-March', tripType: 'foodie', terrain: 'city' },

    // --- NEARBY (Asia/Middle East) ---
    // Spiritual / Cultural
    { id: 201, name: 'Kathmandu', country: 'Nepal', description: 'Historic temples and Himalayan gateway.', highlights: 'Pashupatinath, Boudhanath, Durbar Square', estimatedCost: 1200, bestTime: 'September-November', tripType: 'spiritual', terrain: 'mountain' },
    { id: 202, name: 'Paro', country: 'Bhutan', description: 'Cliffside monasteries and peace.', highlights: 'Tiger\'s Nest, Rinpung Dzong', estimatedCost: 3500, bestTime: 'March-May', tripType: 'spiritual', terrain: 'mountain' },
    { id: 203, name: 'Bali', country: 'Indonesia', description: 'Island of Gods.', highlights: 'Uluwatu Temple, Ubud, Rice Terraces', estimatedCost: 1800, bestTime: 'April-October', tripType: 'romantic', terrain: 'beach' },
    { id: 204, name: 'Siem Reap', country: 'Cambodia', description: 'Ancient Angkor temples.', highlights: 'Angkor Wat, Bayon, Ta Prohm', estimatedCost: 1400, bestTime: 'November-March', tripType: 'cultural', terrain: 'countryside' },
    { id: 213, name: 'Bangkok', country: 'Thailand', description: 'Street food capital of the world.', highlights: 'Street Food, Grand Palace, Wat Arun', estimatedCost: 1500, bestTime: 'November-Fbeurary', tripType: 'foodie', terrain: 'city' },

    // Beach / Relaxation
    { id: 205, name: 'Maldives', country: 'Maldives', description: 'Luxury overwater villas.', highlights: 'Snorkeling, Private Island, Spa', estimatedCost: 4500, bestTime: 'November-April', tripType: 'romantic', terrain: 'beach' },
    { id: 206, name: 'Phuket', country: 'Thailand', description: 'Top beach destination in Asia.', highlights: 'Patong, Phi Phi Islands, Big Buddha', estimatedCost: 1600, bestTime: 'November-February', tripType: 'party', terrain: 'beach' },
    { id: 207, name: 'Langkawi', country: 'Malaysia', description: 'Jewel of Kedah.', highlights: 'Sky Bridge, Mangroves, Beaches', estimatedCost: 1500, bestTime: 'January-March', tripType: 'relaxation', terrain: 'beach' },
    { id: 208, name: 'Da Nang', country: 'Vietnam', description: 'Coastal city with Golden Bridge.', highlights: 'My Khe Beach, Ba Na Hills, Marble Mountains', estimatedCost: 1300, bestTime: 'February-May', tripType: 'relaxation', terrain: 'beach' },

    // City / Adventure
    { id: 209, name: 'Dubai', country: 'UAE', description: 'City of gold and skyscrapers.', highlights: 'Burj Khalifa, Desert Safari, Shopping', estimatedCost: 2500, bestTime: 'November-March', tripType: 'luxury', terrain: 'city' },
    { id: 210, name: 'Singapore', country: 'Singapore', description: 'Garden city of the future.', highlights: 'Marina Bay, Sentosa, Hawker Centers', estimatedCost: 2200, bestTime: 'Year-round', tripType: 'foodie', terrain: 'city' },
    { id: 211, name: 'Tokyo', country: 'Japan', description: 'Neon lights and sushi masters.', highlights: 'Shibuya, Shinjuku, Sushi', estimatedCost: 3000, bestTime: 'March-May', tripType: 'foodie', terrain: 'city' },
    { id: 212, name: 'Colombo', country: 'Sri Lanka', description: 'Coastal capital with colonial roots.', highlights: 'Gangaramaya Temple, Galle Face Green', estimatedCost: 1200, bestTime: 'January-March', tripType: 'cultural', terrain: 'city' },

    // --- INTERNATIONAL (Rest of World) ---
    // Spiritual / Cultural
    { id: 301, name: 'Rome', country: 'Italy', description: 'The Eternal City with amazing pasta.', highlights: 'Vatican City, Colosseum, Pasta', estimatedCost: 2800, bestTime: 'April-June', tripType: 'foodie', terrain: 'city' },
    { id: 302, name: 'Jerusalem', country: 'Israel', description: 'Holy city for three faiths.', highlights: 'Western Wall, Holy Sepulchre', estimatedCost: 2600, bestTime: 'April-May', tripType: 'spiritual', terrain: 'city' },
    { id: 303, name: 'Kyoto', country: 'Japan', description: 'Heart of traditional Japan.', highlights: 'Kinkaku-ji, Fushimi Inari, Bamboo Grove', estimatedCost: 2900, bestTime: 'March-May', tripType: 'cultural', terrain: 'city' },
    { id: 304, name: 'Cairo', country: 'Egypt', description: 'Land of Pharaohs.', highlights: 'Pyramids, Sphinx, Nile Cruise', estimatedCost: 1800, bestTime: 'October-April', tripType: 'cultural', terrain: 'countryside' },

    // Mountains / Adventure
    { id: 305, name: 'Swiss Alps', country: 'Switzerland', description: 'Peak of European beauty.', highlights: 'Matterhorn, Jungfrau, Skiing', estimatedCost: 4000, bestTime: 'December-March', tripType: 'adventure', terrain: 'mountain' },
    { id: 306, name: 'Queenstown', country: 'New Zealand', description: 'Adventure capital of the world.', highlights: 'Bungee Jumping, Milford Sound', estimatedCost: 3500, bestTime: 'December-February', tripType: 'adventure', terrain: 'mountain' },
    { id: 307, name: 'Banff', country: 'Canada', description: 'Rocky Mountain majesty.', highlights: 'Lake Louise, Moraine Lake, Hiking', estimatedCost: 3200, bestTime: 'June-August', tripType: 'adventure', terrain: 'mountain' },
    { id: 308, name: 'Patagonia', country: 'Argentina', description: 'End of the world wilderness.', highlights: 'Perito Moreno, Fiz Roy, Trekking', estimatedCost: 3800, bestTime: 'November-March', tripType: 'adventure', terrain: 'mountain' },

    // Beach / Relaxation
    { id: 309, name: 'Bora Bora', country: 'French Polynesia', description: 'Romantic luxury island.', highlights: 'Overwater Bungalows, Lagoon', estimatedCost: 6000, bestTime: 'May-October', tripType: 'romantic', terrain: 'beach' },
    { id: 310, name: 'Maui', country: 'USA', description: 'Hawaiian paradise.', highlights: 'Road to Hana, Haleakala, Beaches', estimatedCost: 4500, bestTime: 'April-May', tripType: 'relaxation', terrain: 'beach' },
    { id: 311, name: 'Santorini', country: 'Greece', description: 'White buildings, blue domes.', highlights: 'Oia Sunset, Caldera, Wine Tasting', estimatedCost: 3000, bestTime: 'May-October', tripType: 'romantic', terrain: 'beach' },
    { id: 312, name: 'Cancun', country: 'Mexico', description: 'Caribbean coast fun.', highlights: 'Beaches, Cenotes, Chichen Itza', estimatedCost: 2200, bestTime: 'December-April', tripType: 'party', terrain: 'beach' },

    // City / Cultural
    { id: 313, name: 'Paris', country: 'France', description: 'City of Love.', highlights: 'Eiffel Tower, Louvre, Montmartre', estimatedCost: 3200, bestTime: 'April-June', tripType: 'romantic', terrain: 'city' },
    { id: 314, name: 'London', country: 'United Kingdom', description: 'History meets modern.', highlights: 'Big Ben, British Museum, Soho', estimatedCost: 3000, bestTime: 'May-September', tripType: 'cultural', terrain: 'city' },
    { id: 315, name: 'New York', country: 'USA', description: 'The Big Apple.', highlights: 'Times Square, Central Park, Broadway', estimatedCost: 3500, bestTime: 'September-November', tripType: 'adventure', terrain: 'city' },
    { id: 316, name: 'Istanbul', country: 'Turkey', description: 'Where East meets West.', highlights: 'Hagia Sophia, Blue Mosque, Grand Bazaar', estimatedCost: 1800, bestTime: 'April-May', tripType: 'cultural', terrain: 'city' },
];

// Function to get random destinations based on preferences
export function getFilteredDestinations(preferences, userCountry = 'India', count = 3) {
    let filtered = [...allDestinations];
    const nearbyCountries = ['Nepal', 'Bhutan', 'Sri Lanka', 'Maldives', 'Thailand', 'Singapore', 'UAE', 'United Arab Emirates', 'Vietnam', 'Malaysia', 'Indonesia', 'Oman', 'Cambodia', 'Laos', 'Myanmar'];

    // 1. Location Filter
    if (preferences.locationPref === 'domestic') {
        filtered = filtered.filter(d => d.country === userCountry);
    } else if (preferences.locationPref === 'nearby') {
        filtered = filtered.filter(d => nearbyCountries.includes(d.country) && d.country !== userCountry);
    } else if (preferences.locationPref === 'international') {
        filtered = filtered.filter(d => d.country !== userCountry && !nearbyCountries.includes(d.country));
    }

    // 2. Trip Type Filter
    if (preferences.tripType) {
        filtered = filtered.filter(d => d.tripType === preferences.tripType);
    }

    // 3. Terrain Filter (Relax? check if preferences has 'terrain' or 'tripType' covers it?)
    // The UI has "Preferred terrain?" so we check that.
    if (preferences.terrain) {
        filtered = filtered.filter(d => d.terrain === preferences.terrain);
    }

    // 4. Budget Filter
    if (preferences.budget === 'budget') { // Under 50k INR (~600 USD)
        filtered = filtered.filter(d => d.estimatedCost < 800);
    } else if (preferences.budget === 'moderate') { // 50k - 1.5L (~600 - 1800 USD)
        filtered = filtered.filter(d => d.estimatedCost >= 800 && d.estimatedCost <= 2000);
    } else if (preferences.budget === 'luxury') { // 1.5L+ (> 1800 USD)
        filtered = filtered.filter(d => d.estimatedCost > 2000);
    }

    // Fallback logic if too strict
    if (filtered.length === 0) {
        // Relax terrain first
        filtered = [...allDestinations];
        if (preferences.locationPref === 'domestic') filtered = filtered.filter(d => d.country === userCountry);
        else if (preferences.locationPref === 'nearby') filtered = filtered.filter(d => nearbyCountries.includes(d.country));

        // Try match at least Trip Type
        if (preferences.tripType) filtered = filtered.filter(d => d.tripType === preferences.tripType);
    }

    // Shuffle and pick random
    filtered = filtered.sort(() => Math.random() - 0.5);

    // Return requested count
    return filtered.slice(0, count).map(d => ({
        ...d,
        image: `https://loremflickr.com/600/800/${d.name.replace(/ /g, ',')},travel,landmark/all`,
        packages: [
            { name: 'Standard', price: Math.round(d.estimatedCost * 0.8), duration: 5, includes: 'Flights, 3★ Hotel, Breakfast' },
            { name: 'Premium', price: d.estimatedCost, duration: 7, includes: 'Direct Flights, 4★ Hotel, Tours' },
            { name: 'Luxury', price: Math.round(d.estimatedCost * 1.5), duration: 10, includes: 'Business Class, 5★ Resort, All Inclusive' }
        ],
        itinerary: [
            `Day 1: Arrival in ${d.name}. Transfer to hotel. Evening leisure.`,
            `Day 2: Full day sightseeing: ${d.highlights.split(',')[0]} and surrounds.`,
            `Day 3: Cultural immersion or adventure activity: ${d.highlights.split(',')[1]}.`,
            `Day 4: Free time for shopping or relaxation at ${d.highlights.split(',')[2] || 'local markets'}.`,
            `Day 5: Airport transfer and departure.`
        ],
        costBreakdown: {
            flights: Math.round(d.estimatedCost * 0.40),
            accommodation: Math.round(d.estimatedCost * 0.30),
            food: Math.round(d.estimatedCost * 0.20),
            activities: Math.round(d.estimatedCost * 0.10)
        }
    }));
}
