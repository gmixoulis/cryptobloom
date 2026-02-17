import { WalletOptions } from './wallet-options'
import { FlowerCard } from './flower-card'

const FLOWERS = [
    {
        id: 1,
        name: 'Red Rose Bouquet',
        priceEth: '0.01',
        priceUsd: 25,
        image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: 2,
        name: 'Sunflower Bundle',
        priceEth: '0.005',
        priceUsd: 15,
        image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: 3,
        name: 'Tulip Arrangement',
        priceEth: '0.008',
        priceUsd: 20,
        image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=400',
    },
]

export function FlowerShop() {

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Web3 Flower Shop</h1>
                <div className="flex items-center gap-4">
                    <WalletOptions />
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FLOWERS.map((flower) => (
                    <FlowerCard key={flower.id} flower={flower} />
                ))}
            </main>
        </div>
    )
}
