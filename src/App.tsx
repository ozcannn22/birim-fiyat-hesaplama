import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import birimFiyatlarData from './data/birimFiyatlar.json'

interface PozItem {
  siraNo: number
  pozNo: string
  aciklama: string
  birim: string
  miktar: number
  birimFiyat: number | null
  tutar: number | null
}

function App() {
  const [pozlar, setPozlar] = useState<PozItem[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [gecmisKayitlar, setGecmisKayitlar] = useState<any[]>([])

  useEffect(() => {
    const kayitlar = localStorage.getItem('gecmisHesaplamalar')
    if (kayitlar) {
      setGecmisKayitlar(JSON.parse(kayitlar))
    }
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setYukleniyor(true)
    
    // Test için örnek veri
    const ornekPozlar: PozItem[] = [
      {
        siraNo: 1,
        pozNo: "15.185.1013",
        aciklama: "Ön yapımlı bileşenlerden oluşan tam güvenlikli, dış cephe iş iskelesi yapılması",
        birim: "m²",
        miktar: 3,
        birimFiyat: (birimFiyatlarData as any)["15.185.1013"]?.fiyat || null,
        tutar: null
      },
      {
        siraNo: 2,
        pozNo: "15.275.1101",
        aciklama: "250/350 kg çimento dozlu kaba ve ince harçla sıva yapılması",
        birim: "m²",
        miktar: 2,
        birimFiyat: (birimFiyatlarData as any)["15.275.1101"]?.fiyat || null,
        tutar: null
      }
    ]
    
    const pozlarWithTutars = ornekPozlar.map(poz => ({
      ...poz,
      tutar: poz.birimFiyat && poz.miktar ? poz.birimFiyat * poz.miktar : null
    }))
    
    setPozlar(pozlarWithTutars)
    setYukleniyor(false)
  }

  const handleBirimFiyatChange = (pozNo: string, value: string) => {
    const yeniPozlar = pozlar.map(poz => {
      if (poz.pozNo === pozNo) {
        const birimFiyat = parseFloat(value) || 0
        return {
          ...poz,
          birimFiyat,
          tutar: birimFiyat * poz.miktar
        }
      }
      return poz
    })
    setPozlar(yeniPozlar)
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      pozlar.map(p => ({
        'Sıra No': p.siraNo,
        'Poz No': p.pozNo,
        'Açıklama': p.aciklama,
        'Birim': p.birim,
        'Miktar': p.miktar,
        'Birim Fiyat': p.birimFiyat,
        'Tutar': p.tutar
      }))
    )
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Pozlar')
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    saveAs(data, 'birim-fiyat-hesaplama.xlsx')
  }

  const kaydet = () => {
    const yeniKayit = {
      tarih: new Date().toLocaleString(),
      pozlar: pozlar,
      toplamTutar: toplamTutar
    }
    
    const yeniKayitlar = [yeniKayit, ...gecmisKayitlar].slice(0, 10)
    setGecmisKayitlar(yeniKayitlar)
    localStorage.setItem('gecmisHesaplamalar', JSON.stringify(yeniKayitlar))
  }

  const toplamTutar = pozlar.reduce((acc, poz) => acc + (poz.tutar || 0), 0)

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Birim Fiyat Hesaplama
            </h1>
            <div className="space-x-2">
              <button
                onClick={exportToExcel}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={pozlar.length === 0}
              >
                Excel'e Aktar
              </button>
              <button
                onClick={kaydet}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={pozlar.length === 0}
              >
                Kaydet
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              PDF Dosyası Yükle
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full"
              disabled={yukleniyor}
            />
          </div>

          {yukleniyor && (
            <div className="text-center py-4">
              <p className="text-gray-600">PDF dosyası okunuyor...</p>
            </div>
          )}

          {pozlar.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Poz No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Birim</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {pozlar.map((poz) => (
                    <tr key={poz.pozNo} className="border-t">
                      <td className="px-4 py-2">{poz.siraNo}</td>
                      <td className="px-4 py-2">{poz.pozNo}</td>
                      <td className="px-4 py-2">{poz.aciklama}</td>
                      <td className="px-4 py-2">{poz.birim}</td>
                      <td className="px-4 py-2 text-right">{poz.miktar}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={poz.birimFiyat || ''}
                          onChange={(e) => handleBirimFiyatChange(poz.pozNo, e.target.value)}
                          className="w-24 px-2 py-1 text-right border rounded"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        {poz.tutar?.toFixed(2) || '0.00'} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={6} className="px-4 py-2 text-right font-bold">
                      Toplam Tutar:
                    </td>
                    <td className="px-4 py-2 text-right font-bold">
                      {toplamTutar.toFixed(2)} TL
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {gecmisKayitlar.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Geçmiş Kayıtlar</h2>
              <div className="space-y-2">
                {gecmisKayitlar.map((kayit, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{kayit.tarih}</span>
                      <span className="font-bold">{kayit.toplamTutar.toFixed(2)} TL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App