import React, { useState, useEffect } from 'react'
import { useVotingContract } from '../../hooks/useVotingContract'
import { usePublicClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function VotingPage() {
  const contract = useVotingContract()
  const publicClient = usePublicClient()

  const [proposals, setProposals] = useState<{ name: string; voteCount: bigint }[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Fetch proposals when the contract is available
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

  // Handle vote submission
  const handleVote = async () => {
    try {
      if (contract && selectedIndex !== null && publicClient) {
        setLoading(true)
        const tx = await contract.write.vote([selectedIndex])
        console.log('Transaction sent:', tx)
        showToast('Transaction submitted, waiting for confirmation...')

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
        console.log('Transaction receipt:', receipt)

        if (receipt.status === 'success') {
          console.log('✅ Vote successful')
          setTimeout(async () => {
            showToast('✅ Vote successful')
            const updated = await contract.read.getProposals()
            setProposals(updated)
          }, 2000) // Refresh proposals after 2 seconds
        } else {
          console.warn('⚠️ Transaction reverted')
          showToast('Vote failed: Transaction was reverted. You may have already voted.')
        }
      }
    } catch (error: any) {
      console.error('❌ Error occurred during voting:', error)

      if (error?.message?.includes('User denied transaction signature') || error?.message?.includes('User rejected the request')) {
        showToast('Transaction was cancelled: You rejected the request.')
      } else if (error?.message?.includes('Could not find an Account')) {
        showToast('Vote submission failed: Please connect your wallet.')
      } else {
        showToast('Vote submission failed: Please check your network or wallet status.')
      }
    } finally {
      setLoading(false)
    }
  }

  const Spinner = () => (
    <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
  )

  const ToastMessage = ({ toast }: { toast: string }) => (
    <div className="fixed top-5 right-5 bg-neutral-800 text-white px-5 py-3 rounded-lg shadow-md animate-fadeInOut z-50">
      {toast}
    </div>
  )

  const ProposalItem = ({
    proposal,
    index,
    selectedIndex,
    onChange,
    totalVotes,
  }: {
    proposal: any
    index: number
    selectedIndex: number | null
    onChange: (index: number) => void
    totalVotes: number
  }) => {
    const percent = totalVotes > 0 ? (Number(proposal.voteCount) / totalVotes) * 100 : 0
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
                onChange={() => onChange(index)}
                className="accent-blue-600"
              />
              <span className="font-semibold">{proposal.name}</span>
            </div>
            <span className="text-sm text-gray-500">{proposal.voteCount.toString()} votes</span>
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
  }

  const ProposalList = ({
    proposals,
    selectedIndex,
    setSelectedIndex,
  }: {
    proposals: any[]
    selectedIndex: number | null
    setSelectedIndex: (index: number) => void
  }) => {
    const totalVotes = proposals.reduce((sum, p) => sum + Number(p.voteCount), 0)
    return (
      <ul className="space-y-4 mb-12">
        {proposals.map((p, index) => (
          <ProposalItem
            key={index}
            proposal={p}
            index={index}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            totalVotes={totalVotes}
          />
        ))}
      </ul>
    )
  }

  const VoteButton = ({
    onClick,
    disabled,
    loading,
  }: {
    onClick: () => void
    disabled: boolean
    loading: boolean
  }) => (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`min-w-[100px] h-10 px-4 rounded-md text-white font-semibold flex items-center justify-center transition 
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {loading ? <Spinner /> : 'Vote'}
      </button>
    </div>
  )


  return (
    <div className="relative">
       <div className="fixed top-4 right-4 z-50">
        <ConnectButton />
      </div>
      <div className="flex justify-center items-center min-h-screen bg-white text-neutral-900">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Voting</h1>

          {proposals.length === 0 ? (
            <div className="flex justify-center items-center min-h-[100px]">
              <Spinner />
            </div>
          ) : (
            <ProposalList
              proposals={proposals}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          )}

          <VoteButton
            onClick={handleVote}
            disabled={selectedIndex === null || loading}
            loading={loading}
          />

          {toast && <ToastMessage toast={toast} />}
        </div>
      </div>
    </div>
  )


}
