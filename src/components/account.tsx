import { useAccount, useConnections, useDisconnect } from 'wagmi'

export function Account() {
    const account = useAccount()
    // @ts-ignore
    const connections = useConnections()
    // @ts-ignore
    const address = account?.address || connections?.[0]?.accounts?.[0]

    const { disconnect } = useDisconnect()
    // const { data: balance } = useBalance({ address })

    return (
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg shadow-sm">
            <div className="text-sm font-medium">Connected Account</div>
            <div className="font-mono text-xs break-all">{address}</div>

            <button
                onClick={() => disconnect()}
                className="px-4 py-2 mt-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
                Disconnect
            </button>
        </div>
    )
}
