import express from "express"
import IUser from "./IUser"
import expressSession from "express-session"

const users : Array<IUser> = [{nom: "Alex", prenom: "winn", userID: 0, role: "admin", userName: "Ben", password: "alwibe"}]


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

    if ((req.session as any).user.role === "admin"){
        if ((user.role === "employe" || user.role ==="client") && (users.filter((u) => u.userName === req.body.userName).length < 1)){
            users.push(user)
            res.status(201)
            res.send({message: "user created", status: "Created"})
        }
        else{
            res.status(401)
            res.send({message: "Your request is very bad man", status: "Bad"})
        }
    }

    if ((req.session as any).user.role === "employe"){
        if (user.role === "client"){
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