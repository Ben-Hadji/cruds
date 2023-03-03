import express from "express"
import { Role } from "./IUser"
import IUser from "./IUser"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const users : Array<IUser> = [{nom: "Alex", prenom: "winn", userID: 0, role: Role.admin, userName: "Ben", password: "alwibe"}]


const router = express.Router()

router.get("/users", (req, res) => {
    res.status(200)

    
    res.send({mesage: "there are all users", data: users})
    
})


router.post("/create", (req, res) => {
    const user: IUser = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        userID : users.length, 
        role: req.body.role, 
        userName: req.body.userName, 
        password: req.body.password
    } 

    const noDuplicate = (users.filter((u) => u.userName === req.body.userName).length < 1)

    if ((req.session as any).user.role === Role.admin){
        if ((user.role === Role.employee || user.role === Role.client) && noDuplicate){
            users.push(user)
            res.status(201)
            res.send({message: "user created", status: "Created"})
        }
        else{
            res.status(401)
            res.send({message: "not the right role or there is a duplicate username", status: "Bad"})
            //res.status(StatusCodes.UNAUTHORIZED).send({message: "not the right role or there is a duplicate username"})
        }
    }

    if ((req.session as any).user.role === Role.employee ){
        if (user.role === Role.client && noDuplicate){
            users.push(user)
            res.status(201)
            res.send({message: "user created", status: "Created"})
        }
        else{
            res.status(400)
            res.send({message: "Your request is very bad man", status: "Bad"})
        }
    }

    else{
        res.status(401)
        res.send({message: "You're not authorized to create a new user", status: "Unauthorized"})
    }
})

router.post("/login", (req, res) => {
    console.log(users)
    if(!req.body.userName || !req.body.password){
        res.render('login', {message: "Please enter both username and password"});
    }
    else{
        users.filter(function(user){
            if (user.userName === req.body.userName && user.password === req.body.password){
                (req.session as any).user = user;
                res.send({message: `Welcome ${user.prenom}`, status: "logged in"})
                return
            }

        })
        
        //res.send({message: "invalid credentials", status: "login failled"})
    }
})

router.delete("/signout", (req, res) => {
    if (!(req.session as any).user) {
      res.status(401);
      res.send({
        message: "You're not logged in !",
        status: "BadRequest",
      });
    }
  
    const username = (req.session as any).user.userName;
  
    (req.session as any).user = undefined;
    req.session.destroy(() => {
      console.log(`disconnecting ${username}`);
    });
  
    res.status(200);
    res.send({
      message: "You are being disconnected",
      status: "OK",
    });
});

router.post("/users", (req, res) => {
    const body = req.body as IUser
})

export default router