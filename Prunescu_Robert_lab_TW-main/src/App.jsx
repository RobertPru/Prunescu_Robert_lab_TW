import { useState, useEffect } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import { getDestinatii, patchVizitat, postDestinatie } from './api/destinatii.js'
import PanouStatistici from './components/PanouStatistici.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import Cautare from './components/Cautare.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [cautare, setCautare] = useState('')

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getDestinatii()
        // Ne asigurăm că preluăm mereu un array indiferent de formatul serverului
        const listaFinala = Array.isArray(date) ? date : (date.data || [])
        setDestinatii(listaFinala)
      } catch (err) {
        setEroare(err.message)
      } finally {
        setIncarcare(false)
      }
    }
    incarca()
  }, [])

  async function handleToggle(id) {
    const destinatieVeche = destinatii.find(d => d.id === id)
    try {
      const salvata = await patchVizitat(id, !destinatieVeche.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (err) {
      alert('Eroare la actualizare pe server!')
    }
  }

  async function handleAdd(nouaDestinatie) {
    try {
      const salvata = await postDestinatie(nouaDestinatie)
      setDestinatii((curent) => [...curent, salvata])
    } catch (err) {
      alert('Eroare la adăugarea pe server!')
    }
  }

  if (incarcare) return <p className="stare">Se încarcă destinațiile...</p>
  if (eroare) return <p className="stare eroare">Eroare: {eroare}</p>

  const nevizitate = getNevizitate(destinatii)
  const textCautat = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(textCautat) ||
      d.tara.toLowerCase().includes(textCautat)
  )

  return (
    <main>
      <h1>City Explorer</h1>
      <PanouStatistici />
      <Rezumat
        total={destinatii.length}
        nevizitate={nevizitate.length}
        zile={totalZile(nevizitate)}
      />
      <FormularDestinatie onAdd={handleAdd} />
      <Cautare valoare={cautare} onChange={setCautare} />
      
      {destinatii.length === 0 ? (
        <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
      ) : afisate.length === 0 ? (
        <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
      ) : (
        <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
      )}
    </main>
  )
}