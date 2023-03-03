interface IUser{
    userID: Number;
    nom: string;
    prenom: string; 
    role: Role;
    userName: string;
    password: string;
}

export default IUser

export enum Role{
    admin = "admin",
    employee = "employee",
    client = "client"
}