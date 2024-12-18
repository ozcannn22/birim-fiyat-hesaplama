import { useState } from 'react'
import './App.css'
import birimFiyatlarData from './data/birimFiyatlar.json' // Yolu düzelttik

// TypeScript interface tanımlamaları
interface BirimFiyat {
  poz: string;
  tanim: string;
  birimFiyat: number;
}

function App() {
  const [selectedPoz, setSelectedPoz] = useState('')
  const [selectedBirimFiyat, setSelectedBirimFiyat] = useState<number | null>(null)
  const [miktar, setMiktar] = useState<number>(0)
  const [sonuc, setSonuc] = useState<number | null>(null)

  const handlePozChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedPoz(selectedValue)
    const birimFiyat = birimFiyatlarData.find((item: BirimFiyat) => item.poz === selectedValue)?.birimFiyat || null
    setSelectedBirimFiyat(birimFiyat)
    calculateSonuc(miktar, birimFiyat)
  }

  const handleMiktarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const yeniMiktar = parseFloat(event.target.value) || 0
    setMiktar(yeniMiktar)
    calculateSonuc(yeniMiktar, selectedBirimFiyat)
  }

  const calculateSonuc = (yeniMiktar: number, birimFiyat: number | null) => {
    if (birimFiyat !== null) {
      setSonuc(yeniMiktar * birimFiyat)
    } else {
      setSonuc(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="poz">
                    Poz Seçin
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="poz"
                    value={selectedPoz}
                    onChange={handlePozChange}
                  >
                    <option value="">Poz Seçin</option>
                    {birimFiyatlarData.map((item: BirimFiyat) => (
                      <option key={item.poz} value={item.poz}>
                        {item.poz} - {item.tanim}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="miktar">
                    Miktar
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="miktar"
                    type="number"
                    value={miktar}
                    onChange={handleMiktarChange}
                  />
                </div>

                {selectedBirimFiyat !== null && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm font-bold">
                      Birim Fiyat: {selectedBirimFiyat} TL
                    </p>
                  </div>
                )}

                {sonuc !== null && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm font-bold">
                      Sonuç: {sonuc.toFixed(2)} TL
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App