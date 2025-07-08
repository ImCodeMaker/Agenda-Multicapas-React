import { useState, useEffect } from 'react'
import { FetchContactsForAgenda } from './services/app.services'
import './App.css'

export default function App() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxPages = 8
  const contactsPerPage = Math.ceil(data.length / maxPages) || 1
  const totalPages = Math.min(maxPages, Math.ceil(data.length / contactsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await FetchContactsForAgenda()
        setData(fetchedData)
      } catch (error) {
        console.error(error)
      }
    }
    getData()
  }, [])

  const startIndex = (currentPage - 1) * contactsPerPage
  const endIndex = startIndex + contactsPerPage
  const currentContacts = data.slice(startIndex, endIndex)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      alert('Por favor completa todos los campos.')
      return
    }

    setIsSubmitting(true)
    const nuevoContacto = { nombre, apellido, telefono }

    try {
      await fetch('http://www.raydelto.org/agenda.php', {
        method: 'POST',
        body: JSON.stringify(nuevoContacto),
        headers: { 'Content-Type': 'application/json' }
      })

      setNombre('')
      setApellido('')
      setTelefono('')
      setCurrentPage(1)

      const fetchedData = await FetchContactsForAgenda()
      setData(fetchedData)
    } catch (error) {
      console.error('Error agregando contacto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h1 className="title">📒 Agenda de Contactos</h1>

      <form className="agenda" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          required
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          required
          value={apellido}
          onChange={e => setApellido(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          required
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Agregando...' : 'Agregar contacto'}
        </button>
      </form>

      {currentContacts.length === 0 ? (
        <p className="no-data">No hay contactos disponibles.</p>
      ) : (
        <div className="contact-list">
          {currentContacts.map((item, index) => (
            <div
              className="contact-card"
              key={`${item.telefono}-${index}`}
            >
              <div className="contact-name">{item.nombre} {item.apellido}</div>
              <div className="contact-info">
                <span className="contact-phone">📞 {item.telefono}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            className={`page-btn ${num === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </main>
  )
}
