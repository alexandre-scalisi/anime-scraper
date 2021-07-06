const axios = require('axios')
const cheerio = require('cheerio')
const Promise = require('bluebird')

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

  async fromPage($) {
    const img = $(`img[src^="https://image.adkami.com/${this.id}"]`)

    this.image = img.attr('src');
    this.title = img.attr('alt');
    this.genres = $('p.description.justify.m-hidden [itemprop="genre"]').map((i, j) => $(j).text()).get()

    this.releaseDate = $('#col-droit .date').attr('data-time')
    this.studio = $('b[itemprop="publisher"]').text()
    this.synopsis = $('.description.justify > strong').first().text()
    this.author = $('b[itemprop="author"]').text()

    const links = $(`[href^="https://www.adkami.com/anime/${this.id}/"]`).filter((x, y) => x != 0 && $(y).text().match(/episode.*vostfr/i)).map((x, y) => $(y).attr('href')).get()
    

    

    // const promises = links.map(l => this.fromPage2(l));
    await Promise.map(links, link => this.fromPage2(link), {concurrency:20}).then(data => {
    this.episodes = data
    return this;
  
    });
    // const fs = require('fs');
    // fs.readFile('animu.json', null, function (err, data) {
    //   var json = JSON.parse(data)

    //   json.push(animes)

    //   fs.writeFile("animu.json", JSON.stringify(json), () => {})
    // })
    // });

  }

  async fromPage2(link) {

    return axios.get(link).then((response) => {
      // Load the web page source code into a cheerio instance
      const $ = cheerio.load(response.data)

      const videoLinks = {

      };
      videoLinks['adn'] = $('[href^="https://animedigitalnetwork.fr/video/"]').attr('href') || '';
      videoLinks['crunchyroll'] = $('[src^="https://www.crunchyroll.com/affiliate_iframeplayer"]').attr('src') || '';
      videoLinks['wakanim'] = $('[src^="https://www.wakanim.tv/fr/v2/catalogue/embeddedplayer"]').attr('src') || '';
      const title = $('.title-header-video').text()
      // console.log($('.title-header-video').text());
      return new Promise((res, rej) => {
        res({
          title: title,
          videoLinks: videoLinks
        })

        
      })


    })


  }
}