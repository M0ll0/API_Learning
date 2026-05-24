
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//require('dotenv').config();

const secret = process.env.JWT_SECRET;

async function retrieveUserDataForToken(username){


    let queryString =
        "SELECT ID_user,username " +
        "FROM public.users " +
        "WHERE username = $1";

    let params = [];

    if (username && username !== "") {
        params.push(username);
    }
    let result = await pool.query(queryString,params);
    console.log(result);
    return result.rows;

}

async function findPasswordHashByUsername(username){


    let queryString =
        "SELECT password_hash " +
        "FROM public.Users";

    let params = [];

    if (username && username !== "") {
        params.push(username);
    }

    if (params.length > 0) {
        queryString += ` WHERE username= $${params.length}`;
    }else{
        throw new Error("Data required: username needs to be given to identify the user.")
    }

    let result = await pool.query(queryString,params);
    return result.rows;
}

async function loginUserService(username, password){
        const successUserAndPassword = await verifyUserAndPassord(username,password);
        if (!successUserAndPassword){
            return {
                "success": false,
                "message": "Invalid username or password"
                };
        }
        const result = await retrieveUserDataForToken(username);
        if (!result || result.rows.length === 0){
           return {
                success: false,
                message: "User not found"
            };
        }
         const payload = {
                "user_id" : result.rows[0].ID_user,
                "username" : result.rows[0].username
            }
        const token = jwt.sign(payload, secret, { expiresIn: "1h"});
        console.log('The returned token :' + token);
        return {
            "success": true,
            "token": token
            };
}

async function verifyUserAndPassord(username, password){
            try{
            let result =  await findPasswordHashByUsername(username);
//            let successfulLogin
            if (result.rows.length===0){
                //early return is better : if not found, return prevents to run more code. also, less variables
                return false;
            }
            
            const passHash = result[0].password_hash;
            //console.log(passHash);
            successfulLogin  = await verifyPassword(password,passHash);
            return successfulLogin;
        /*     if (successfulLogin){
                res.json({"login successful" : true});
            }else{
                res.json({"login successful" : false});
            } */
            
        }catch(err){
            next(err);
        }
}

async function getUserExist(username){

    let queryString =
            "SELECT ID_user " +
            "FROM public.users " +
            "WHERE username = $1";
    let params = [];

    params.push(username);

    let result = await pool.query(queryString,params);
    return (result.rows.length>0);

}

async function postCreateUser(username, password){

    const PasswordHashed = await hashPassword(password);
    let queryString =
        "INSERT INTO public.users " +
        "(username,password_hash) " +
        "VALUES($1, $2)";
    let params=[];
    params.push(username);
    params.push(PasswordHashed);
    let result = await pool.query(queryString,params);
    return result;
}


/*

this is verification functions that will be in a module later.

*/

async function hashPassword(plainPassword) {
    // saltRounds determines how much time is needed to calculate a single BCrypt hash
    // 10-12 rounds is currently a good balance between security and performance
    const saltRounds = 12; 
    
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

async function verifyPassword(enteredPassword, storedHash) {
    const isMatch = await bcrypt.compare(enteredPassword, storedHash);
    return isMatch; // returns true or false
}
module.exports = {loginUserService,getUserExist,postCreateUser};