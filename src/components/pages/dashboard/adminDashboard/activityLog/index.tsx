import PageHeader from '@/components/molecules/PageHeader'
import Activities from './Activities'

export default function ActivityLogPage() {
    return (
        <section className="activity__log__root">
            <PageHeader title='Activity Log' />
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, index) => (
                    <ActivityAnalyticCard key={index.toString()} />
                ))}
            </div> */}
            <div className="section-title mb-4">
                <h2 className="text-[20px] leading-[140%] font-[600]">
                    All Activities
                </h2>
            </div>
            <Activities />
        </section>
    )
}
