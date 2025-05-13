import React, { useState, useEffect } from 'react'
import { useVotingContract } from '../../hooks/useVotingContract'
import { usePublicClient } from 'wagmi'

export default function VotingPage() {
  const contract = useVotingContract()
  const publicClient = usePublicClient()

  const [proposals, setProposals] = useState<{ name: string; voteCount: bigint }[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // 获取候选人及投票数据
  useEffect(() => {
    if (!contract) return

    const fetchProposals = async () => {
      const data = await contract.read.getProposals()
      setProposals(data)
    }

    fetchProposals()
  }, [contract])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleVote = async () => {
    try {
      if (contract && selectedIndex !== null && publicClient) {
        setLoading(true)
        const tx = await contract.write.vote([selectedIndex])
        console.log('Transaction sent:', tx)
        showToast('Transaction submitted, waiting for confirmation...')

        // 等待交易回执
        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
        console.log('Transaction receipt:', receipt)

        if (receipt.status === 'success') {
          console.log('✅ Vote successful')
          const updated = await contract.read.getProposals()
          setProposals(updated)
        } else {
          console.warn('⚠️ Transaction reverted')
          showToast('Vote failed: Transaction was reverted. You may have already voted.')
        }
      }
    } catch (error: any) {
      console.error('❌ Error occurred during voting:', error)

      if (error?.message?.includes('User denied transaction signature') || error?.message?.includes('User rejected the request')) {
        showToast('Transaction was cancelled: You rejected the request.')
      } else {
        showToast('Vote submission failed: Please check your network or wallet status.')
      }
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="flex justify-center items-center min-h-screen bg-white text-neutral-900">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Voting</h1>

      {proposals.length === 0 ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <span className="spinner" />
        </div>
      ) : (
        <ul className="space-y-4 mb-12">
          {proposals.map((p, index) => {
            const totalVotes = proposals.reduce((sum, item) => sum + Number(item.voteCount), 0)
            const percent = totalVotes > 0 ? (Number(p.voteCount) / totalVotes) * 100 : 0

            return (
              <li key={index}>
                <label className="block cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="candidate"
                        value={index}
                        checked={selectedIndex === index}
                        onChange={() => setSelectedIndex(index)}
                        className="accent-blue-600"
                      />
                      <span className="font-semibold">{p.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{p.voteCount.toString()} votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleVote}
          disabled={selectedIndex === null || loading}
          className={`min-w-[100px] h-10 px-4 rounded-md text-white font-semibold flex items-center justify-center transition 
            ${selectedIndex === null || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {loading ? <span className="spinner" /> : 'Vote'}
        </button>
      </div>

      {toast && (
        <div className="fixed top-5 right-5 bg-neutral-800 text-white px-5 py-3 rounded-lg shadow-md animate-fadeInOut z-50">
          {toast}
        </div>
      )}

      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        .animate-fadeInOut {
          animation: fadeInOut 3s ease forwards;
        }
      `}</style>
    </div>
  </div>
)

}
