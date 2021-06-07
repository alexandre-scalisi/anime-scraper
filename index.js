const cheerio = require('cheerio')
const axios = require('axios')
const Anime = require('./Anime')
const anime = new Anime(3753);




axios.get(`https://www.adkami.com/anime/${anime.id}`).then(response => {
  // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data)
    
    anime.fromPage($)
    
    
  
  
  })
