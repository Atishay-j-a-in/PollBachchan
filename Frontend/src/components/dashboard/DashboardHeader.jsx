import { Link } from 'react-router-dom'

const DashboardHeader = () => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
        Dashboard
      </p>
      <h1 className="mt-2 font-heading text-[clamp(32px,4vw,48px)] tracking-[0.6px]">
        Your polls
      </h1>
      <p className="mt-2 text-[15px] text-[#a9a9a9]">
        Track your active polls and keep insights close.
      </p>
    </div>
    <Link
      className="inline-flex items-center justify-center rounded-full border border-white bg-white px-6 py-3 text-[13px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
      to="/create"
    >
      Create Poll
    </Link>
  </div>
)

export default DashboardHeader
