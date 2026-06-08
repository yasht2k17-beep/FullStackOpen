import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Notification=({message, type})=>{
    if(message==null)
    {
      return null
    }
    return(
      <div className={type}>
        {message}
      </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search,setSearch]=useState('')
  const [message,setMessage]=useState(null)
  const [errorMessage, setErrorMessage]=useState(null)
  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
    person => person.name === newName
  )

  if (existingPerson) {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const changedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, changedPerson)
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id !== existingPerson.id
                ? person
                : response.data
            )
          )
          setMessage(`Updated ${response.data.name}`)
          setTimeout(()=>{
            setMessage(null)
          },5000)
        })
        .catch(error=>{
          setErrorMessage(`${existingPerson.name} has been removed from server or never existed`)
          setTimeout(()=>{
            setErrorMessage(null)
          },5000)
          setPersons(persons.filter(persons=>persons.id!==existingPerson.id))
        })
    }

    setNewName('')
    setNewNumber('')
    return
  }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService.create(personObject).then(response=>{
      setPersons(persons.concat(response.data))
      setMessage(`Added ${response.data.name}`)
      setTimeout(()=>{
        setMessage(null)
      },5000)
    })
    setNewName('')
    setNewNumber('')
  }
  const removePerson=(id,name)=>{
    if(window.confirm(`Delete ${name}?`))
    {
      personService.remove(id).then(()=>{
        setPersons(persons.filter(person=>person.id!==id))
        setMessage(`Deleted ${name}`)
        setTimeout(()=>{
        setMessage(null)
      },5000)
      })
    }
  }
  useEffect(()=>{
    personService.getAll().then(response=>{
      setPersons(response.data)
    })
  },[]
  )
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type="success"/>
      <Notification message={errorMessage} type="error"/>
      <div>
        filter shown with
        <input value={search} onChange={(event)=>setSearch(event.target.value)}/>
      </div>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(person=> person.name.toLowerCase().includes(search.toLowerCase()))
      .map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={()=>removePerson(person.id,person.name)}>delete</button>
        </p>
      ))}
    </div>
  )
}
export default App