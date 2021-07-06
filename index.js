const cheerio = require('cheerio')
const axios = require('axios')
const Anime = require('./Anime');
const {
  first
} = require('cheerio/lib/api/traversing');
const filterGenres = ['Magical Girl', 'Shôjo-Ai', 'Yaoi', 'Ecchi', 'Harem', 'Idols', 'Musical', 'Romance', 'Shônen-Ai', 'Tranche de vie', 'Yuri', 'Inceste', 'Triangle Amoureux'];
const animes = [];


(async function() {

  for(let i = 1; i < 16; i++) {

  await axios.get(`https://www.adkami.com/video?t=0&page=${i}`).then(async response => {
  // Load the web page source code into a cheerio instance
  let $ = cheerio.load(response.data)
  const links = $('.video-item-list > a').map((i, j) => $(j).attr('href'));
  
    for(let i = 0; i< links.length; i++) {
      await axios.get(links[i]).then(async response => {
        $ = cheerio.load(response.data)
        const genres = [...$("[itemprop='genre']").map((_, i) => $(i).text())];
        if (genres.some( a => filterGenres.includes(a)))
          return;

        let linksCount = 0
        linksCount += $('[href^="https://animedigitalnetwork.fr/video/"]').length
        linksCount += $('[src^="https://www.crunchyroll.com/affiliate_iframeplayer"]').length
        linksCount += $('[src^="https://www.wakanim.tv/fr/v2/catalogue/embeddedplayer"]').length
        
  
        if (linksCount < 1) return;
          const id = links[i].split('/').slice(-1)[0];
          let anime = new Anime(id);
          await axios.get(links[i]).then( async response => {
            $ = cheerio.load(response.data);
            await anime.fromPage($)
            
          })
          animes.push(anime);
          
          
        });
        
      }
    })}
  
  const fs = require('fs');
  fs.writeFile("animu.json", JSON.stringify(animes), () => {});
})()
