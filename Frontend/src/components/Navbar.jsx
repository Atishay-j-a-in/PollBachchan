import { Link, useNavigate } from 'react-router-dom'
import logo from '/logo.png'
import useAuth from '../hooks/useAuth'

const Navbar = ({ showAuthActions = true, showLogout = false }) => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <Link className="flex items-center gap-3" to="/">
      <img
        className="h-20 w-20 rounded-[18px] border border-[#1b1b1b] bg-[radial-gradient(circle_at_30%_20%,#2a2a2a_0%,#0d0d0d_65%)] object-cover shadow-[0_10px_20px_rgba(0,0,0,0.45),0_0_0_1px_#000]"
        src={logo}
        alt="PollBachchan logo"
      />
      <div>
        <p className="font-heading text-xl uppercase tracking-[1px]">
          PollBachchan
        </p>
        <p className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]">
          Polls with a punch
        </p>
      </div>
    </Link>
    {showAuthActions ? (
      <nav className="flex items-center gap-4">
        <Link
          className="rounded-full border border-[#1b1b1b] px-6 py-3 text-[14px] uppercase tracking-[1px] text-white transition hover:-translate-y-0.5 hover:border-white"
          to="/login"
        >
          Login
        </Link>
        {!isAuthenticated && (
          <Link
            className="rounded-full border border-white bg-white px-8 py-4 text-[15px] uppercase tracking-[1px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,255,255,0.12)]"
            to="/create"
          >
            Create Poll
          </Link>
        )}
      </nav>
    ) : null}
    {showLogout && isAuthenticated && (
      <button
        onClick={handleLogout}
        className="rounded-full border border-[#a9a9a9] px-6 py-3 text-[14px] uppercase tracking-[1px] text-[#a9a9a9] transition hover:-translate-y-0.5 hover:border-white hover:text-white"
      >
        Logout
      </button>
    )}
    </header>
  )
}

export default Navbar
