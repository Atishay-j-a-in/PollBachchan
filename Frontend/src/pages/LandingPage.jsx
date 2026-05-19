import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Reviews from '../components/Reviews'
import { features, reviews } from '../data/landingData'

const LandingPage = () => (
  <div className="relative min-h-screen overflow-hidden bg-[#050505] px-[clamp(20px,5vw,80px)] py-8 pb-20 flex flex-col gap-12 before:content-[''] before:absolute before:rounded-full before:opacity-30 before:blur-[40px] before:w-[480px] before:h-[480px] before:bg-[radial-gradient(circle,#1f1f1f_0%,transparent_65%)] before:-top-[120px] before:-left-[160px] after:content-[''] after:absolute after:rounded-full after:opacity-30 after:blur-[40px] after:w-[540px] after:h-[540px] after:bg-[radial-gradient(circle,#272727_0%,transparent_65%)] after:-bottom-[180px] after:-right-[180px]">
    <Navbar />
    <main className="relative z-10 flex flex-col gap-16">
      <Hero />
      <Features items={features} />
      <Reviews items={reviews} />
    </main>
  </div>
)

export default LandingPage
