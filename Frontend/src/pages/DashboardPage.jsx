import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PollList from '../components/dashboard/PollList'
import Toast from '../components/Toast'
import { initialPolls } from '../data/dashboardData'
import * as pollApi from '../api/pollApi'
import { buildPollShareUrl } from '../utils/pollLinks'

const DashboardPage = () => {
  const [polls, setPolls] = useState(initialPolls)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let active = true

    const loadPolls = async () => {
      try {
        setError('')
        const data = await pollApi.getAllPolls()
        const pollsList = data?.polls ?? []
        const pollsWithCounts = await Promise.all(
          pollsList.map(async (poll) => {
            try {
              const respondents = await pollApi.getParticipants(poll.id)
              return { ...poll, respondents }
            } catch (err) {
              return { ...poll, respondents: poll.respondents ?? 0 }
            }
          }),
        )
        if (active) {
          setPolls(pollsWithCounts)
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load polls.')
          setPolls(initialPolls)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPolls()

    return () => {
      active = false
    }
  }, [])

  const handleCopy = async (poll) => {
    try {
      const link = buildPollShareUrl(poll)
      await navigator.clipboard.writeText(link)
      setToast({ message: 'Link copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error('Failed to copy link', error)
      setToast({ message: 'Failed to copy link', type: 'error' })
    }
  }

  const handleDelete = (pollId) => {
    setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId))
    setToast({ message: 'Poll deleted successfully!', type: 'success' })
  }

  const closeToast = () => {
    setToast(null)
  }

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-8">
        <DashboardHeader />
        
        {!loading && polls.length === 0 ? (
          <div className="rounded-[20px] border border-[#1b1b1b] bg-[#0d0d0d] px-6 py-5 text-[14px] text-[#a9a9a9]">
            <p>No polls yet.</p>
            <Link className="mt-2 inline-block text-white underline" to="/create">
              Click to create a poll now
            </Link>
          </div>
        ) : null}
        <PollList polls={polls} onCopy={handleCopy} onDelete={handleDelete} />
      </main>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast}
        />
      )}
    </div>
  )
}

export default DashboardPage
