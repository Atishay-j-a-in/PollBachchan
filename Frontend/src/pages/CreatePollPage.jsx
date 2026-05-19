import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import DateTimePicker from '../components/DateTimePicker'
import * as pollApi from '../api/pollApi'

const createQuestion = () => ({
  id: crypto.randomUUID(),
  text: '',
  optional: false,
  options: [''],
})

const CreatePollPage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const [expiryTime, setExpiryTime] = useState('')
  const [questions, setQuestions] = useState([createQuestion()])
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  // Initialize with current date and time
  useEffect(() => {
    const now = new Date()
    const dateISO = now.toISOString().split('T')[0]
    const timeISO = now.toTimeString().slice(0, 5)
    setExpiryDate(dateISO)
    setExpiryTime(timeISO)
  }, [])

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()])
  }

  const handleQuestionText = (id, value) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, text: value } : question,
      ),
    )
  }

  const handleQuestionOptional = (id, value) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, optional: value } : question,
      ),
    )
  }

  const handleAddOption = (id) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? { ...question, options: [...question.options, ''] }
          : question,
      ),
    )
  }

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question
        const nextOptions = question.options.map((option, index) =>
          index === optionIndex ? value : option,
        )
        return { ...question, options: nextOptions }
      }),
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const mappedQuestions = questions.map((question) => ({
      content: question.text.trim(),
      options: question.options.map((option) => option.trim()).filter(Boolean),
      isOptional: question.optional,
    }))

    const hasInvalidQuestion = mappedQuestions.some(
      (question) => question.content.length === 0 || question.options.length < 2,
    )

    if (hasInvalidQuestion) {
      setStatus({
        type: 'error',
        message: 'Each question needs text and at least 2 options.',
      })
      return
    }

    // Combine date and time
    if (!expiryDate || !expiryTime) {
      setStatus({ type: 'error', message: 'Please set a valid expiry date and time.' })
      return
    }

    const expiresAt = new Date(`${expiryDate}T${expiryTime}:00`)
    if (Number.isNaN(expiresAt.getTime())) {
      setStatus({ type: 'error', message: 'Please set a valid expiry time.' })
      return
    }

    const payload = {
      title,
      description,
      isAnonymous: anonymous,
      expiresAt,
      questions: mappedQuestions,
    }

    try {
      setStatus({ type: 'idle', message: '' })
      await pollApi.createPoll(payload)
      setStatus({ type: 'success', message: 'Poll created successfully.' })
      navigate('/dashboard')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to create poll.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-8">
        <div>
          <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
            Create poll
          </p>
          <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
            Build your next poll
          </h1>
          <p className="mt-2 text-[15px] text-[#a9a9a9]">
            Add questions, options, and publish when ready.
          </p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6">
            <div className="grid gap-5">
              <div>
                <label className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
                  Title
                </label>
                <input
                  className="mt-2 w-full rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Poll title"
                  required
                />
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
                  Description
                </label>
                <textarea
                  className="mt-2 min-h-[120px] w-full rounded-[20px] border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what this poll is about"
                  rows={4}
                ></textarea>
              </div>
              <label className="flex items-center gap-3 text-[14px] text-white">
                <input
                  className="h-4 w-4 accent-white"
                  type="checkbox"
                  checked={anonymous}
                  onChange={(event) => setAnonymous(event.target.checked)}
                />
                Anonymous responses
              </label>
              <div>
                <label className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
                  Expiry Date & Time
                </label>
                <div className="mt-2">
                  <DateTimePicker
                    date={expiryDate}
                    time={expiryTime}
                    onDateChange={setExpiryDate}
                    onTimeChange={setExpiryTime}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-[24px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="font-heading text-[20px] tracking-[0.4px]">
                      Question {index + 1}
                    </h2>
                    <label className="flex items-center gap-3 text-[13px] text-[#a9a9a9]">
                      <input
                        className="h-4 w-4 accent-white"
                        type="checkbox"
                        checked={question.optional}
                        onChange={(event) =>
                          handleQuestionOptional(question.id, event.target.checked)
                        }
                      />
                      Optional question
                    </label>
                  </div>
                  <input
                    className="w-full rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                    type="text"
                    placeholder="Ask your question"
                    value={question.text}
                    onChange={(event) =>
                      handleQuestionText(question.id, event.target.value)
                    }
                    required={!question.optional}
                  />
                  <div className="flex flex-col gap-3">
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={`${question.id}-option-${optionIndex}`}
                        className="w-full rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(
                            question.id,
                            optionIndex,
                            event.target.value,
                          )
                        }
                        required={!question.optional}
                      />
                    ))}
                    <button
                      className="self-start rounded-full border border-[#1b1b1b] px-5 py-2 text-[12px] uppercase tracking-[1.2px] text-white transition hover:-translate-y-0.5 hover:border-white"
                      type="button"
                      onClick={() => handleAddOption(question.id)}
                    >
                      Add option
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {status.message ? (
            <p
              className={`text-[14px] ${
                status.type === 'error' ? 'text-red-300' : 'text-green-300'
              }`}
            >
              {status.message}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="rounded-full border border-[#1b1b1b] px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-white transition hover:-translate-y-0.5 hover:border-white"
              type="button"
              onClick={handleAddQuestion}
            >
              Add question
            </button>
            <button
              className="rounded-full border border-white bg-white px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
              type="submit"
            >
              Publish poll
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreatePollPage
