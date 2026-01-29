import { useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Globe, ChevronDown, X, Search } from 'lucide-react'
import { locationState, currencies, setCurrency, closeLocationPrompt, openLocationPrompt, setLocation, fetchStates, fetchCities } from '../store/location'
import { useState, useEffect } from 'react'

export function LocationPrompt() {
    const snap = useSnapshot(locationState)
    const { loading, city, state, country, currency, showPrompt, countryCode, countries, states, cities, loadingStates, loadingCities } = snap
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

    // Selection state
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)

    // Dropdown visibility
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [showStateDropdown, setShowStateDropdown] = useState(false)
    const [showCityDropdown, setShowCityDropdown] = useState(false)

    // Search filters
    const [countrySearch, setCountrySearch] = useState('')
    const [stateSearch, setStateSearch] = useState('')
    const [citySearch, setCitySearch] = useState('')

    // Initialize with detected location
    useEffect(() => {
        if (country && !selectedCountry) {
            const found = countries.find(c => c.name === country || c.code === countryCode)
            if (found) {
                setSelectedCountry(found)
                // Trigger state fetch if country found
                fetchStates(found.name)
            }
        }
    }, [country, countryCode, countries, selectedCountry])

    // Auto-fill state
    useEffect(() => {
        if (state && !selectedState && states.length > 0) {
            // Fuzzy match state
            const found = states.find(s => s.toLowerCase() === state.toLowerCase())
            if (found) {
                setSelectedState(found)
                if (selectedCountry) {
                    fetchCities(selectedCountry.name, found)
                }
            }
        }
    }, [state, states, selectedState, selectedCountry])

    // Auto-fill city
    useEffect(() => {
        if (city && !selectedCity && cities.length > 0) {
            // Fuzzy match city
            const found = cities.find(c => c.toLowerCase() === city.toLowerCase())
            if (found) {
                setSelectedCity(found)
            }
        }
    }, [city, cities, selectedCity])

    if (!showPrompt) return null

    const handleCountrySelect = (c) => {
        setSelectedCountry(c)
        setSelectedState(null)
        setSelectedCity(null)
        setShowCountryDropdown(false)
        setCountrySearch('')
        fetchStates(c.name)
    }

    const handleStateSelect = (stateName) => {
        setSelectedState(stateName)
        setSelectedCity(null)
        setShowStateDropdown(false)
        setStateSearch('')
        if (selectedCountry) {
            fetchCities(selectedCountry.name, stateName)
        }
    }

    const handleCitySelect = (cityName) => {
        setSelectedCity(cityName)
        setShowCityDropdown(false)
        setCitySearch('')
    }

    const handleConfirm = () => {
        if (selectedCountry) {
            setLocation(
                selectedCity || city,
                selectedState || state,
                selectedCountry.name,
                selectedCountry.code
            )
        }
        closeLocationPrompt()
    }

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
    )

    const filteredStates = states.filter(s =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
    )

    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    )

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-md m-4 bg-black border border-white/20 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                >
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"
                            />
                            <p className="text-white/60">Detecting your location...</p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between mb-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/10">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Set Your Location</h2>
                                        <p className="text-sm text-white/50">Select country & currency</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeLocationPrompt}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/50" />
                                </motion.button>
                            </motion.div>

                            {/* Current Location Display */}
                            {city && country && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4"
                                >
                                    <div className="flex items-center gap-2 text-white/70 text-sm">
                                        <Globe className="w-4 h-4" />
                                        <span>Detected: {city}{state ? `, ${state}` : ''}, {country}</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Country Selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="relative mb-3"
                            >
                                <label className="text-xs text-white/40 block mb-1.5">Country</label>
                                <button
                                    onClick={() => {
                                        setShowCountryDropdown(!showCountryDropdown)
                                        setShowStateDropdown(false)
                                        setShowCityDropdown(false)
                                    }}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors text-left"
                                >
                                    <span className={selectedCountry ? 'text-white' : 'text-white/40'}>
                                        {selectedCountry?.name || 'Select country'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCountryDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-xl overflow-hidden z-20 max-h-48"
                                        >
                                            <div className="p-2 border-b border-white/10">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="text"
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        placeholder="Search countries..."
                                                        className="w-full bg-white/5 rounded-lg py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto max-h-36">
                                                {filteredCountries.map((c, i) => (
                                                    <motion.button
                                                        key={c.code}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.02 }}
                                                        onClick={() => handleCountrySelect(c)}
                                                        className={`w-full p-2.5 text-left text-sm hover:bg-white/10 transition-colors ${selectedCountry?.code === c.code ? 'bg-white/10 text-white' : 'text-white/80'}`}
                                                    >
                                                        {c.name}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* State Selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative mb-3"
                            >
                                <label className="text-xs text-white/40 block mb-1.5">State / Region</label>
                                <button
                                    onClick={() => {
                                        if (selectedCountry && states.length > 0) {
                                            setShowStateDropdown(!showStateDropdown)
                                            setShowCountryDropdown(false)
                                            setShowCityDropdown(false)
                                        }
                                    }}
                                    disabled={!selectedCountry || loadingStates}
                                    className={`w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between transition-colors text-left ${selectedCountry ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <span className={selectedState ? 'text-white' : 'text-white/40'}>
                                        {selectedState || (states.length === 0 && selectedCountry ? 'No states available' : 'Select state')}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showStateDropdown && states.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-xl overflow-hidden z-20 max-h-48"
                                        >
                                            <div className="p-2 border-b border-white/10">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="text"
                                                        value={stateSearch}
                                                        onChange={(e) => setStateSearch(e.target.value)}
                                                        placeholder="Search states..."
                                                        className="w-full bg-white/5 rounded-lg py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto max-h-36">
                                                {filteredStates.map((s, i) => (
                                                    <motion.button
                                                        key={s}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.02 }}
                                                        onClick={() => handleStateSelect(s)}
                                                        className={`w-full p-2.5 text-left text-sm hover:bg-white/10 transition-colors ${selectedState === s ? 'bg-white/10 text-white' : 'text-white/80'}`}
                                                    >
                                                        {s}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* City Selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="relative mb-4"
                            >
                                <label className="text-xs text-white/40 block mb-1.5">City</label>
                                <button
                                    onClick={() => {
                                        if (selectedState && cities.length > 0) {
                                            setShowCityDropdown(!showCityDropdown)
                                            setShowCountryDropdown(false)
                                            setShowStateDropdown(false)
                                        }
                                    }}
                                    disabled={!selectedState || loadingCities}
                                    className={`w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between transition-colors text-left ${selectedState ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <span className={selectedCity ? 'text-white' : 'text-white/40'}>
                                        {selectedCity || (cities.length === 0 && selectedState ? 'No cities available' : 'Select city')}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCityDropdown && cities.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-xl overflow-hidden z-20 max-h-48"
                                        >
                                            <div className="p-2 border-b border-white/10">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input
                                                        type="text"
                                                        value={citySearch}
                                                        onChange={(e) => setCitySearch(e.target.value)}
                                                        placeholder="Search cities..."
                                                        className="w-full bg-white/5 rounded-lg py-2 pl-8 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto max-h-36">
                                                {filteredCities.map((c, i) => (
                                                    <motion.button
                                                        key={c}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.02 }}
                                                        onClick={() => handleCitySelect(c)}
                                                        className={`w-full p-2.5 text-left text-sm hover:bg-white/10 transition-colors ${selectedCity === c ? 'bg-white/10 text-white' : 'text-white/80'}`}
                                                    >
                                                        {c}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Currency Selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative mb-5"
                            >
                                <label className="text-xs text-white/40 block mb-1.5">Display Currency</label>
                                <button
                                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg text-white">{currencies[currency].symbol}</span>
                                        <span className="text-white">{currencies[currency].name}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCurrencyDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-xl overflow-hidden z-10 max-h-48 overflow-y-auto"
                                        >
                                            {Object.entries(currencies).map(([code, data], i) => (
                                                <motion.button
                                                    key={code}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: i * 0.02 }}
                                                    onClick={() => {
                                                        setCurrency(code)
                                                        setShowCurrencyDropdown(false)
                                                    }}
                                                    className={`w-full p-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors ${currency === code ? 'bg-white/10' : ''}`}
                                                >
                                                    <span className="text-base w-6 text-white">{data.symbol}</span>
                                                    <span className="text-white text-sm">{data.name}</span>
                                                    <span className="text-white/30 text-xs ml-auto">{code}</span>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Confirm Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all"
                            >
                                Confirm Location
                            </motion.button>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xs text-white/30 text-center mt-3"
                            >
                                Prices will be shown in {currencies[currency].name}
                            </motion.p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Currency selector for header/nav
export function CurrencySelector() {
    const { currency, city, country } = useSnapshot(locationState)
    const [open, setOpen] = useState(false)

    const handleLocationClick = () => {
        openLocationPrompt()
    }

    return (
        <div className="flex items-center gap-2">
            {/* Location Badge - clickable to change location */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLocationClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                title="Change location"
            >
                <MapPin className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
                <span className="text-white/80 text-sm group-hover:text-white">{city || 'Set Location'}</span>
            </motion.button>

            {/* Currency Selector */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                    <span className="text-white font-medium">{currencies[currency].symbol}</span>
                    <span className="text-white/70 text-sm">{currency}</span>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-2 w-52 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto shadow-2xl"
                        >
                            {Object.entries(currencies).map(([code, data], i) => (
                                <motion.button
                                    key={code}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    onClick={() => {
                                        setCurrency(code)
                                        setOpen(false)
                                    }}
                                    className={`w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left ${currency === code ? 'bg-white/10' : ''}`}
                                >
                                    <span className="w-6 text-white font-medium">{data.symbol}</span>
                                    <span className="text-white text-sm">{data.name}</span>
                                    <span className="text-white/30 text-xs ml-auto">{code}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
