const filterGenres = ['Magical Girl', 'Shôjo-Ai', 'Yaoi', 'Ecchi', 'Harem', 'Idols', 'Musical',
'Romance', 'Shônen-Ai', 'School Life', 'Tranche de vie', 'Yuri', 'Inceste', 'Triangle Amoureux'];

module.exports = function init($) {
    const genres = $("label[for^='genre']").filter((_, g) => 
        !filterGenres.includes($(g).text())).
        map((_, g) => $(g).text());
    const fs = require('fs');
    fs.writeFile("./assets/genres.json", JSON.stringify([...genres]), () => {});
}
