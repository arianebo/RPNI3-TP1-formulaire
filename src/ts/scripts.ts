
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
const refBtnDonUnique:HTMLElement | null = document.getElementById('btnUnique');
const refBtnDonMensuel:HTMLElement | null = document.getElementById('btnMensuel');
const refFormulaire = document.getElementById('formulaire') as HTMLFormElement;
const refChampEmail = document.getElementById('courriel') as HTMLInputElement;
let messagesErreur:any = [];

function initialiser():void {
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

function changerTypeDon():void {
    if(this.id == refBtnDonMensuel?.id) {
        document.querySelector('#mensuel')?.classList.remove('cacher');
        document.querySelector('#unique')?.classList.add('cacher');
    }
    if(this.id == refBtnDonUnique?.id) {
        document.querySelector('#unique')?.classList.remove('cacher');
        document.querySelector('#mensuel')?.classList.add('cacher');
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

function faireValiderEmail(event:Event) {
    const monInput = event.currentTarget as HTMLInputElement
    validerEmail(monInput);
}

function validerEmail(champ:HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur) as HTMLElement;
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
    } else if(!regEx.test(leEmail) && messagesErreur[id].pattern) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].pattern;
    } else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesErreur[id].type;
    } else if(tldSuspicieux.some((tld => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    }))) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
    } else {
        const valeursCles = Object.keys(erreursCommunes);
        const erreurCle = valeursCles.find((domaine:string) => {
            return leEmail.toLowerCase().includes(domaine);
        });
        if(erreurCle) {
            const domaineCorrect = erreursCommunes[erreurCle];
            const monMessage = messagesErreur[id].erreursCommunes.replace('{domaine}', domaineCorrect);
            valide = false;
            erreurElement.innerText = monMessage;
        } else {
            valide = true;
            erreurElement.innerText = "";
        }
    }

    return valide;
}

function validerEtape(etape:number):boolean {
    let etapeValide:boolean = false;

    switch(etape) {
        case 0:
            etapeValide = validerBtnsMontantDon();
            if(etapeValide) {
                const refSpan = document.getElementById('erreur-btnDonUnique') as HTMLElement;
                refSpan.innerText = "";
            }
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
            const adresseValide = validerEmail(adresseElement);
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

function validerBtnsMontantDon():boolean {
    const refBtnsMontantDon = document.querySelectorAll('input[name=montantUnique]') as NodeListOf<HTMLInputElement>;
    let valide:boolean = false;
    const refSpanErreur = document.getElementById('erreur-btnDonUnique') as HTMLElement;

    refBtnsMontantDon.forEach(btn => {
        if(btn.checked) {
            valide = true;
        } else {
            refSpanErreur.innerText = messagesErreur['btnDonUnique'].vide;
        }
    })
    return valide;
}

// function verifierSubmit(e:Event) {
//     if(validerEtape(intEtape) == false) {
//         console.log(validerEtape)
//         e.preventDefault();
//     }
// }