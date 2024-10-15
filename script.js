window.onload = function (name) {
    slideOne("Prix");
    slideTwo("Prix");
    slideOne("Loyer");
    slideTwo("Loyer");
    slideOne("Effectif");
    slideTwo("Effectif");



    // Appelle la fonction pour récupérer les données
    fetchData();



  };
  
  function slideOne(name) {
    var sliderOne = document.getElementById("slider-1"+name);
    var sliderTwo = document.getElementById("slider-2"+name);
    var displayValOne = document.getElementById("range1" +name);
    minGapOne = getMinGapOne(name);
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGapOne) {
      sliderOne.value = parseInt(sliderTwo.value) - minGapOne;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor(sliderOne, sliderTwo, name);
  }

  function slideTwo(name) {

    var displayValTwo = document.getElementById("range2"+name);
    var sliderOne = document.getElementById("slider-1"+name);
    var sliderTwo = document.getElementById("slider-2"+name);
    minGapOne = getMinGapOne(name);

    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGapOne) {
      sliderTwo.value = parseInt(sliderOne.value) + minGapOne;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor(sliderOne, sliderTwo, name);
  }

  function fillColor(sliderOne, sliderTwo, name) {

    var sliderMaxValue = document.getElementById("slider-1"+name).max;
    sliderTrack = document.querySelector(".slider-track" + name);
    percent1 = (sliderOne.value / sliderMaxValue) * 100;
    percent2 = (sliderTwo.value / sliderMaxValue) * 100;
    sliderTrack.style.background = `#ffffff`;
  }

  function getMinGapOne(name){

    if (name == "Prix"){
      minGapOne = 0;}
      else if (name == "Loyer"){
        minGapOne = 0;
      }
      else if (name == "Effectif"){
        minGapOne = 0;
      }
      return minGapOne
  }



// Remplacez les valeurs des paramètres par celles que vous souhaitez filtrer
const codePostal = '05600';  // Code Postal
const secteur = 'SERVICES';  // Secteur d'activité
const activite = 'Coiffure en salon';  // Activité
const PrixMin = 35000;  // Prix de vente du FDC/PS
const PrixMax = 35000;  // Limite supérieure pour le prix (si nécessaire)
const LoyerMin = 5400;  // Montant du loyer annuel
const LoyerMax = 5400;  // Limite supérieure pour le loyer (si nécessaire)
const EffectifMin = 1;  // Effectif minimum
const EffectifMax = 1;  // Effectif maximum
const departement = '05';  // Département (les deux premiers chiffres du code postal)
const reference = "202410040016";  // Référence de l'annonce

       //const url = `${urlStart}?secteur=${secteur}&codePostal=${codePostal}&activite=${encodeURIComponent(activite)}`;

       // Objet avec tous les paramètres à inclure dans l'URL
       const params = {
         secteur: secteur,
         codePostal: codePostal,
         activite: activite,
         PrixMin: PrixMin,
         PrixMax: PrixMax,
         LoyerMin: LoyerMin,
         LoyerMax: LoyerMax,
         EffectifMin: EffectifMin,
         EffectifMax: EffectifMax,
         departement: departement,
         reference: reference
       };


       const urlStart = 'http://82.97.22.52:2020/getSheetData'; 

       // Fonction pour faire un appel GET
       function fetchData() {
        fetch(urlStart, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
          })  // Remplace l'URL si nécessaire
            .then(response => {
                // Vérifie si la réponse est OK (statut 200)
                if (!response.ok) {
                    throw new Error('Erreur réseau : ' + response.statusText);
                }
                return response.json();  // Transforme la réponse en JSON
            })
            .then(data => {
                console.log(data);  // Affiche les données récupérées dans la console
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }
