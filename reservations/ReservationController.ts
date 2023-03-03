import express from "express"
import IReservation from "./IReservation"
import IChambre from "../chambres/IChambre"

let reservations : Array<IReservation> = []

const router = express.Router()

router.get("/reservations", (req, res) => {
    res.status(200)

    if (reservations.length === 0){
        res.send({mesage: "no reservation", status: "empty data"})
    }
    else{
        res.send({mesage: "there are all your reservations", data: reservations})
    }
})

router.post('/createbooking', (req, res) => {
    const reservation: IReservation = {
        cancelled: false,
        chambre: req.body.chambre,
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        ID: reservations.length,
        prix: req.body.prix,
        user: (req.session as any).userID
    }
    
    if ((req.session as any).user.role === "client"){
        if (!reservation.cancelled || !reservation.chambre || ! reservation.dateDebut || !reservation.dateFin || !reservation.prix ){
            res.status(401)
            res.send({message: "All fields must be filled in", status: "Missing info"})
        }
        else{
            if (reservations.length===0){
                reservations.push(reservation)
                res.status(201)
                res.send({message: "Room added", status: "Added"})  
            }  
            reservations.find((predicat) => {
                let a: boolean = (predicat.dateDebut <= reservation.dateDebut && reservation.dateDebut <= predicat.dateFin)
                let b: boolean = (predicat.dateDebut <= reservation.dateFin && reservation.dateFin <= predicat.dateFin)
                let c: boolean = (reservation.dateDebut <= predicat.dateDebut && predicat.dateFin <= reservation.dateFin)
                if(a && b && c){
                    reservations.push(reservation)
                    res.status(201)
                    res.send({message: "Room added", status: "Added"}) 
                }
            })

                        
        }            
    }
    else{
        res.status(401)
        res.send({message: "You're not authorized to add a new Room", status: "Unauthorized"})
    }
})

export default router;