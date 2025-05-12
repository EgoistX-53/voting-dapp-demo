import { useEffect, useState } from 'react'
import { getContract } from 'viem'
import { useWalletClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contract'

export function useVotingContract() {
  const { data: walletClient } = useWalletClient()
  const [contract, setContract] = useState<any>(null)
  useEffect(() => {
    console.log("walletClient:", walletClient)
    if (!walletClient) return

    const contractInstance = getContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      client: walletClient,
    })
     console.log("Contract Instance:", contractInstance)

    setContract(contractInstance)
  }, [walletClient])

  return contract
}