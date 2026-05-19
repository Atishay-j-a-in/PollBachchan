import PollCard from './PollCard'

const PollList = ({ polls, onCopy, onDelete }) => (
  <div className="flex flex-col gap-4">
    {polls.map((poll) => (
      <PollCard key={poll.id} poll={poll} onCopy={onCopy} onDelete={onDelete} />
    ))}
  </div>
)

export default PollList
