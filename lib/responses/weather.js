'use strict'

const debug = require('debug')('protobot:weather')
const axios = require('axios')

const OWM_API_KEY = process.env.OPEN_WEATHER_MAP_KEY
const OWM_URL = 'https://api.openweathermap.org/data/2.5/'
const PARAMS = `&units=metric&APPID=${OWM_API_KEY}`

const messages = {
  noLocation: 'I was not able to find the location you gave.',
  noDatetime: 'I was not able to understand the day for which you would like to know the weather forecast.',
  whichDay: 'For which day would you like to know the weather forecast?',
  whichLocation: 'For which location would you like to know the weather forecast?',
  today: 'Here is the wheather in {{vars.location}} today:',
  forecast: 'Here is the wheather in {{vars.location}} on {{vars.datetime}}:',
  weather: '{{vars.weather}}. {{vars.tempMin}} °C min / {{vars.tempMax}} °C max'
}
module.exports.messages = messages

module.exports.getResponse = async options => {
  let isForecast
  const weather = await getWeather(options)
  let answers = []
  isForecast = !isSameDay(new Date(), new Date(options.datetime))

  if (isForecast) {
    answers.push(messages.forecast)
    answers.push(weather)
  } else {
    answers.push(messages.today)
    answers.push(weather)
  }

  return answers
}

const getWeather = async options => {
  let isForecast

  debug('get weather called with options: ', options)

  options.datetime = options.datetime || new Date()
  options.location = options.location || 'New York'

  isForecast = !isSameDay(new Date(), new Date(options.datetime))

  return isForecast
    ? await getForecast(options.location, options.datetime)
    : await getToday(options.location)
}

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth()
}

const getForecast = async (location, datetime) => {
  let date = new Date(datetime)
  const res = await axios.get(OWM_URL + `forecast/daily?q=${location}` + PARAMS)
  const forecast = res.data.list.filter(x => {
    const xdt = new Date(x.dt * 1000)
    return isSameDay(date, xdt)
  })[0]

  debug('weather forecast: ', forecast)

  return {
    dt: forecast.dt,
    temp: Math.round(forecast.temp.day),
    tempMin: Math.round(forecast.temp.min),
    tempMax: Math.round(forecast.temp.max),
    weather: forecast.weather[0].description,
    icon: forecast.weather[0].icon,
    text: ''
  }
}

const getToday = async location => {
  let res = await axios.get(OWM_URL + `forecast/daily?q=${location}` + PARAMS)
  res = res.data.list[0]

  debug('weather today: ', res)

  return {
    dt: res.dt,
    temp: Math.round(res.temp.day),
    tempMin: Math.round(res.temp.min),
    tempMax: Math.round(res.temp.max),
    weather: res.weather[0].description,
    icon: res.weather[0].icon,
    text: ''
  }
}
