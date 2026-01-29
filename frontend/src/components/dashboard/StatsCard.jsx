import { Card, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    className
}) {
    return (
        <Card className={cn(
            'bg-[#111] border-white/5 transition-all duration-300',
            'hover:border-white/10 hover:bg-[#151515] hover:scale-[1.02]',
            'cursor-default group',
            className
        )}>
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-2">
                        {title}
                    </h3>
                    <div className="text-3xl font-bold text-white mb-2">
                        {value}
                    </div>
                    {trend && (
                        <div className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full w-fit",
                            trend.positive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                        )}>
                            {trend.value}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default StatsCard

