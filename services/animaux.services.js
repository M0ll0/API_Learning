/*
    service . utilise le db.js pour avoir un object pool, qu'il utilise pour batir une request (query)
    
    responsabilité:

    - builds SQL
    - queries DB
    - returns data
*/


const { sql, getConnection } = require('../db');

async function getAnimauxData(id_animal,espece){


    const pool = await getConnection();

    let queryString =
        "SELECT ID_animal, Nom_animal, Nom_personne as 'Maitre', e.Espece, Age_animal " +
        "FROM dbo.Animaux a " +
        "LEFT JOIN Especes e ON a.ID_espece = e.ID_espece " +
        "LEFT JOIN Personnes p ON p.ID_personne = a.ID_personne";

    let conditions = [];
    let request = pool.request();

    if (id_animal && !isNaN(id_animal)) {
        conditions.push("ID_animal = @id_animal");
        request.input("id_animal", sql.Int, id_animal);
    }

    if (espece && espece !== "") {
        conditions.push("e.Espece = @espece");
        request.input("espece", sql.VarChar, espece);
    }

    if (conditions.length > 0) {
        queryString += " WHERE " + conditions.join(" AND ");
    }

    let result = await request.query(queryString);
    return result.recordset;
}

module.exports = {getAnimauxData};