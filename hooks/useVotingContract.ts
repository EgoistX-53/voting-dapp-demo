import { useEffect, useState } from 'react'
import { getContract, createPublicClient, http } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contract'

export function useVotingContract() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    const client = walletClient ?? publicClient
    if (!client || !CONTRACT_ADDRESS) return

    const contractInstance = getContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      client,
    })

    setContract(contractInstance)
  }, [walletClient, publicClient])

  return contract
}