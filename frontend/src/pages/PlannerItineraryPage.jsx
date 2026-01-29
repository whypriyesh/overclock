import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { useEffect } from 'react'
import { ItineraryView } from '../components/ItineraryView'
import { aiPlannerState, goBackToResults } from '../store/aiPlanner'

export function PlannerItineraryPage() {
    const navigate = useNavigate()
    const { itinerary, selectedDestination, itineraryLoading, itineraryError } = useSnapshot(aiPlannerState)

    // Redirect if no itinerary data
    useEffect(() => {
        if (!itinerary && !itineraryLoading && !selectedDestination) {
            navigate('/planner')
        }
    }, [itinerary, itineraryLoading, selectedDestination, navigate])

    const handleBack = () => {
        goBackToResults()
        navigate('/planner/results')
    }

    const handleBook = (data) => {
        navigate('/booking', { state: { bookingData: data } })
    }

    return (
        <div className="pt-20">
            <ItineraryView
                itinerary={itinerary}
                destination={selectedDestination}
                loading={itineraryLoading}
                error={itineraryError}
                onBack={handleBack}
                onBook={handleBook}
            />
        </div>
    )
}

export default PlannerItineraryPage
