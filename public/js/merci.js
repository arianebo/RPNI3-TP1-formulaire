"use strict";
const refP = document.getElementById('paragrapheMerci');
const urlParams = new URLSearchParams(window.location.search); //Recherhe Google pour trouver comment aller chercher des infos dans l'url
function modifierParagraphe() {
    if (urlParams.get('type') == 'unique') {
        const strMontant = urlParams.get('montantUnique');
        let intMontant = parseInt(strMontant);
        const nbLbs = calculerNbLbs(intMontant);
        refP.innerText = 'En donnant ' + intMontant + '$, vous avez éliminé ' + nbLbs + ' livres de déchets dans les océans du monde!';
    }
    if (urlParams.get('type') == 'mensuel') {
        const strMontant = urlParams.get('montantMensuel');
        let intMontant = parseInt(strMontant);
        const nbLbs = calculerNbLbs(intMontant);
        refP.innerText = 'En donnant ' + intMontant + '$ par mois, vous éliminerez ' + nbLbs + ' livres de déchets par mois dans les océans du monde!';
    }
}
function calculerNbLbs(montant) {
    return montant / 5;
}
modifierParagraphe();
