export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const buildPollShareUrl = (poll) => {
  const origin = window.location.origin
  const slug = slugify(poll.title || 'poll')
  return `${origin}/poll/${slug}?id=${poll.id}`
}
