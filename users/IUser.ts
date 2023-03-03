interface IUser{
    userID: Number;
    nom: string;
    prenom: string; 
    role: "admin" | "employe" | "client";
    userName: string;
    password: string;
}

export default IUser