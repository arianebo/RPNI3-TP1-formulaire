
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
})

// Variables
let intEtape: number = 0;
const arrFieldsets: NodeListOf<HTMLFieldSetElement> = document.querySelectorAll('fieldset');
const arrBoutonsSuivants: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.btnSuivant');
const arrBoutonsPrecedents: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.btnPrecedent');
const etape1: HTMLElement | null = document.getElementById('etape1');
const etape2: HTMLElement | null = document.getElementById('etape2');
const etape3: HTMLElement | null = document.getElementById('etape3');
const refBtnDonUnique: HTMLElement | null = document.getElementById('btnUnique');
const refBtnDonMensuel: HTMLElement | null = document.getElementById('btnMensuel');
const refFormulaire = document.getElementById('formulaire') as HTMLFormElement;
const refChampEmail = document.getElementById('courriel') as HTMLInputElement;
const refBtnsUnique = document.querySelectorAll('input[name=montantUnique]') as NodeListOf<HTMLInputElement>;
const refBtnsMensuel = document.querySelectorAll('input[name=montantMensuel]') as NodeListOf<HTMLInputElement>;
const refBtnUniqueAutre = document.getElementById('uniqueAutre');
const refBtnMensuelAutre = document.getElementById('mensuelAutre');
const refBtnPersonnel = document.getElementById('personnel');
const refBtnEntreprise = document.getElementById('entreprise');
const refNavLien1 = document.getElementById('navLien1') as HTMLElement;
const refNavLien2 = document.getElementById('navLien2') as HTMLElement;
let messagesErreur: any = [];

// Fonctions

function initialiser(): void {
    // Initialisation
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
    })
    refBtnsMensuel.forEach(btn => {
        btn.addEventListener('click', afficherChamp);
    })
    arrBoutonsSuivants.forEach((element) => {
        element.addEventListener('click', naviguerSuivant);
    });
    arrBoutonsPrecedents.forEach((element) => {
        element.addEventListener('click', naviguerPrecedent);
    });

    refChampEmail.addEventListener('blur', faireValiderEmail);
    refFormulaire.addEventListener('submit', verifierSubmit);

    refNavLien1.addEventListener('click', naviguerPrecedent);
    refNavLien2.addEventListener('click', naviguerPrecedent);
}

function changerTypeDon(): void {
    // Affiche ou cache des éléments selon quel bouton a été sélectionné
    const refSpanErreur = document.getElementById('erreur-btnsTypeDon') as HTMLElement;
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img') as HTMLImageElement;

    if (this.id == refBtnDonMensuel?.id) {
        document.querySelector('#mensuel')?.classList.remove('cacher');
        document.querySelector('#unique')?.classList.add('cacher');
        document.getElementById('mensuelAutreMontant')?.classList.add('cacher');
        document.getElementById('divUnique')?.classList.remove('btnSelectionne');
        document.getElementById('divMensuel')?.classList.add('btnSelectionne');
        const refListeBtns = document.querySelectorAll('input[name=montantUnique]') as NodeListOf<HTMLInputElement>;
        refListeBtns.forEach(btn => {
            btn.checked = false;
        });
    }
    if (this.id == refBtnDonUnique?.id) {
        document.querySelector('#unique')?.classList.remove('cacher');
        document.querySelector('#mensuel')?.classList.add('cacher');
        document.getElementById('uniqueAutreMontant')?.classList.add('cacher');
        document.getElementById('divUnique')?.classList.add('btnSelectionne');
        document.getElementById('divMensuel')?.classList.remove('btnSelectionne');
        const refListeBtns = document.querySelectorAll('input[name=montantMensuel]') as NodeListOf<HTMLInputElement>;
        refListeBtns.forEach(btn => {
            btn.checked = false;
        });
    }

    if (this.id == refBtnPersonnel?.id) {
        document.querySelector('.sousSection--entreprise')?.classList.add('cacher');
        document.querySelector('.personnel')?.classList.remove('cacher');
        document.getElementById('divPersonnel')?.classList.add('btnSelectionne');
        document.getElementById('divEntreprise')?.classList.remove('btnSelectionne');
        const refChamp = document.getElementById('nomEntreprise') as HTMLInputElement;
        refChamp.value = "";
    }
    if (this.id == refBtnEntreprise?.id) {
        document.querySelector('.sousSection--entreprise')?.classList.remove('cacher');
        document.querySelector('.personnel')?.classList.add('cacher');
        document.getElementById('divPersonnel')?.classList.remove('btnSelectionne');
        document.getElementById('divEntreprise')?.classList.add('btnSelectionne');
    }

    refSpanErreur.innerText = '';
    refImgErreur.classList.add('cacher');
}

