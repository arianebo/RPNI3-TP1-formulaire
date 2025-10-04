"use strict";
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});
// Variables
let intEtape = 0;
const arrFieldsets = document.querySelectorAll('fieldset');
const arrBoutonsSuivants = document.querySelectorAll('.btnSuivant');
const arrBoutonsPrecedents = document.querySelectorAll('.btnPrecedent');
const etape1 = document.getElementById('etape1');
const etape2 = document.getElementById('etape2');
const etape3 = document.getElementById('etape3');
const refBtnDonUnique = document.getElementById('btnUnique');
const refBtnDonMensuel = document.getElementById('btnMensuel');
const refFormulaire = document.getElementById('formulaire');
const refChampEmail = document.getElementById('courriel');
const refBtnsUnique = document.querySelectorAll('input[name=montantUnique]');
const refBtnsMensuel = document.querySelectorAll('input[name=montantMensuel]');
const refBtnUniqueAutre = document.getElementById('uniqueAutre');
const refBtnMensuelAutre = document.getElementById('mensuelAutre');
const refBtnPersonnel = document.getElementById('personnel');
const refBtnEntreprise = document.getElementById('entreprise');
const refNavLien1 = document.getElementById('navLien1');
const refNavLien2 = document.getElementById('navLien2');
const refNavLien3 = document.getElementById('navLien3');
let messagesErreur = [];
// Fonctions
// Initialisation
function initialiser() {
    cacherFieldsets();
    etape1?.classList.remove('cacher');
    document.querySelector('#mensuel')?.classList.add('cacher');
    document.getElementById('uniqueAutreMontant')?.classList.add('cacher');
    document.querySelector('.sousSection--entreprise')?.classList.add('cacher');
    refFormulaire.noValidate = true;
    obtenirMessages();
    refBtnDonUnique?.addEventListener('click', changerTypeDon);
    refBtnDonMensuel?.addEventListener('click', changerTypeDon);
    refBtnPersonnel?.addEventListener('click', changerTypeDon);
    refBtnEntreprise?.addEventListener('click', changerTypeDon);
    refBtnsUnique.forEach(btn => {
        btn.addEventListener('click', afficherChamp);
    });
    refBtnsMensuel.forEach(btn => {
        btn.addEventListener('click', afficherChamp);
    });
    arrBoutonsSuivants.forEach((element) => {
        element.addEventListener('click', naviguerSuivant);
    });
    arrBoutonsPrecedents.forEach((element) => {
        element.addEventListener('click', naviguerPrecedent);
    });
    refChampEmail.addEventListener('blur', faireValiderEmail);
    refNavLien1.addEventListener('click', naviguerPrecedent);
    refNavLien2.addEventListener('click', naviguerPrecedent);
    refNavLien3.addEventListener('click', naviguerPrecedent);
}
// Naviguer suivant
function naviguerSuivant() {
    const etapeValide = validerEtape(intEtape);
    if (etapeValide && intEtape < 3) {
        let idEtape = 'navLien' + (intEtape + 1);
        let etapeCourante = document.getElementById(idEtape);
        let refImg = document.getElementById(idEtape + '--img');
        refImg.src = 'images/icone-check.svg';
        etapeCourante.removeAttribute('aria-current');
        intEtape++;
        changerEtape(intEtape);
    }
    if (intEtape == 3) {
        afficherInfos();
    }
}
// Naviguer précédent
function naviguerPrecedent() {
    if (intEtape != 0) {
        let idEtape = 'navLien' + (intEtape + 1);
        let etapeCourante = document.getElementById(idEtape);
        let refImg = document.getElementById(idEtape + '--img');
        let strClick = this.id;
        let idClick = strClick.substring(7);
        if (idClick != (intEtape + 1)) {
            console.log(idClick);
            refImg.src = 'images/icone-ligne.svg';
            etapeCourante.classList.remove('navigation__item--active');
            etapeCourante.classList.add('navigation__item--inactive');
            etapeCourante.setAttribute('aria-disabled', 'true');
            etapeCourante.removeAttribute('aria-current');
            intEtape--;
            changerEtape(intEtape);
        }
    }
}
// Afficher l'étape courante
function changerEtape(etape) {
    cacherFieldsets();
    arrFieldsets[etape].classList.remove('cacher');
    let idEtape = 'navLien' + (intEtape + 1);
    let etapeCourante = document.getElementById(idEtape);
    let refImg = document.getElementById(idEtape + '--img');
    refImg.src = 'images/icone-tortue.svg';
    refImg.classList.remove('cacher');
    console.log(etapeCourante);
    etapeCourante.setAttribute('aria-current', 'step');
    etapeCourante.classList.add('navigation__item--active');
    etapeCourante.classList.remove('navigation__item--inactive');
    etapeCourante.setAttribute('aria-disabled', 'false');
}
// Cacher toutes les sections d'étapes
function cacherFieldsets() {
    for (let intCpt = 0; intCpt < arrFieldsets.length; intCpt++) {
        arrFieldsets[intCpt].classList.add('cacher');
    }
}
// Obtenir le JSON de messages d'erreur
async function obtenirMessages() {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json();
}
// Valider les champs
function validerChamp(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const idImgMessageErreur = idMessageErreur + '--img';
    const erreurElement = document.getElementById(idMessageErreur);
    const imgErreurElement = document.getElementById(idImgMessageErreur);
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        console.log('erreur', id);
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].type;
    }
    else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].pattern;
    }
    else {
        valide = true;
        champ.classList.remove('erreurChamp');
        imgErreurElement.classList.add('cacher');
        erreurElement.innerHTML = "";
    }
    return valide;
}
function faireValiderEmail(event) {
    const monInput = event.currentTarget;
    validerEmail(monInput);
}
// Valider le champ courriel
function validerEmail(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const imgErreurElement = document.getElementById(idMessageErreur + '--img');
    const leEmail = champ.value;
    const regEx = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    const tldSuspicieux = [
        '.ru',
        '.cn',
        '.click',
        '.party'
    ];
    const erreursCommunes = {
        'hotnail': 'hotmail',
        'gnail': 'gmail',
        'yahooo': 'yahoo'
    };
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (!regEx.test(leEmail) && messagesErreur[id].pattern) {
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].pattern;
    }
    else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].type;
    }
    else if (tldSuspicieux.some((tld => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    }))) {
        valide = false;
        champ.classList.remove('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
    }
    else {
        const valeursCles = Object.keys(erreursCommunes);
        const erreurCle = valeursCles.find((domaine) => {
            return leEmail.toLowerCase().includes(domaine);
        });
        if (erreurCle) {
            const domaineCorrect = erreursCommunes[erreurCle];
            const monMessage = messagesErreur[id].erreursCommunes.replace('{domaine}', domaineCorrect);
            valide = false;
            champ.classList.add('erreurChamp');
            imgErreurElement.classList.remove('cacher');
            erreurElement.innerText = monMessage;
        }
        else {
            valide = true;
            champ.classList.remove('erreurChamp');
            imgErreurElement.classList.add('cacher');
            erreurElement.innerText = "";
        }
    }
    return valide;
}
// Affiche ou cache la section selon quel bouton a été sélectionné (don unique ou mensuel / don personnel ou entreprise)
function changerTypeDon() {
    const refSpanErreur = document.getElementById('erreur-btnsTypeDon');
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img');
    // Si le id du bouton est celui du bouton de don mensuel
    if (this.id == refBtnDonMensuel?.id) {
        document.querySelector('#mensuel')?.classList.remove('cacher');
        document.querySelector('#unique')?.classList.add('cacher');
        document.getElementById('mensuelAutreMontant')?.classList.add('cacher');
        document.getElementById('divUnique')?.classList.remove('btnSelectionne');
        document.getElementById('divMensuel')?.classList.add('btnSelectionne');
        const refListeBtns = document.querySelectorAll('input[name=montantUnique]');
        refListeBtns.forEach(btn => {
            btn.checked = false;
        });
    }
    // Si le id du bouton est celui du bouton de don unique
    if (this.id == refBtnDonUnique?.id) {
        document.querySelector('#unique')?.classList.remove('cacher');
        document.querySelector('#mensuel')?.classList.add('cacher');
        document.getElementById('uniqueAutreMontant')?.classList.add('cacher');
        document.getElementById('divUnique')?.classList.add('btnSelectionne');
        document.getElementById('divMensuel')?.classList.remove('btnSelectionne');
        const refListeBtns = document.querySelectorAll('input[name=montantMensuel]');
        refListeBtns.forEach(btn => {
            btn.checked = false;
        });
    }
    // Si le id du bouton est celui du bouton de type de don personnel
    if (this.id == refBtnPersonnel?.id) {
        document.querySelector('.sousSection--entreprise')?.classList.add('cacher');
        document.querySelector('.personnel')?.classList.remove('cacher');
        document.getElementById('divPersonnel')?.classList.add('btnSelectionne');
        document.getElementById('divEntreprise')?.classList.remove('btnSelectionne');
        const refChamp = document.getElementById('nomEntreprise');
        refChamp.value = "";
    }
    // Si le id du bouton est celui du bouton de type de don entreprise
    if (this.id == refBtnEntreprise?.id) {
        document.querySelector('.sousSection--entreprise')?.classList.remove('cacher');
        document.querySelector('.personnel')?.classList.add('cacher');
        document.getElementById('divPersonnel')?.classList.remove('btnSelectionne');
        document.getElementById('divEntreprise')?.classList.add('btnSelectionne');
    }
    refSpanErreur.innerText = '';
    refImgErreur.classList.add('cacher');
}
// Afficher les champs selon le id du bouton (champs de don unique ou mensuel)
function afficherChamp() {
    const refChampUnique = document.getElementById('uniqueAutreMontant');
    const refChampMensuel = document.getElementById('mensuelAutreMontant');
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img');
    if (this.id == refBtnUniqueAutre?.id) {
        refChampUnique.classList.remove('cacher');
    }
    else if (this.id == refBtnMensuelAutre?.id) {
        refChampMensuel.classList.remove('cacher');
    }
    else {
        refChampUnique.classList.add('cacher');
        refChampMensuel.classList.add('cacher');
        refChampUnique.value = "";
        refChampMensuel.value = "";
        const refChampErreur = document.getElementById('erreur-btnsTypeDon');
        refChampErreur.innerText = "";
        refImgErreur.classList.add('cacher');
    }
}
// Valide si un bouton radio a été sélectionné (don unique ou mensuel)
function validerBtnsMontantDon() {
    const refBtnsMontantDonUnique = document.querySelectorAll('input[name=montantUnique]');
    const refBtnsMontantDonMensuel = document.querySelectorAll('input[name=montantMensuel]');
    const refSpanErreur = document.getElementById('erreur-btnsTypeDon');
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img');
    const arrBtnsDonUnique = Array.from(refBtnsMontantDonUnique);
    const arrBtnsDonMensuel = Array.from(refBtnsMontantDonMensuel);
    const arrBtnsDon = arrBtnsDonUnique.concat(arrBtnsDonMensuel); //Recherches sur internet pour trouver comment joindre 2 array
    let valide = false;
    arrBtnsDon.forEach(btn => {
        if (btn.checked) {
            refImgErreur.classList.add('cacher');
            valide = true;
        }
        else {
            refImgErreur.classList.remove('cacher');
            refSpanErreur.innerText = messagesErreur['btnsTypeDon'].vide;
        }
    });
    return valide;
}
// Valide les champs de montant autre (don unique ou mensuel)
function validerChampAutre() {
    let refBtnSelectionneUnique = document.querySelector('input[name=montantUnique]:checked');
    let refBtnSelectionneMensuel = document.querySelector('input[name=montantMensuel]:checked');
    const refMessageErreur = document.getElementById('erreur-btnsTypeDon');
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img');
    let valide = false;
    if (refBtnSelectionneUnique != null && refBtnSelectionneUnique.id == 'uniqueAutre') {
        const refChamp = document.getElementById('uniqueAutreMontant');
        if (refChamp.value != "") {
            if (refChamp.value == '0') {
                refChamp.classList.add('erreurChamp');
                refImgErreur.classList.remove('cacher');
                refMessageErreur.innerText = messagesErreur['autreMontant'].pattern;
            }
            else {
                valide = true;
                refChamp.classList.remove('erreurChamp');
                refImgErreur.classList.add('cacher');
                refMessageErreur.innerText = "";
            }
        }
        else {
            valide = false;
            refChamp.classList.add('erreurChamp');
            refImgErreur.classList.remove('cacher');
            refMessageErreur.innerText = messagesErreur['autreMontant'].vide;
        }
    }
    else if (refBtnSelectionneMensuel != null && refBtnSelectionneMensuel.id == 'mensuelAutre') {
        const refChamp = document.getElementById('mensuelAutreMontant');
        if (refChamp.value != "") {
            if (refChamp.value == '0') {
                refChamp.classList.add('erreurChamp');
                refImgErreur.classList.remove('cacher');
                refMessageErreur.innerText = messagesErreur['autreMontant'].pattern;
            }
            else {
                valide = true;
                refChamp.classList.remove('erreurChamp');
                refImgErreur.classList.add('cacher');
                refMessageErreur.innerText = "";
            }
        }
        else {
            valide = false;
            refChamp.classList.add('erreurChamp');
            refImgErreur.classList.remove('cacher');
            refMessageErreur.innerText = messagesErreur['autreMontant'].vide;
        }
    }
    return valide;
}
// Affiche le montant de don sélectionné sur le bouton submit du formulaire
function afficherMontantDon() {
    const refBtnSubmit = document.getElementById('btnSubmit');
    const arrBtnsDonUnique = Array.from(refBtnsUnique);
    const arrBtnsDonMensuel = Array.from(refBtnsMensuel);
    const arrBtnsDon = arrBtnsDonUnique.concat(arrBtnsDonMensuel);
    const refPMontant = document.getElementById('pMontant');
    const refChampCacheMontant = document.getElementById('champCacheMontant');
    arrBtnsDon.forEach(btn => {
        if (btn.checked) {
            let montant;
            if (btn.value == 'autre') {
                const idBtn = btn.id;
                const refChamp = document.getElementById(idBtn + 'Montant');
                montant = refChamp.value;
            }
            else {
                montant = btn.value;
            }
            if (btn.name == 'montantUnique') {
                refBtnSubmit.value = 'Payer un don de ' + montant + ' $';
                refPMontant.innerText = 'Montant : ' + montant + ' $';
                refChampCacheMontant.value = montant;
            }
            else if (btn.name == 'montantMensuel') {
                refBtnSubmit.value = 'Payer un don de ' + montant + ' $ par mois';
                refPMontant.innerText = 'Montant : ' + montant + ' $ par mois';
                refChampCacheMontant.value = montant;
            }
        }
    });
}
// Valide chaque étape selon le numéro d'étape courante
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        // Valide l'étape 1
        case 0:
            if (validerBtnsMontantDon()) {
                const refSpan = document.getElementById('erreur-btnsTypeDon');
                const refImgErreur = document.getElementById('erreur-btnsTypeDon--img');
                refImgErreur.classList.add('cacher');
                refSpan.innerText = "";
                let refBtnSelectionneUnique = document.querySelector('input[name=montantUnique]:checked');
                let refBtnSelectionneMensuel = document.querySelector('input[name=montantMensuel]:checked');
                if (refBtnSelectionneUnique != null && refBtnSelectionneUnique.id == 'uniqueAutre' || refBtnSelectionneMensuel != null && refBtnSelectionneMensuel.id == 'mensuelAutre') {
                    etapeValide = validerChampAutre();
                }
                else {
                    etapeValide = true;
                }
            }
            afficherMontantDon();
            break;
        // Valide l'étape 2
        case 1:
            const nomEntrepriseElement = document.getElementById('nomEntreprise');
            const nomElement = document.getElementById('nom');
            const prenomElement = document.getElementById('prenom');
            const courrielElement = document.getElementById('courriel');
            const adresseElement = document.getElementById('adresse');
            const villeElement = document.getElementById('ville');
            const provinceElement = document.getElementById('provinces');
            const paysElement = document.getElementById('pays');
            const codePostalElement = document.getElementById('codePostal');
            const btnCoche = document.querySelector('input[name=typeDon]:checked');
            let nomEntrepriseValide = true;
            if (btnCoche.id == 'entreprise') {
                nomEntrepriseValide = validerChamp(nomEntrepriseElement);
            }
            const nomValide = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const courrielValide = validerEmail(courrielElement);
            const adresseValide = validerChamp(adresseElement);
            const villeValide = validerChamp(villeElement);
            const provinceValide = validerChamp(provinceElement);
            const paysValide = validerChamp(paysElement);
            const codePostalValide = validerChamp(codePostalElement);
            if (!nomValide || !prenomValide || !courrielValide || !adresseValide || !villeValide || !provinceValide || !paysValide || !codePostalValide || !nomEntrepriseValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
            }
            break;
        // Valide l'étape 3
        case 2:
            const titulaireElement = document.getElementById('titulaire');
            const carteElement = document.getElementById('carte');
            const expirationElement = document.getElementById('expiration');
            const cvcElement = document.getElementById('cvc');
            const titulaireValide = validerChamp(titulaireElement);
            const carteValide = validerChamp(carteElement);
            const expirationValide = validerChamp(expirationElement);
            const cvcValide = validerChamp(cvcElement);
            if (!titulaireValide || !carteValide || !expirationValide || !cvcValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
            }
            break;
    }
    return etapeValide;
}
// Affiche les informations entrées dans le résumé
function afficherInfos() {
    const refPNom = document.getElementById('pNom');
    const refPNomEntreprise = document.getElementById('pNomEntreprise');
    const refPCarte = document.getElementById('pCarte');
    const refChampPrenom = document.getElementById('prenom');
    const refChampNom = document.getElementById('nom');
    const refChampEntreprise = document.getElementById('nomEntreprise');
    const refChampCarte = document.getElementById('carte');
    let strCarte = refChampCarte.value;
    let strCarteCourte = strCarte.substring(12, 16);
    refPNomEntreprise.innerText = '';
    if (refChampEntreprise.value != '') {
        refPNomEntreprise.innerText = "Nom de l'entreprise : " + refChampEntreprise.value;
    }
    refPNom.innerText = 'Nom du donateur : ' + refChampPrenom.value + ' ' + refChampNom.value;
    refPCarte.innerText = "Numéro de carte : **** " + strCarteCourte;
}
