const cheerio = require('cheerio')
const axios = require('axios')

const AnimeController = require('./Anime/AnimeController');
const Genre = require('./Genre/Genre')
const searchLink = 'https://www.adkami.com/anime';

axios.get(searchLink).then(response => {
  // I'm using cheerio to query the DOM elements
  const $ = cheerio.load(response.data)

  //get genres 
  Genre($)

  

  const pageCount = $('a > button').last().text();

  AnimeController(pageCount)
});












