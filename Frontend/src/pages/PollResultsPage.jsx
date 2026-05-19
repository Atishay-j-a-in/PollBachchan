import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import * as pollApi from '../api/pollApi'

const PollResultsPage = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const pollId = searchParams.get('id')
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const palette = ['#f5f5f5', '#cfcfcf', '#9a9a9a', '#6f6f6f', '#4a4a4a']

  const title = useMemo(() => {
    if (!slug) return 'Poll results'
    return slug.replace(/-/g, ' ')
  }, [slug])

  useEffect(() => {
    let active = true

    const loadResults = async () => {
      if (!pollId) {
        setError('Missing poll id.')
        setLoading(false)
        return
      }
      try {
        setError('')
        const data = await pollApi.getAnalytics(pollId)
        if (active) {
          setAnalytics(data)
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load results.')
          setAnalytics(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadResults()

    return () => {
      active = false
    }
  }, [pollId])

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-8">
        <div>
          <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
            Results
          </p>
          <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
            {title}
          </h1>
          {analytics?.totalParticipants !== undefined ? (
            <p className="mt-2 text-[14px] text-[#a9a9a9]">
              {analytics.totalParticipants} total participants
            </p>
          ) : null}
        </div>

        {error ? <p className="text-[14px] text-red-300">{error}</p> : null}
        {loading ? (
          <p className="text-[14px] text-[#a9a9a9]">Loading results...</p>
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
              <div className="mt-4 flex flex-col gap-4">
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#1b1b1b]">
                  <div className="flex h-full w-full">
                    {question.results.map((result, resultIndex) => (
                      <div
                        key={`${question.questionId}-bar-${result.optionIndex}`}
                        className="h-full"
                        style={{
                          width: `${result.percentage}%`,
                          backgroundColor:
                            palette[resultIndex % palette.length],
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 text-[12px] text-[#a9a9a9]">
                  {question.results.map((result, resultIndex) => (
                    <div
                      key={`${question.questionId}-${result.optionIndex}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              palette[resultIndex % palette.length],
                          }}
                        ></span>
                        <span className="text-[13px] text-[#e5e5e5]">
                          {result.optionText}
                        </span>
                      </div>
                      <span>
                        {result.percentage}% · {result.count} votes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

export default PollResultsPage
