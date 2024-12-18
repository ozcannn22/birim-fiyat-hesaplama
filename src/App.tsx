import { useState } from 'react'
import './App.css'
import birimFiyatlarJson from '@/data/birimFiyatlar.json'

// TypeScript interface tanımlamaları
interface BirimFiyat {
  poz: string;
  tanim: string;
  birimFiyat: number;
}

const birimFiyatlarData = birimFiyatlarJson as BirimFiyat[]

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

  const handle