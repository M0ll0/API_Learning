/*
    service . utilise le db.js pour avoir un object pool, qu'il utilise pour batir une request (query)
    
    responsabilité:

    - builds SQL
    - queries DB
    - returns data
*/


const pool = require('../db');

async function getAnimauxData(id_animal,espece){


    let queryString =
        "SELECT ID_animal, Nom_animal, Nom_personne as 'Maitre', e.Espece, Age_animal " +
        "FROM public.Animaux a " +
        "LEFT JOIN public.Especes e ON a.ID_espece = e.ID_espece " +
        "LEFT JOIN public.Personnes p ON p.ID_personne = a.ID_personne " + 
        "WHERE 1=1";

    let params = [];


    if (id_animal && !isNaN(id_animal)) {
        params.push(id_animal);
        queryString += ` AND ID_animal = $${params.length}`;
    }

    if (espece && espece !== "") {
        params.push("e.Espece = @espece");
        queryString += ` AND e.Espece = $${params.length}`;
    }

    let result = await pool.query(queryString, params);
    return result.rows;
}

module.exports = {getAnimauxData};