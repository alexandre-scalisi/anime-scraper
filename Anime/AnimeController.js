const axios = require('axios')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const Anime = require('./Anime')

const filterGenres = ['Magical Girl', 'Shôjo-Ai', 'Yaoi', 'Ecchi', 'Harem', 'Idols', 'Musical',
'Romance', 'Shônen-Ai', 'School Life', 'Tranche de vie', 'Yuri', 'Inceste', 'Triangle Amoureux'];
const animes = [];


module.exports = async function init(pageCount) {

    for(let i = 1; i <= pageCount; i++) {
  
  
      await axios.get(`https://www.adkami.com/video?t=0&page=${i}`).then(async response => {
      
        const $ = cheerio.load(response.data)
    
        //get all links to linking to an anime on current search page
        const links = $('.video-item-list > a').map((i, j) => $(j).attr('href'));
    
        // Promise.map is a method from Bluebird package allowing me to run a limited amount of promises simultaneously
        await Promise.map(links, link => axios.get(link).
            then(response => getDatas(response, link), {concurrency: 10})
            )}
        )}
      
      //convert every Anime class into json string in order to read it in laravel
      const fs = require('fs');
      fs.writeFile("./assets/animes.json", JSON.stringify(animes), () => {});
  }



async function getDatas(response, link) {
    const $ = cheerio.load(response.data)
           
    if (!validate($)) return;
    
    const id = link.split('/').slice(-1)[0];
    let anime = new Anime(id);
  
    //fetch anime datas using the id
    await axios.get(link).then( async response => {
      const $ = cheerio.load(response.data);
      await anime.getAnimeDatas($)
        
      })
  
    //wait for all datas to be fetched and then push it into anime array if it has episodes
    if((anime.episodes.length > 0))
        animes.push(anime);
  }
  
  // I'm filtering some categories and animes with no links to wakanim/adn/crunchyroll
  function validate($) {
    const genres = [...$("[itemprop='genre']").map((_, i) => $(i).text())];
    
    if (genres.some( a => filterGenres.includes(a)))
      return false;
   
    let linksCount = 0
    linksCount += $('[href^="https://animedigitalnetwork.fr/video/"]').length
    linksCount += $('[src^="https://www.crunchyroll.com/affiliate_iframeplayer"]').length
    linksCount += $('[src^="https://www.wakanim.tv/fr/v2/catalogue/embeddedplayer"]').length
    
  
    if (linksCount < 1) return false;
  
    return true;
  }
  
  
  
  
  