interface IReservation{
    ID: Number;
    dateDebut: Date;
    dateFin: Date;
    prix: Number;
    cancelled: boolean;
    user: Number;
    chambre: Number;
}

export default IReservation