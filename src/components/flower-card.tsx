import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { Loader2 } from 'lucide-react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'

interface Flower {
    id: number
    name: string
    priceEth: string
    priceUsd: number
    image: string
}

export function FlowerCard({ flower }: { flower: Flower }) {
    const { data: hash, isPending, sendTransaction, isError } = useSendTransaction()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })
    const { isConnected } = useAccount()
    const { openConnectModal } = useConnectModal()
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (isError) {
            alert('Transaction failed or was rejected')
        }
    }, [isError])

    useEffect(() => {
        if (isConfirmed && hash && email) {
            fetch('http://localhost:3001/api/receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    transactionHash: hash,
                    flowerName: flower.name,
                    price: `${flower.priceEth} ETH`
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Receipt sent:', data)
                    alert('Receipt sent to your email!')
                })
                .catch(err => console.error('Error sending receipt:', err))
        }
    }, [isConfirmed, hash, email, flower])

    const handleBuyEth = () => {
        if (!isConnected) {
            openConnectModal?.()
            return
        }
        if (!email) {
            alert('Please enter an email address for the receipt.')
            return
        }
        sendTransaction({
            to: '0xd2135CfB216b74109775236E36d4b433F1DF507B', // Example address
            value: parseEther(flower.priceEth),
        }, {
            onError: (error) => {
                console.error("Transaction error:", error)
            }
        })
    }

    const handleBuyFiat = () => {
        if (!email) {
            alert('Please enter an email address for the receipt.')
            return
        }

        // Mock fiat transaction
        const mockTxHash = `fiat-tx-${Date.now()}-${Math.random().toString(36).substring(7)}`

        fetch('http://localhost:3001/api/receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                transactionHash: mockTxHash,
                flowerName: flower.name,
                price: `$${flower.priceUsd}`,
                currency: 'USD'
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Fiat receipt sent:', data)
                alert(`Mock payment of $${flower.priceUsd} successful! Receipt sent to ${email}`)
            })
            .catch(err => console.error('Error sending receipt:', err))
    }

    return (
        <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
            <img src={flower.image} alt={flower.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{flower.name}</h3>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{flower.priceEth} ETH</span>
                    <span className="text-gray-600">${flower.priceUsd}</span>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        type="email"
                        placeholder="Enter email for receipt"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded border-gray-300"
                    />
                    <button
                        onClick={handleBuyEth}
                        disabled={isPending || isConfirming}
                        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isPending || isConfirming ? <Loader2 className="animate-spin" /> : 'Buy with ETH'}
                    </button>
                    <button
                        onClick={handleBuyFiat}
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Buy with Card
                    </button>
                </div>

                {hash && <div className="mt-2 text-xs text-gray-500 break-all">Tx: {hash}</div>}
                {isConfirming && <div className="mt-2 text-yellow-600 text-sm">Waiting for confirmation...</div>}
                {isConfirmed && <div className="mt-2 text-green-600 text-sm">Transaction confirmed!</div>}
            </div>
        </div>
    )
}
