import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import * as pollApi from '../api/pollApi'

const AnalyticsPage = () => {
  const { id } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [poll, setPoll] = useState(null)
  const [userSummary, setUserSummary] = useState(null)
  const [showUserSummary, setShowUserSummary] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const palette = ['#f5f5f5', '#cfcfcf', '#9a9a9a', '#6f6f6f', '#4a4a4a']

  useEffect(() => {
    let active = true

    const loadAnalytics = async () => {
      try {
        setError('')
        const [analyticsData, pollData] = await Promise.all([
          pollApi.getAnalytics(id),
          pollApi.getPollDetails(id),
        ])
        
        if (active) {
          setAnalytics(analyticsData)
          setPoll(pollData)
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load analytics.')
+          setAnalytics(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      active = false
    }
  }, [id])

  const handleViewUserSummary = async () => {
    try {
      const summary = await pollApi.getUserSummary(id)
      setUserSummary(summary)
      setShowUserSummary(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load user summary.')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-8">
        <div>
          <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
            Analytics
          </p>
          <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
            Poll insights
          </h1>
          <div className="mt-4 flex flex-col gap-4">
            {analytics?.totalParticipants !== undefined ? (
              <p className="text-[14px] text-[#a9a9a9]">
                {analytics.totalParticipants} total participants
              </p>
            ) : null}
            {poll && !poll.isAnonymous && (
              <button
                className="self-start rounded-full border border-white bg-white px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
                type="button"
                onClick={handleViewUserSummary}
              >
                View User Summary
              </button>
            )}
          </div>
        </div>

        {error ? <p className="text-[14px] text-red-300">{error}</p> : null}
        {loading ? (
          <p className="text-[14px] text-[#a9a9a9]">Loading analytics...</p>
        ) : null}

        <div className="flex flex-col gap-6">
          {analytics?.questions?.map((question, index) => (
            <section
              key={question.questionId}
              className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
            >
              <h2 className="font-heading text-[20px] tracking-[0.4px]">
                {index + 1}. {question.content}
              </h2>
              <div className="mt-6 flex flex-col gap-6">
                {/* Bar Chart Visualization */}
                <div className="flex flex-col gap-4">
                  {question.results.map((result, resultIndex) => (
                    <div key={`${question.questionId}-chart-${result.optionIndex}`} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#e5e5e5]">
                          {result.optionText}
                        </span>
                        <span className="text-[12px] text-[#a9a9a9]">
                          {result.count} votes ({result.percentage}%)
                        </span>
                      </div>
                      <div className="h-8 w-full overflow-hidden rounded-full bg-[#1b1b1b]">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                          style={{
                            width: `${result.percentage}%`,
                            backgroundColor: palette[resultIndex % palette.length],
                          }}
                        >
                          {result.percentage > 5 && (
                            <span className="text-[11px] font-semibold text-[#050505]">
                              {result.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 rounded-[16px] bg-[#050505] p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[1px] text-[#a9a9a9]">Total Votes</p>
                    <p className="mt-1 text-[18px] font-semibold text-white">
                      {question.results.reduce((sum, r) => sum + r.count, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[1px] text-[#a9a9a9]">Top Response</p>
                    <p className="mt-1 text-[18px] font-semibold text-white">
                      {Math.max(...question.results.map(r => r.percentage))}%
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {showUserSummary && userSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-[24px] tracking-[0.4px]">
                  User Summary
                </h2>
                <button
                  className="text-[#a9a9a9] transition hover:text-white"
                  type="button"
                  onClick={() => setShowUserSummary(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {userSummary && Array.isArray(userSummary) ? (
                  userSummary.map((entry, index) => (
                    <div
                      key={index}
                      className="rounded-[16px] border border-[#1b1b1b] bg-[#050505] p-4"
                    >
                      {typeof entry === 'object' ? (
                        <div className="text-[13px] text-[#a9a9a9]">
                          {entry.name && <p><strong>User:</strong> {entry.name}</p>}
                          {entry.responses && (
                            <div>
                              <strong>Responses:</strong>
                              <div className="mt-2 space-y-3">
                                {Array.isArray(entry.responses) 
                                  ? entry.responses.map((r, idx) => (
                                      <pre key={idx} className="whitespace-pre-wrap break-words text-[12px] bg-[#1b1b1b] rounded p-2">
                                        {typeof r === 'object' ? JSON.stringify(r, null, 2) : r}
                                      </pre>
                                    ))
                                  : <pre className="whitespace-pre-wrap break-words text-[12px] bg-[#1b1b1b] rounded p-2">{typeof entry.responses === 'object' ? JSON.stringify(entry.responses, null, 2) : entry.responses}</pre>
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#a9a9a9]">{entry}</p>
                      )}
                    </div>
                  ))
                ) : userSummary ? (
                  <div className="rounded-[16px] border border-[#1b1b1b] bg-[#050505] p-4">
                    <p className="text-[13px] text-[#a9a9a9]">{JSON.stringify(userSummary, null, 2)}</p>
                  </div>
                ) : (
                  <p className="text-[14px] text-[#a9a9a9]">No user summary available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AnalyticsPage
