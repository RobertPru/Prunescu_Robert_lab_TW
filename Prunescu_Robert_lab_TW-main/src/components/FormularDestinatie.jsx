import { useState } from 'react'

export default function FormularDestinatie({ onAdd }) {

  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' })
  const [erori, setErori] = useState({})
  const [seTrimite, setSeTrimite] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  function valideaza(val) {
    const mesaje = {}
    const numarZile = Number(val.zile)

    if (val.oras.trim().length < 2) {
      mesaje.oras = 'Orașul are cel puțin două caractere.'
    }
    if (val.tara.trim() === '') {
      mesaje.tara = 'Țara este obligatorie.'
    }
    if (val.zile === '' || Number.isNaN(numarZile) || numarZile < 1 || numarZile > 30) {
      mesaje.zile = 'Numărul de zile este între 1 și 30.'
    }
    return mesaje
  }

  async function handleSubmit(event) {
    event.preventDefault()
    
    const mesajeEroare = valideaza(valori)
    setErori(mesajeEroare)


    if (Object.keys(mesajeEroare).length > 0) {
      return
    }

    setSeTrimite(true)
    
    const nouaDestinatie = {
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false
    } // Nu mai punem id, îl va genera json-server

    await onAdd(nouaDestinatie)

    // Golim formularul după trimiterea cu succes
    setValori({ oras: '', tara: '', zile: '' })
    setErori({})
    setSeTrimite(false)
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          name="zile"
          type="number"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}