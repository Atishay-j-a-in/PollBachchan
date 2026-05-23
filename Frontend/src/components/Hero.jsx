import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dvon4qxbk/video/upload/v1778860110/Animate_logo_with_white_strokes_202605152021_tac8ke.mp4'
const Hero = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/create')
    } else {
      navigate('/login')
    }
  }

  return (
    <section
      className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
      aria-labelledby="hero-title"
    >
      <div className="flex flex-col justify-evenly gap-5 h-full">
        <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
          The democratic pulse of the moment
        </p>
        <h1
          id="hero-title"
          className="font-heading text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.6px]"
        >
          <span className="block leading-[0.95]">The nation wants</span>
          <span className="block leading-[0.95]">to know</span>
        </h1>
        <p className="max-w-[520px] text-[20px] text-[#a9a9a9]">
          So poll right now and bring every voice into the spotlight.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleButtonClick}
            className="rounded-full border border-white bg-white px-10 py-4 text-[16px] uppercase tracking-[1.2px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
            type="button"
          >
            Create Poll
          </button>
        </div>
      </div>
      <div className="order-first flex justify-center lg:order-none">
        <div className="w-full max-w-[520px] aspect-[4/5] rounded-[28px] border border-[#1b1b1b] bg-gradient-to-br from-[#0c0c0c] to-[#141414] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <video
            className="h-full w-full rounded-[20px] bg-black object-cover"
            src={HERO_VIDEO_URL}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={(event) => event.currentTarget.pause()}
          ></video>
        </div>
      </div>
    </section>
  )
}

export default Hero
