"use strict";
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});
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
let messagesErreur = [];
function initialiser() {
    cacherFieldsets();
    etape1?.classList.remove('cacher');
    document.querySelector('#mensuel')?.classList.add('cacher');
    refFormulaire.noValidate = true;
    obtenirMessages();
    refBtnDonUnique?.addEventListener('click', changerTypeDon);
    refBtnDonMensuel?.addEventListener('click', changerTypeDon);
    arrBoutonsSuivants.forEach((element) => {
        element.addEventListener('click', naviguerSuivant);
    });
    arrBoutonsPrecedents.forEach((element) => {
        element.addEventListener('click', naviguerPrecedent);
    });
    refChampEmail.addEventListener('change', faireValiderEmail);
    // refFormulaire.addEventListener('submit', verifierSubmit);
}
function changerTypeDon() {
    if (this.id == refBtnDonMensuel?.id) {
        document.querySelector('#mensuel')?.classList.remove('cacher');
        document.querySelector('#unique')?.classList.add('cacher');
    }
    if (this.id == refBtnDonUnique?.id) {
        document.querySelector('#unique')?.classList.remove('cacher');
        document.querySelector('#mensuel')?.classList.add('cacher');
    }
}
function naviguerSuivant() {
    const etapeValide = validerEtape(intEtape);
    if (etapeValide) {
        intEtape++;
        changerEtape(intEtape);
    }
}
function naviguerPrecedent() {
    if (intEtape != 0) {
        intEtape--;
        changerEtape(intEtape);
    }
}
function changerEtape(etape) {
    cacherFieldsets();
    arrFieldsets[etape].classList.remove('cacher');
}
function cacherFieldsets() {
    for (let intCpt = 0; intCpt < arrFieldsets.length; intCpt++) {
        arrFieldsets[intCpt].classList.add('cacher');
    }
}
async function obtenirMessages() {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json();
}
function validerChamp(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    console.log('valider champ', champ.validity);
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        console.log('erreur', id);
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesErreur[id].type;
    }
    else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        erreurElement.innerText = messagesErreur[id].pattern;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
function faireValiderEmail(event) {
    const monInput = event.currentTarget;
    validerEmail(monInput);
}
function validerEmail(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur);
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
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (!regEx.test(leEmail) && messagesErreur[id].pattern) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].pattern;
    }
    else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesErreur[id].type;
    }
    else if (tldSuspicieux.some((tld => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    }))) {
        valide = false;
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
            erreurElement.innerText = monMessage;
        }
        else {
            valide = true;
            erreurElement.innerText = "";
        }
    }
    return valide;
}
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        case 0:
            etapeValide = validerBtnsMontantDon();
            if (etapeValide) {
                const refSpan = document.getElementById('erreur-btnDonUnique');
                refSpan.innerText = "";
            }
            break;
        case 1:
            const nomElement = document.getElementById('nom');
            const prenomElement = document.getElementById('prenom');
            const courrielElement = document.getElementById('courriel');
            const adresseElement = document.getElementById('adresse');
            const villeElement = document.getElementById('ville');
            // const provinceElement = document.getElementById('provinces') as HTMLInputElement;
            const paysElement = document.getElementById('pays');
            const codePostalElement = document.getElementById('codePostal');
            const nomValide = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const courrielValide = validerChamp(courrielElement);
            const adresseValide = validerEmail(adresseElement);
            const villeValide = validerChamp(villeElement);
            // const provinceValide = validerChamp(provinceElement);
            const paysValide = validerChamp(paysElement);
            const codePostalValide = validerChamp(codePostalElement);
            if (!nomValide || !prenomValide || !courrielValide || !adresseValide || !villeValide || !paysValide || !codePostalValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
            }
            break;
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
function validerBtnsMontantDon() {
    const refBtnsMontantDon = document.querySelectorAll('input[name=montantUnique]');
    let valide = false;
    const refSpanErreur = document.getElementById('erreur-btnDonUnique');
    refBtnsMontantDon.forEach(btn => {
        if (btn.checked) {
            valide = true;
        }
        else {
            refSpanErreur.innerText = messagesErreur['btnDonUnique'].vide;
        }
    });
    return valide;
}
// function verifierSubmit(e:Event) {
//     if(validerEtape(intEtape) == false) {
//         console.log(validerEtape)
//         e.preventDefault();
//     }
// }
