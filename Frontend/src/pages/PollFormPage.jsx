import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import * as pollApi from '../api/pollApi'

const PollFormPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pollId = searchParams.get('id')
  const [poll, setPoll] = useState(null)
  const [results, setResults] = useState(null)
  const [answers, setAnswers] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const palette = ['#f5f5f5', '#cfcfcf', '#9a9a9a', '#6f6f6f', '#4a4a4a']

  useEffect(() => {
    const loadPoll = async () => {
      if (!pollId) {
        setStatus({ type: 'error', message: 'Missing poll id.' })
        return
      }
      try {
        const data = await pollApi.getPollForm(pollId)
        console.log('Poll data received:', data)
        
        // Check if we have expired poll with published results
        if (data?.result && data?.poll) {
          console.log('Setting expired poll with results')
          setResults(data.result)
          setPoll(data.poll)
          return
        }
        
        // Check if user already filled the poll
        if (data?.result && !data?.questions) {
          navigate(`/poll/${slug}/results?id=${pollId}`, { replace: true })
          return
        }
        
        setPoll(data?.poll ?? data)
      } catch (error) {
        const message =
          error.response?.data?.message || 'Unable to load this poll.'
        console.log('Error status:', error.response?.status, 'Message:', message)
        
        // Check for forbidden status (expired poll without published results)
        if (error.response?.status === 403) {
          setStatus({ type: 'error', message: 'This poll has expired.' })
          return
        }
        
        if (message.toLowerCase().includes('already filled')) {
          navigate(`/poll/${slug}/thanks?id=${pollId}`, { replace: true })
          return
        }
        if (message.toLowerCase().includes('expired')) {
          setStatus({ type: 'error', message: 'This poll has expired.' })
          return
        }
        setStatus({ type: 'error', message })
      }
    }

    loadPoll()
  }, [pollId, slug, navigate])

  const title = useMemo(() => poll?.title || slug || 'Poll', [poll, slug])

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!poll) return

    const responses = []
    for (const question of poll.questions || []) {
      const selected = answers[question._id]
      if (selected === undefined || selected === null) {
        if (!question.isOptional) {
          setStatus({
            type: 'error',
            message: 'Please answer all required questions.',
          })
          return
        }
      } else {
        responses.push({
          questionId: question._id,
          selectedOption: selected,
        })
      }
    }

    try {
      await pollApi.submitPoll(pollId, responses)
      navigate(`/poll/${slug}/thanks?id=${pollId}`, { replace: true })
    } catch (error) {
      const message =
        error.response?.data?.message || 'Unable to submit this poll.'
      
      // Check for forbidden status (expired poll)
      if (error.response?.status === 403) {
        setStatus({ type: 'error', message: 'This poll has expired.' })
        return
      }
      
      if (message.toLowerCase().includes('already filled')) {
        navigate(`/poll/${slug}/thanks?id=${pollId}`, { replace: true })
        return
      }
      setStatus({ type: 'error', message })
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-8">
        <div>
          <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
            Poll
          </p>
          <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
            {title}
          </h1>
          {poll?.description ? (
            <p className="mt-2 text-[15px] text-[#a9a9a9]">
              {poll.description}
            </p>
          ) : null}
        </div>

        {/* Show results if poll is expired but results are published */}
        {results && poll ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-[20px] border border-blue-500/40 bg-blue-500/10 px-6 py-5 text-[14px] text-blue-300">
              This poll has ended. Here are the results:
            </div>
            {poll.questions?.map((question, questionIndex) => {
              const questionId = question._id?.toString() || question._id
              const voteData = results[questionId]
              
              if (!voteData || Object.keys(voteData).length === 0) {
                return (
                  <section
                    key={questionId}
                    className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
                  >
                    <h2 className="font-heading text-[20px] tracking-[0.4px]">
                      {questionIndex + 1}. {question.content}
                    </h2>
                    <p className="mt-4 text-[14px] text-[#a9a9a9]">No responses yet</p>
                  </section>
                )
              }

              const votes = Object.values(voteData)
              const totalVotes = votes.reduce((a, b) => a + b, 0)

              return (
                <section
                  key={questionId}
                  className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
                >
                  <h2 className="font-heading text-[20px] tracking-[0.4px]">
                    {questionIndex + 1}. {question.content}
                  </h2>
                  <div className="mt-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      {question.options?.map((option, optionIndex) => {
                        const count = voteData[optionIndex] || 0
                        const percentage = totalVotes === 0 ? 0 : Number(((count / totalVotes) * 100).toFixed(2))
                        return (
                          <div key={`${questionId}-${optionIndex}`} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-medium text-[#e5e5e5]">
                                {option}
                              </span>
                              <span className="text-[12px] text-[#a9a9a9]">
                                {count} votes ({percentage}%)
                              </span>
                            </div>
                            <div className="h-8 w-full overflow-hidden rounded-full bg-[#1b1b1b]">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: palette[optionIndex % palette.length],
                                }}
                              >
                                {percentage > 5 && (
                                  <span className="text-[11px] font-semibold text-[#050505]">
                                    {percentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-[16px] bg-[#050505] p-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[1px] text-[#a9a9a9]">Total Votes</p>
                        <p className="mt-1 text-[18px] font-semibold text-white">{totalVotes}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[1px] text-[#a9a9a9]">Top Response</p>
                        <p className="mt-1 text-[18px] font-semibold text-white">
                          {Math.max(...question.options.map((_, idx) => voteData[idx] ? ((voteData[idx] / totalVotes) * 100).toFixed(2) : 0))}%
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        ) : status.type === 'error' ? (
          <div className="rounded-[20px] border border-red-500/40 bg-red-500/10 px-6 py-5 text-[14px] text-red-300">
            {status.message}
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {poll?.questions?.map((question, index) => (
              <div
                key={question._id}
                className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-[20px] tracking-[0.4px]">
                      {index + 1}. {question.content}
                    </h2>
                    {question.isOptional ? (
                      <span className="rounded-full border border-[#1b1b1b] px-3 py-1 text-[11px] uppercase tracking-[1.2px] text-[#a9a9a9]">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={`${question._id}-${optionIndex}`}
                        className="flex items-center gap-3 rounded-full border border-[#1b1b1b] px-5 py-3 text-[14px] text-white transition hover:border-white"
                      >
                        <input
                          className="h-4 w-4 accent-white"
                          type="radio"
                          name={`question-${question._id}`}
                          checked={answers[question._id] === optionIndex}
                          onChange={() =>
                            handleSelect(question._id, optionIndex)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {status.message ? (
              <p
                className={`text-[14px] ${
                  status.type === 'error' ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {status.message}
              </p>
            ) : null}

            <button
              className="self-start rounded-full border border-white bg-white px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
              type="submit"
              disabled={!poll}
            >
              Submit responses
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default PollFormPage
