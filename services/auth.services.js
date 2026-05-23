
const { sql, getConnection } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//require('dotenv').config();

const secret = process.env.JWT_SECRET;

async function retrieveUserDataForToken(username){
    const pool = await getConnection();

    let queryString =
        "SELECT [ID_user],[username] " +
        "FROM [PersonnesEtAnimaux_].[dbo].[Users] " +
        "WHERE username = @username";

    let request = pool.request();

    if (username && username !== "") {
        request.input("username", sql.VarChar, username);
    }
    let result = await request.query(queryString);
    console.log(result);
    return result.recordset;

}

async function findPasswordHashByUsername(username){


    const pool = await getConnection();

    let queryString =
        "SELECT [password_hash] " +
        "FROM [PersonnesEtAnimaux_].[dbo].[Users]";

    let conditions = [];
    let request = pool.request();

    if (username && username !== "") {
        conditions.push("username = @username");
        request.input("username", sql.VarChar, username);
    }

    if (conditions.length > 0) {
        queryString += " WHERE " + conditions.join(" AND ");
    }else{
        throw new Error("Data required: username needs to be given to identify the user.")
    }

    let result = await request.query(queryString);
    return result.recordset;
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
        if (!result || result.length === 0){
           return {
                success: false,
                message: "User not found"
            };
        }
         const payload = {
                "user_id" : result[0].ID_user,
                "username" : result[0].username
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
            if (result.length===0){
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

    const pool = await getConnection();
    let queryString =
            "SELECT [ID_user] " +
            "FROM [PersonnesEtAnimaux_].[dbo].[Users] " +
            "WHERE username = @username";
    
    let request = pool.request();
    request.input("username", sql.VarChar, username);
    let result = await request.query(queryString);
    return (result.recordset.length>0);

}

async function postCreateUser(username, password){
    const pool = await getConnection();
    const PasswordHashed = await hashPassword(password);
    let queryString =
        "INSERT INTO [PersonnesEtAnimaux_].[dbo].[Users] " +
        "([username],[password_hash]) " +
        "VALUES(@username, @passwordHash)";
    let request = pool.request();
    request.input("username", sql.VarChar, username);
    request.input("passwordHash", sql.VarChar, PasswordHashed);
    let result = await request.query(queryString);
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