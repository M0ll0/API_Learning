 const { loginUserService,getUserExist,postCreateUser } = require('../services/auth.services');

 /* async function loginUser(req,res,next){
    const username = req.body.username;

        try {
        let result = await getLoginData(username);
        res.json({"data" : result});

    } catch (err) {
        next(err);
    }
    
 } */

async function loginUser(req,res,next){
    const username = req.body.username;
    const password = req.body.password;
    try{
        const loginSuccessfull = await loginUserService(username,password);
        console.log(loginSuccessfull);
        if (loginSuccessfull.success){
            res.status(200);
            res.cookie("token", loginSuccessfull.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 3600000
            });

            return res.json({"success":true});
        }else{
            return res.status(401).json(loginSuccessfull)
        }
    }catch(err){
        next(err);
    }

}

async function createUser(req,res,next){
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    try{
        
        let result = await getUserExist(newUsername);
        if(!result){
            
            let result = await postCreateUser(newUsername,newPassword);
            res.json({"Data": result.rowsAffected});
        }else{
            res.send("This username already exists, please use another username.")
        }
    }catch(err){
        next(err);
    }
}


/* async function getUsernameExists(req,res,next){
    const username = req.params.username;
        console.log(username);
        try {
        let result = await getUserExist(username);
        res.json({"User" : username,"User exists" : result});

    } catch (err) {
        next(err);
    }
} */
module.exports = {loginUser,createUser}