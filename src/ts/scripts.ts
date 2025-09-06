
document.addEventListener('DOMContentLoaded', () =>{
    initialiser();
})

let intEtape:number = 0;
const arrFieldsets:NodeListOf<HTMLFieldSetElement> = document.querySelectorAll('fieldset');
const arrBoutonsSuivants:NodeListOf<HTMLButtonElement> = document.querySelectorAll('.btnSuivant');
const arrBoutonsPrecedents:NodeListOf<HTMLButtonElement> = document.querySelectorAll('.btnPrecedent');
const etape1:HTMLElement | null = document.getElementById('etape1');
const etape2:HTMLElement | null = document.getElementById('etape2');
const etape3:HTMLElement | null = document.getElementById('etape3');
const refBtnDonUnique:HTMLElement | null = document.getElementById('unique');
const refBtnDonMensuel:HTMLElement | null = document.getElementById('mensuel');
const refFormulaire = document.getElementById('formulaire') as HTMLFormElement;
let messagesErreur:any = [];

refBtnDonUnique?.addEventListener('click', changerTypeDon);
refBtnDonMensuel?.addEventListener('click', changerTypeDon);
arrBoutonsSuivants.forEach((element) => {
    element.addEventListener('click', naviguerSuivant);
});
arrBoutonsPrecedents.forEach((element) => {
    element.addEventListener('click', naviguerPrecedent);
});
// refFormulaire.addEventListener('submit', verifierSubmit);

function initialiser():void {
    cacherFieldsets();
    etape1?.classList.remove('cacher');
    document.querySelector('.mensuel')?.classList.add('cacher');
    refFormulaire.noValidate = true;
    obtenirMessages();
}

function changerTypeDon():void {
    if(this.id == refBtnDonMensuel?.id) {
        document.querySelector('.mensuel')?.classList.remove('cacher');
        document.querySelector('.unique')?.classList.add('cacher');
    }
    if(this.id == refBtnDonUnique?.id) {
        document.querySelector('.unique')?.classList.remove('cacher');
        document.querySelector('.mensuel')?.classList.add('cacher');
    }
}

function naviguerSuivant():void {
    const etapeValide = validerEtape(intEtape);
    if(etapeValide) {
        intEtape++;
        changerEtape(intEtape);
    }
}

function naviguerPrecedent():void {
    if(intEtape != 0) {
        intEtape--;
        changerEtape(intEtape);
    }
}

function changerEtape(etape:number):void {
    cacherFieldsets();
    arrFieldsets[etape].classList.remove('cacher');
}

function cacherFieldsets():void {
    for(let intCpt = 0; intCpt < arrFieldsets.length; intCpt++) {
        arrFieldsets[intCpt].classList.add('cacher');
    }
}

async function obtenirMessages():Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json();
}

function validerChamp(champ:HTMLInputElement):boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur) as HTMLElement;

    console.log('valider champ', champ.validity);
    

    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        console.log('erreur', id);
        
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    } else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesErreur[id].type;
    } else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        erreurElement.innerText = messagesErreur[id].pattern;
    } else {
        valide = true;
        erreurElement.innerText = "";
    }

    return valide;
}

function validerEtape(etape:number):boolean {
    let etapeValide = false;

    switch(etape) {
        case 0:
            etapeValide = true;
        break;

        case 1:
            const nomElement = document.getElementById('nom') as HTMLInputElement;
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const courrielElement = document.getElementById('courriel') as HTMLInputElement;
            const adresseElement = document.getElementById('adresse') as HTMLInputElement;
            const villeElement = document.getElementById('ville') as HTMLInputElement;
            // const provinceElement = document.getElementById('provinces') as HTMLInputElement;
            const paysElement = document.getElementById('pays') as HTMLInputElement;
            const codePostalElement = document.getElementById('codePostal') as HTMLInputElement;

            const nomValide  = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const courrielValide = validerChamp(courrielElement);
            const adresseValide = validerChamp(adresseElement);
            const villeValide = validerChamp(villeElement);
            // const provinceValide = validerChamp(provinceElement);
            const paysValide = validerChamp(paysElement);
            const codePostalValide = validerChamp(codePostalElement);

            if(!nomValide || !prenomValide || !courrielValide || !adresseValide || !villeValide || !paysValide || !codePostalValide) {
                etapeValide = false;
            } else{
                etapeValide = true;
            }

        break;

        case 2:
            const titulaireElement = document.getElementById('titulaire') as HTMLInputElement;
            const carteElement = document.getElementById('carte') as HTMLInputElement;
            const expirationElement = document.getElementById('expiration') as HTMLInputElement;
            const cvcElement = document.getElementById('cvc') as HTMLInputElement;

            const titulaireValide  = validerChamp(titulaireElement);
            const carteValide = validerChamp(carteElement);
            const expirationValide = validerChamp(expirationElement);
            const cvcValide = validerChamp(cvcElement);

            if(!titulaireValide || !carteValide || !expirationValide || !cvcValide) {
                etapeValide = false;
            } else{
                etapeValide = true;
            }
        break;
    }
    
    return etapeValide;
}

// function verifierSubmit(e:Event) {
//     if(validerEtape(intEtape) == false) {
//         console.log(validerEtape)
//         e.preventDefault();
//     }
// }