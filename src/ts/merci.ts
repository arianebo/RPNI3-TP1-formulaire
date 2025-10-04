const refP = document.getElementById('paragrapheMerci') as HTMLElement;
const urlParams = new URLSearchParams(window.location.search);          //Recherhe Google pour trouver comment aller chercher des infos dans l'url

// Modifier le texte du paragraphe pour afficher le montant du don
function modifierParagraphe() {
    if(urlParams.get('type') == 'unique') {
        let intMontant:number;
        if(urlParams.get('montantUnique') == 'autre') {
            let strMontant = urlParams.get('montantFinal');
            intMontant = parseInt(strMontant);
        } else {
            let strMontant = urlParams.get('montantUnique');
            intMontant = parseInt(strMontant);
        }
        const nbLbs = calculerNbLbs(intMontant);

        refP.innerText = 'En donnant ' +intMontant +'$, vous avez éliminé ' +nbLbs +' livres de déchets dans les océans du monde!';
    }

    if(urlParams.get('type') == 'mensuel') {
        let intMontant:number;
        if(urlParams.get('montantMensuel') == 'autre') {
            let strMontant = urlParams.get('montantFinal');
            intMontant = parseInt(strMontant);
        } else {
            let strMontant = urlParams.get('montantMensuel');
            intMontant = parseInt(strMontant);
        }
        const nbLbs = calculerNbLbs(intMontant);

        refP.innerText = 'En donnant ' +intMontant +'$ par mois, vous éliminerez ' +nbLbs +' lbs de déchets par mois dans les océans du monde!';
    }

}

// Calculer le nombre de lbs enlevé selon le montant donné
function calculerNbLbs(montant:number):number {
    return montant / 5;
}

modifierParagraphe();