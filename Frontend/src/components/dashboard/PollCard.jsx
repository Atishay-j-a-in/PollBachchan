import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import * as pollApi from '../../api/pollApi'

const PollCard = ({ poll, onCopy, onDelete }) => {
  const navigate = useNavigate()
  const [isPublished, setIsPublished] = useState(poll?.isResultPublished ?? false)
  const [isLoading, setIsLoading] = useState(false)

  const handleTogglePublish = async () => {
    try {
      setIsLoading(true)
      const newState = !isPublished
      await pollApi.publishResults(poll.id, newState)
      setIsPublished(newState)
    } catch (error) {
      console.error('Failed to toggle publish:', error)
      alert('Failed to update result visibility')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      await pollApi.deletePoll(poll.id)
      if (onDelete) {
        onDelete(poll.id)
      }
    } catch (error) {
      console.error('Failed to delete poll:', error)
      alert('Failed to delete poll')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-full border border-[#1b1b1b] bg-[#0d0d0d] px-6 py-5 shadow-[0_18px_36px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-[20px] tracking-[0.4px]">
          {poll.title}
        </h2>
        <p className="text-[13px] uppercase tracking-[1.4px] text-[#a9a9a9]">
          {(poll.respondents ?? 0).toLocaleString()} respondents
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1b1b1b] text-white transition hover:-translate-y-0.5 hover:border-white"
          type="button"
          aria-label="Copy share link"
          title="Copy share link"
          onClick={() => onCopy(poll)}
        >
          <img className="h-5 w-5" src="/copy.png" alt="" />
        </button>
        
        {/* Toggle Switch */}
        <button
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
            isPublished ? 'bg-green-500' : 'bg-[#1b1b1b]'
          }`}
          type="button"
          disabled={isLoading}
          aria-label="Toggle result visibility"
          title={isPublished ? "Hide results" : "Publish results"}
          onClick={handleTogglePublish}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
              isPublished ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,255,255,0.12)]"
          to={`/analytics/${poll.id}`}
          aria-label="View analytics"
          title="View analytics"
        >
          <img className="h-5 w-5" src="/analytics.png" alt="" />
        </Link>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/40 text-red-500 transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500/10"
          type="button"
          disabled={isLoading}
          aria-label="Delete poll"
          title="Delete poll"
          onClick={handleDelete}
        >
          <img className="h-8 w-8 font-extrabold" src="/delete.svg" alt="" />
        </button>
      </div>
    </article>
  )
}

export default PollCard
