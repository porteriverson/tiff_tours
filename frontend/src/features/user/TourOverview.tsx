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
    <section className="pt-8 ">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-500 text-2xl">
        {formattedRange} &nbsp;|&nbsp; {dayCount} day{dayCount > 1 ? 's' : ''}
      </p>
      <p className="mt-4 text-1xl max-w-3x">{description}</p>
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
