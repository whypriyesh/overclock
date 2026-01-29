import { Map, Clock, Star, Sparkles } from 'lucide-react'

export function ActivityFeed({ activities = [] }) {
    if (!activities.length) {
        return (
            <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No recent activity</p>
                <p className="text-white/20 text-xs mt-1">Your trip activity will appear here</p>
            </div>
        )
    }

    const icons = {
        'create': Map,
        'update': Clock,
        'review': Star,
    }

    return (
        <div className="space-y-2">
            {activities.map((activity, i) => {
                const Icon = icons[activity.type] || Map
                return (
                    <div
                        key={i}
                        className="flex gap-4 items-start p-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                    >
                        <div className="p-2 rounded-full bg-white/5 border border-white/5 mt-0.5">
                            <Icon className="w-4 h-4 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">
                                <span className="font-medium text-white/80">{activity.user}</span>
                                {' '}{activity.action}{' '}
                                <span className="font-medium text-white">{activity.target}</span>
                            </p>
                            <p className="text-xs text-white/30 mt-1">{activity.time}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ActivityFeed

