export const TourOverview = ({
  title,
  dates,
  description,
}: {
  title: string
  dates: { start: string; end: string }
  description: string
}) => {
  const formattedRange = formatDateRange(dates.start, dates.end)
  const dayCount = calculateTripLength(dates.start, dates.end)

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-200">
      <div className="text-center space-y-4">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
          {title}
        </h1>

        {/* Date and Duration Info */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600">
          <div className="inline-flex items-center bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-full px-5 py-2 shadow-sm">
            <svg
              className="w-5 h-5 text-sky-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">{formattedRange}</span>
          </div>

          <span className="text-slate-400 font-bold">•</span>

          <div className="inline-flex items-center bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-full px-5 py-2 shadow-sm">
            <svg
              className="w-5 h-5 text-amber-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              {dayCount} day{dayCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="pt-4">
          <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">{description}</p>
        </div>
      </div>
    </section>
  )
}

function formatDateRange(start: string, end: string) {
  return `${new Date(start + 'T00:00:00').toLocaleDateString()} - ${new Date(end + 'T00:00:00').toLocaleDateString()}`
}

function calculateTripLength(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}
