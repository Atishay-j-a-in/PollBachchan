import { useMemo } from 'react'

const DateTimePicker = ({ date, time, onDateChange, onTimeChange }) => {
  const todayISO = useMemo(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }, [])

  const currentTimeISO = useMemo(() => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }, [])

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
          Expiry Date
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            className="flex-1 rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            min={todayISO}
            required
          />
          <span className="text-[13px] text-[#a9a9a9]">
            {date ? formatDateDisplay(date) : 'Select date'}
          </span>
        </div>
      </div>

      <div>
        <label className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
          Expiry Time
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            className="flex-1 rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
            type="time"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
            required
          />
          <span className="text-[13px] text-[#a9a9a9]">
            {time || 'Select time'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DateTimePicker
