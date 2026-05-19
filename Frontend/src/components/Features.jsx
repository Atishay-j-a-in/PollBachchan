const Features = ({ items }) => (
  <section id="features" className="flex flex-col gap-6" aria-labelledby="features-title">
    <div>
      <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
        Features
      </p>
      <h2
        id="features-title"
        className="mt-2 font-heading text-[clamp(28px,3vw,38px)] tracking-[0.6px]"
      >
        Run polls that feel alive
      </h2>
    </div>
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((feature) => (
        <article
          className="flex min-h-[180px] flex-col gap-3 rounded-[20px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
          key={feature.title}
        >
          <h3 className="font-heading text-[22px]">{feature.title}</h3>
          <p className="text-[#a9a9a9]">{feature.description}</p>
        </article>
      ))}
    </div>
  </section>
)

export default Features
