import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const apiKey= import.meta.env.VITE_WEATHER_API_KEY
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )
const CountryDetails=({country})=>{
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country.capital, apiKey])

  return(
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>Area: {country.area}</p>
      {weather && (
  <div>
    <h3>Weather in {country.capital?.[0]}</h3>

    <p>Temperature: {weather.main.temp} °C</p>

    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt="weather icon"
    />

    <p>Wind: {weather.wind.speed} m/s</p>
  </div>
)}

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language=>(
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`flag of ${country.name.common}`} width='100' />  
    </div>
  )
}
  return (
    <div>
      <div>
        find countries
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredCountries.length>10?(
        <p>Too many matches, please be specific!!</p>
      ):filteredCountries.length===1?(
        <CountryDetails country={filteredCountries[0]} />
      ):(
        filteredCountries.map(country => (
        <p key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSearch(country.name.common)}>
      show
    </button>
        </p>
      ))
      )}

    </div>
  )
}

export default App