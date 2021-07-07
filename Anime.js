const axios = require('axios')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const { empty } = require('cheerio/lib/api/manipulation')

module.exports = class Anime {
  title
  releaseDate
  synopsis
  genres
  episodes
  image
  id
  author
  studio

  constructor(id) {
    this.id = id;
  }

  async getAnimeDatas($) {
    const img = $(`img[src^="https://image.adkami.com/${this.id}"]`)

    this.image = img.attr('src');
    this.title = img.attr('alt');
    this.genres = $('p.description.justify.m-hidden [itemprop="genre"]').map((i, j) => $(j).text()).get()

    this.releaseDate = $('#col-droit .date').attr('data-time')
    this.studio = $('b[itemprop="publisher"]').text()
    this.synopsis = $('.description.justify > strong').first().text()
    this.author = $('b[itemprop="author"]').text()
  
    // get episodes links if episodes are french subbed else return; 
    const links = $(`[href^="https://www.adkami.com/anime/${this.id}/"]`).
        filter((x, y) => x != 0 && $(y).text().match(/episode.*vostfr/i))
        .map((x, y) => $(y)
        .attr('href'))
        .get()

    if(links.length < 0)
      return;

    await Promise.map(links, link => this.getEpisodeDatas(link), {concurrency:20}).then(data => this.episodes = data)
  }


  async getEpisodeDatas(link) {
 
    return axios.get(link).then((response) => {
      
      const $ = cheerio.load(response.data)

      const videoLinks = {

      };
      videoLinks['adn'] = $('[href^="https://animedigitalnetwork.fr/video/"]').attr('href') || '';
      videoLinks['crunchyroll'] = $('[src^="https://www.crunchyroll.com/affiliate_iframeplayer"]').attr('src') || '';
      videoLinks['wakanim'] = $('[src^="https://www.wakanim.tv/fr/v2/catalogue/embeddedplayer"]').attr('src') || '';
      const title = $('.title-header-video').text()
    
      return new Promise((res) => {
        res({
          title: title,
          videoLinks: videoLinks
        })       
      })
    })

  }
}