function afficherChamp(): void {
    const refChampUnique = document.getElementById('uniqueAutreMontant') as HTMLInputElement;
    const refChampMensuel = document.getElementById('mensuelAutreMontant') as HTMLInputElement;
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img') as HTMLImageElement;

    if (this.id == refBtnUniqueAutre?.id) {
        refChampUnique.classList.remove('cacher');
    } else if (this.id == refBtnMensuelAutre?.id) {
        refChampMensuel.classList.remove('cacher');
    } else {
        refChampUnique.classList.add('cacher');
        refChampMensuel.classList.add('cacher');
        refChampUnique.value = "";
        refChampMensuel.value = "";
        const refChampErreur = document.getElementById('erreur-btnsTypeDon') as HTMLInputElement;
        refChampErreur.innerText = "";
        refImgErreur.classList.add('cacher');
    }
}

function naviguerSuivant(): void {
    const etapeValide = validerEtape(intEtape);
    if (etapeValide && intEtape < 2) {
        let idEtape = 'navLien' + (intEtape+1);
        let etapeCourante = document.getElementById(idEtape) as HTMLElement;
        let refImg = document.getElementById(idEtape+'--img') as HTMLImageElement;
        refImg.src = 'images/icone-check.svg';
        etapeCourante.removeAttribute('aria-current');

        intEtape++;
        changerEtape(intEtape);
    }
}

function naviguerPrecedent(): void {
    if (intEtape != 0) {
        let idEtape = 'navLien' + (intEtape+1);
        let etapeCourante = document.getElementById(idEtape) as HTMLElement;
        let refImg = document.getElementById(idEtape+'--img') as HTMLImageElement;
        refImg.src = 'images/icone-ligne.svg';
        etapeCourante.classList.remove('navigation__item--active');
        etapeCourante.classList.add('navigation__item--inactive');
        etapeCourante.setAttribute('aria-disabled', 'true');
        etapeCourante.removeAttribute('aria-current');

        intEtape--;
        changerEtape(intEtape);
    }
}

function changerEtape(etape: number): void {
    cacherFieldsets();
    arrFieldsets[etape].classList.remove('cacher');

    let idEtape = 'navLien' + (intEtape+1);
    let etapeCourante = document.getElementById(idEtape) as HTMLElement;
    let refImg = document.getElementById(idEtape+'--img') as HTMLImageElement;
    refImg.src = 'images/icone-tortue.svg';
    refImg.classList.remove('cacher');
    etapeCourante.setAttribute('aria-current', 'step');
    etapeCourante.classList.add('navigation__item--active');
    etapeCourante.classList.remove('navigation__item--inactive');
    etapeCourante.setAttribute('aria-disabled', 'false');
}

function cacherFieldsets(): void {
    for (let intCpt = 0; intCpt < arrFieldsets.length; intCpt++) {
        arrFieldsets[intCpt].classList.add('cacher');
    }
}

async function obtenirMessages(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json();
}

function validerChamp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const idImgMessageErreur = idMessageErreur + '--img';
    const erreurElement = document.getElementById(idMessageErreur) as HTMLElement;
    const imgErreurElement = document.getElementById(idImgMessageErreur) as HTMLImageElement;

    // console.log('valider champ', champ.validity, imgErreurElement);

    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        console.log('erreur', id);

        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].vide;
    } else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].type;
    } else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].pattern;
    } else {
        valide = true;
        champ.classList.remove('erreurChamp');
        imgErreurElement.classList.add('cacher');
        erreurElement.innerHTML = "";
    }

    return valide;
}

function faireValiderEmail(event: Event) {
    const monInput = event.currentTarget as HTMLInputElement
    validerEmail(monInput);
}

