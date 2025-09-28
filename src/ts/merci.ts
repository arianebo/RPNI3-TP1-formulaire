const refP = document.getElementById('paragrapheMerci') as HTMLElement;
const urlParams = new URLSearchParams(window.location.search);          //Recherhe Google pour trouver comment aller chercher des infos dans l'url

function modifierParagraphe() {
    if(urlParams.get('type') == 'unique') {
        const strMontant:any = urlParams.get('montantUnique');
        let intMontant:number = parseInt(strMontant);
        const nbLbs = calculerNbLbs(intMontant);

        refP.innerText = 'En donnant ' +intMontant +'$, vous avez éliminé ' +nbLbs +' livres de déchets dans les océans du monde!';
    }

    if(urlParams.get('type') == 'mensuel') {
        const strMontant:any = urlParams.get('montantMensuel');
        let intMontant:number = parseInt(strMontant);
        const nbLbs = calculerNbLbs(intMontant);

        refP.innerText = 'En donnant ' +intMontant +'$ par mois, vous éliminerez ' +nbLbs +' livres de déchets par mois dans les océans du monde!';
    }

}

function calculerNbLbs(montant:number):number {
    return montant / 5;
}

modifierParagraphe();