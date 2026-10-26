import { useState } from 'react';

export default function FormularDestinatie({ onAdd }) {
  const [oras, setOras] = useState('');
  const [tara, setTara] = useState('');
  const [zile, setZile] = useState('');

  function handleSubmit(event) {
    event.preventDefault(); // Oprește reîncărcarea paginii
    
    if (!oras.trim() || !tara.trim()) return; // Dacă orașul sau țara sunt goale, nu face nimic[cite: 56]

    const nouaDestinatie = {
      id: crypto.randomUUID(),
      oras: oras.trim(),
      tara: tara.trim(),
      zile: Number(zile) || 1, // Convertește în număr[cite: 56]
      vizitat: false
    };

    onAdd(nouaDestinatie);

    // Golește câmpurile după trimitere[cite: 56]
    setOras('');
    setTara('');
    setZile('');
  }

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Oraș" 
        value={oras} 
        onChange={(e) => setOras(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Țară" 
        value={tara} 
        onChange={(e) => setTara(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Zile" 
        value={zile} 
        onChange={(e) => setZile(e.target.value)} 
      />
      <button type="submit">Adaugă</button>
    </form>
  );
}