
 const { getAnimauxData } = require('../services/animaux.services');

 async function getAnimaux(req,res,next){
    const id_animal = req.query.id_animal;
    const espece = req.query.espece;

    try {
        let result = await getAnimauxData(id_animal,espece);
        res.json({"count" : result.length, "data" : result});

    } catch (err) {
        next(err);
    }
 }

module.exports = {getAnimaux}