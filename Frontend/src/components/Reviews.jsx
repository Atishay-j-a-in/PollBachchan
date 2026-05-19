const Reviews = ({ items }) => (
  <section id="reviews" className="flex flex-col gap-6" aria-label="Reviews">
    <div>
      <p className="text-[12px] uppercase tracking-[2.4px] text-[#a9a9a9]">
        Reviews
      </p>
    </div>
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((review) => (
        <article
          className="flex min-h-[180px] flex-col gap-3 rounded-[20px] border border-[#1b1b1b] bg-[#0d0d0d] p-6"
          key={review.name}
        >
          <p className="text-[18px] text-[#f5f5f5]">"{review.quote}"</p>
          <p className="font-heading text-[18px] text-[#f5f5f5]">
            {review.name}
          </p>
          <p className="text-[12px] uppercase tracking-[1.6px] text-[#a9a9a9]">
            {review.role}
          </p>
        </article>
      ))}
    </div>
  </section>
)

export default Reviews
