import React, { useState, useEffect } from 'react'
import { useVotingContract } from '../../hooks/useVotingContract'

export default function VotingPage() {
  const contract = useVotingContract()

  const [proposals, setProposals] = useState<{ name: string; voteCount: bigint }[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // 获取候选人及投票数据
  useEffect(() => {
    if (!contract) return

    const fetchProposals = async () => {
      const data = await contract.read.getProposals()
      setProposals(data)
    }

    fetchProposals()
  }, [contract])

  // 投票函数
  const handleVote = async () => {
    if (contract && selectedIndex !== null) {
      await contract.write.vote([selectedIndex])

      // 重新获取最新投票数据
      const updated = await contract.read.getProposals()
      setProposals(updated)
    }
  }

  return (
    <div>
      <h1>Voting</h1>

      {proposals.length === 0 ? (
        <p>Loading proposals...</p>
      ) : (
        <ul>
          {proposals.map((p, index) => (
            <li key={index}>
              <label>
                <input
                  type="radio"
                  name="candidate"
                  value={index}
                  checked={selectedIndex === index}
                  onChange={() => setSelectedIndex(index)}
                />
                {p.name} — Votes: {p.voteCount.toString()}
              </label>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleVote} disabled={selectedIndex === null}>
        Vote
      </button>
    </div>
  )
}
