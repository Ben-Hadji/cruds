import express from "express"
import IChambre from "./IChambre"
import IUser from "../users/IUser"
import expressSession from "express-session"

let chambres : Array<IChambre> = []

const router = express.Router()

router.get("/chambres", (req, res) => {
    res.status(200)

    if (chambres.length === 0){
        res.send({mesage: "no disponible bedroom", data: chambres})
    }
    else{
        res.send({mesage: "there are all bedrooms", data: chambres})
    }
})

router.post("/addroom", (req, res) => {
    const chambre: IChambre = {
        etage: req.body.etage,
        numero: req.body.numero,
        prix: req.body.prix
    } 

    if ((req.session as any).user.role === "admin"){
        if ((chambre.etage != null) && (chambre.numero != null) && (chambre.prix != null) ){
            if (chambres.filter((c) => c.numero === req.body.numero).length < 1){
                chambres.push(chambre)
                res.status(201)
                res.send({message: "Room added", status: "Added"})
            }
            else{
                res.status(401)
                res.send({message: "the room number already exists", status: "Duplicate number"}) 
            }             
        }
        else{
            res.status(401)
            res.send({message: "All fields must be filled in", status: "Missing info"})
        }
    }
    else{
        res.status(401)
        res.send({message: "You're not authorized to add a new Room", status: "Unauthorized"})
    }
})

router.post("/updateroom/:id", (req, res) => {
    const chambre: IChambre = {
        etage: req.body.etage,
        numero: parseInt(req.params.id),
        prix: req.body.prix
    } 

    if ((req.session as any).user.role === "admin"){
        let find:boolean = false;
        let i = 0;
        while(i < chambres.length && (find === false)){
            if(chambres[i].numero === chambre.numero){
                find = true;
                    
            }
            i+=1
        console.log('index:', i)
        }
                
        if (find === true){            
            if ((chambre.etage != null) && (chambre.prix != null)){
                chambres[i].etage = chambre.etage
                chambres[i].prix = chambre.prix
                
                res.status(201)
                res.send({message: "Room updated", data: chambres[i]})
            }
            if(chambre.etage && !chambre.prix){
                chambres[i].etage = chambre.etage
                
                res.status(201)
                res.send({message: "Room updated", data: chambres[i]})
            }   
            if(!chambre.etage && chambre.prix)  {
                chambres[i].prix = chambre.prix
                
                res.status(201)
                res.send({message: "Room updated", data: chambres[i]})
            } 
            else{
                res.status(401)
                res.send({message: "no changes were found", status: "no change"})
            }       
        }
        else{
            res.status(401)
            res.send({message: "this room doesn't exist", status: "not found"})
        }
    }
    else{
        res.status(401)
        res.send({message: "You're not authorized to add a new Room", status: "Unauthorized"})
    }
})

router.delete("/deleteroom/:id", (req, res) => {
    let id: number = parseInt(req.params.id)
    let a, b: number
    a= chambres.length

    if ((req.session as any).user.role === "admin"){
                    
        chambres = chambres.filter((argument) => argument.numero != id)
        b = chambres.length
        if(a > b){            
            res.status(202)
            res.send({message: "Room deleted", status: "success"}) 
        }           
        else{
            res.status(401)
            res.send({message: "this room doesn't exist", status: "not found"})
        }
    }
    
})


export default router