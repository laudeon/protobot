# protobot
A prototype of a chatbot using:
 - Botkit
 - Socket.io
 - React
 - Recast.ai

It can handle intents like greetings, goodbye, thank, and get-weather. The weather is recovered through [OpenWeatherMap](http://openweathermap.org/).

For the front-end part of this project, see the [protobot-client](https://github.com/laudeon/protobot-client) repository.

## Usage

### Install

**It requires Node.js version >= 8 installed on your computer**

1. `git clone https://github.com/laudeon/protobot.git`
2. Create a `.env` file in the root project directory that should contain your recast.ai and Open Weather Map API keys  
```
OPEN_WEATHER_MAP_KEY=<yourKeyHere>
RECAST_KEY=<yourKeyHere>
```
3. `npm install` install all dependencies
4. `npm run dev` run Node.js with nodemon
