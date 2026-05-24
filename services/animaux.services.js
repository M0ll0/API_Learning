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
        "SELECT id_animal, nom_animal, nom_personne as 'Maitre', e.nspece, age_animal " +
        "FROM public.animaux a " +
        "LEFT JOIN public.Especes e ON a.id_espece = e.id_espece " +
        "LEFT JOIN public.personnes p ON p.id_personne = a.id_personne " + 
        "WHERE 1=1";

    let params = [];


    if (id_animal && !isNaN(id_animal)) {
        params.push(id_animal);
        queryString += ` AND id_animal = $${params.length}`;
    }

    if (espece && espece !== "") {
        params.push("e.espece = @espece");
        queryString += ` AND e.espece = $${params.length}`;
    }

    let result = await pool.query(queryString, params);
    return result.rows;
}

module.exports = {getAnimauxData};