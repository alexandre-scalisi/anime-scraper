const filterGenres = ['Magical Girl', 'Shôjo-Ai', 'Yaoi', 'Ecchi', 'Harem', 'Idols', 'Musical',
'Romance', 'Shônen-Ai', 'School Life', 'Tranche de vie', 'Yuri', 'Inceste', 'Triangle Amoureux'];

module.exports = function init($) {
    const genres = $("label[for^='genre']").filter((_, g) => 
        !filterGenres.includes($(g).text())).
        map((_, g) => $(g).text());
    const fs = require('fs');
    fs.writeFile("./assets/genres.json", JSON.stringify([...genres]), (err) => {
        if(err) { console.log(err); return}

        console.log('-------------------------------------------------------------------------------------')
        console.log('Fichier JSON contenant la liste des catégories trouvées créé dans /assets/genres.json')
        console.log('-------------------------------------------------------------------------------------')
    });
}