function validerEmail(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur-" + id;
    const erreurElement = document.getElementById(idMessageErreur) as HTMLElement;
    const imgErreurElement = document.getElementById(idMessageErreur+'--img') as HTMLImageElement;
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
    } else if (!regEx.test(leEmail) && messagesErreur[id].pattern) {
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].pattern;
    } else if (champ.validity.typeMismatch && messagesErreur[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        champ.classList.add('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].type;
    } else if (tldSuspicieux.some((tld => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    }))) {
        valide = false;
        champ.classList.remove('erreurChamp');
        imgErreurElement.classList.remove('cacher');
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
    } else {
        const valeursCles = Object.keys(erreursCommunes);
        const erreurCle = valeursCles.find((domaine: string) => {
            return leEmail.toLowerCase().includes(domaine);
        });
        if (erreurCle) {
            const domaineCorrect = erreursCommunes[erreurCle];
            const monMessage = messagesErreur[id].erreursCommunes.replace('{domaine}', domaineCorrect);
            valide = false;
            champ.classList.add('erreurChamp');
            imgErreurElement.classList.remove('cacher');
            erreurElement.innerText = monMessage;
        } else {
            valide = true;
            champ.classList.remove('erreurChamp');
            imgErreurElement.classList.add('cacher');
            erreurElement.innerText = "";
        }
    }

    return valide;
}

function validerBtnsMontantDon(): boolean {
    // Valide si un bouton radio a été sélectionné
    const refBtnsMontantDonUnique = document.querySelectorAll('input[name=montantUnique]') as NodeListOf<HTMLInputElement>;
    const refBtnsMontantDonMensuel = document.querySelectorAll('input[name=montantMensuel]') as NodeListOf<HTMLInputElement>;
    const refSpanErreur = document.getElementById('erreur-btnsTypeDon') as HTMLElement;
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img') as HTMLImageElement;
    const arrBtnsDonUnique = Array.from(refBtnsMontantDonUnique);
    const arrBtnsDonMensuel = Array.from(refBtnsMontantDonMensuel);
    const arrBtnsDon = arrBtnsDonUnique.concat(arrBtnsDonMensuel);         //Recherches sur internet pour trouver comment joindre 2 array
    let valide: boolean = false;

    arrBtnsDon.forEach(btn => {
        if (btn.checked) {
            refImgErreur.classList.add('cacher');
            valide = true;
        } else {
            refImgErreur.classList.remove('cacher');
            refSpanErreur.innerText = messagesErreur['btnsTypeDon'].vide;
        }
    });

    return valide;
}

function validerChampAutre(): boolean {
    // Valide les champs de montant autre
    let refBtnSelectionneUnique = document.querySelector('input[name=montantUnique]:checked') as HTMLInputElement;
    let refBtnSelectionneMensuel = document.querySelector('input[name=montantMensuel]:checked') as HTMLInputElement;
    const refMessageErreur = document.getElementById('erreur-btnsTypeDon') as HTMLInputElement;
    const refImgErreur = document.getElementById('erreur-btnsTypeDon--img') as HTMLImageElement;
    let valide: boolean = false;

    if (refBtnSelectionneUnique != null && refBtnSelectionneUnique.id == 'uniqueAutre') {
        const refChamp = document.getElementById('uniqueAutreMontant') as HTMLInputElement;

        if (refChamp.value != "") {
            if (refChamp.value == '0') {
                refChamp.classList.add('erreurChamp');
                refImgErreur.classList.remove('cacher');
                refMessageErreur.innerText = messagesErreur['autreMontant'].pattern;
            } else {
                valide = true;
                refChamp.classList.remove('erreurChamp');
                refImgErreur.classList.add('cacher');
                refMessageErreur.innerText = "";
            }
        } else {
            valide = false;
            refChamp.classList.add('erreurChamp');
            refImgErreur.classList.remove('cacher');
            refMessageErreur.innerText = messagesErreur['autreMontant'].vide;
        }
    } else if (refBtnSelectionneMensuel != null && refBtnSelectionneMensuel.id == 'mensuelAutre') {
        const refChamp = document.getElementById('mensuelAutreMontant') as HTMLInputElement;

        if (refChamp.value != "") {
            if (refChamp.value == '0') {
                refChamp.classList.add('erreurChamp');
                refImgErreur.classList.remove('cacher');
                refMessageErreur.innerText = messagesErreur['autreMontant'].pattern;
            } else {
                valide = true;
                refChamp.classList.remove('erreurChamp');
                refImgErreur.classList.add('cacher');
                refMessageErreur.innerText = "";
            }
        } else {
            valide = false;
            refChamp.classList.add('erreurChamp');
            refImgErreur.classList.remove('cacher');
            refMessageErreur.innerText = messagesErreur['autreMontant'].vide;
        }
    }

    return valide;
}

