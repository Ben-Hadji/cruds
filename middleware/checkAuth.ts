import { Role } from "../users/IUser"
import {users} from "../users/UserController"
import { NextFunction, Request, Response } from "express"
import _ from "lodash"

export const isConnected = (req: Request,res: Response,next: NextFunction) =>{
    const connected = _.isEmpty((req.session as any).user)    
    if(!connected){
        res.status(402).json({message : 'You need to connect first'})
    }
}

export const isAdmin = (req: Request,res: Response,next: NextFunction) =>{
    const result =(req.session as any).user?.role === Role.admin 
    next()
    return result
}


export const isEmployee = (req: Request,res: Response,next: NextFunction) =>{
    const result =(req.session as any).user?.role === Role.employee
    next()
    return result
}


export const isClient = (req: Request,res: Response,next: NextFunction) =>{
    const result =(req.session as any).user?.role === Role.client
    next()
    return result
}