import { Link, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const PollThankYouPage = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const pollId = searchParams.get('id')
  const showResults = searchParams.get('results') === 'true'

  return (
    <div className="min-h-screen bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20">
      <Navbar showAuthActions={false} />
      <main className="mt-12 flex flex-col gap-6">
        <div>
          <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
            Thank you
          </p>
          <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
            Your response is recorded
          </h1>
          <p className="mt-2 text-[15px] text-[#a9a9a9]">
            We appreciate you sharing your voice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {pollId && showResults ? (
            <Link
              className="rounded-full border border-white bg-white px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
              to={`/poll/${slug}/results?id=${pollId}`}
            >
              View results
            </Link>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default PollThankYouPage
