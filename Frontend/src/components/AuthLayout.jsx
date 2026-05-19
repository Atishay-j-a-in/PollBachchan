import { Link } from 'react-router-dom'

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-[#050505] px-6 py-10">
    <div className="mx-auto w-full max-w-md">
      <Link
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[2.2px] text-[#a9a9a9]"
        to="/"
      >
        PollBachchan
      </Link>
      <div className="mt-8 rounded-[20px] border border-[#1b1b1b] bg-[#0d0d0d] p-8 shadow-[0_24px_40px_rgba(0,0,0,0.4)]">
        <h1 className="font-heading text-[28px] tracking-[0.6px] text-[#f5f5f5]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] text-[#a9a9a9]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  </div>
)

export default AuthLayout