function afficherMontantDon() {
    const refBtnSubmit = document.getElementById('btnSubmit') as HTMLButtonElement;
    const arrBtnsDonUnique = Array.from(refBtnsUnique);
    const arrBtnsDonMensuel = Array.from(refBtnsMensuel);
    const arrBtnsDon = arrBtnsDonUnique.concat(arrBtnsDonMensuel);

    arrBtnsDon.forEach(btn => {
        if(btn.checked) {
            let montant;

            if(btn.value == 'autre') {
                const idBtn = btn.id;
                const refChamp = document.getElementById(idBtn+'Montant') as HTMLInputElement;
                montant = refChamp.value;
            } else {
                montant = btn.value;
            }

            if(btn.name == 'montantUnique') {
                refBtnSubmit.value = 'Payer un don de ' +montant +' $';
            } else if(btn.name == 'montantMensuel') {
                refBtnSubmit.value = 'Payer un don de ' +montant +' $ par mois';
            }
        }
    });
    
}

function validerEtape(etape: number): boolean {
    // Valide chaque étape selon le numéro d'étape
    let etapeValide: boolean = false;

    switch (etape) {
        case 0:
            if (validerBtnsMontantDon()) {
                const refSpan = document.getElementById('erreur-btnsTypeDon') as HTMLElement;
                const refImgErreur = document.getElementById('erreur-btnsTypeDon--img') as HTMLImageElement;
                refImgErreur.classList.add('cacher');
                refSpan.innerText = "";

                let refBtnSelectionneUnique = document.querySelector('input[name=montantUnique]:checked') as HTMLInputElement;
                let refBtnSelectionneMensuel = document.querySelector('input[name=montantMensuel]:checked') as HTMLInputElement;

                if (refBtnSelectionneUnique != null && refBtnSelectionneUnique.id == 'uniqueAutre' || refBtnSelectionneMensuel != null && refBtnSelectionneMensuel.id == 'mensuelAutre') {
                    etapeValide = validerChampAutre();
                } else {
                    etapeValide = true;
                }
            }
            afficherMontantDon();
            break;

        case 1:
            const nomEntrepriseElement = document.getElementById('nomEntreprise') as HTMLInputElement;
            const nomElement = document.getElementById('nom') as HTMLInputElement;
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const courrielElement = document.getElementById('courriel') as HTMLInputElement;
            const adresseElement = document.getElementById('adresse') as HTMLInputElement;
            const villeElement = document.getElementById('ville') as HTMLInputElement;
            const provinceElement = document.getElementById('provinces') as HTMLInputElement;
            const paysElement = document.getElementById('pays') as HTMLInputElement;
            const codePostalElement = document.getElementById('codePostal') as HTMLInputElement;

            const btnCoche = document.querySelector('input[name=typeDon]:checked') as HTMLInputElement;
            let nomEntrepriseValide = true;
            if(btnCoche.id == 'entreprise') {
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
            } else {
                etapeValide = true;
            }

            break;

        case 2:
            const titulaireElement = document.getElementById('titulaire') as HTMLInputElement;
            const carteElement = document.getElementById('carte') as HTMLInputElement;
            const expirationElement = document.getElementById('expiration') as HTMLInputElement;
            const cvcElement = document.getElementById('cvc') as HTMLInputElement;

            const titulaireValide = validerChamp(titulaireElement);
            const carteValide = validerChamp(carteElement);
            const expirationValide = validerChamp(expirationElement);
            const cvcValide = validerChamp(cvcElement);

            if (!titulaireValide || !carteValide || !expirationValide || !cvcValide) {
                etapeValide = false;
            } else {
                etapeValide = true;
            }
            break;
    }

    return etapeValide;
}

function verifierSubmit(e: Event) {
    // Empêcher le submit du formulaire s'il y a des erreurs
    if (validerEtape(intEtape) == false) {
        e.preventDefault();
    }
}