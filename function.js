

function slideOne(name) {
  var sliderOne = document.getElementById("slider-1"+name);
  var sliderTwo = document.getElementById("slider-2"+name);
  var displayValOne = document.getElementById("range1" +name);
  minGapOne = getMinGapOne(name);

  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGapOne) {
      sliderOne.value = parseInt(sliderTwo.value) - minGapOne;
  }

  // Formatage avec séparateur de milliers
  if (name == "Effectif"){
    displayValOne.textContent = formatNumbers(sliderOne.value);
  } else {
    displayValOne.textContent = formatNumbersEuros(sliderOne.value);
  }
  fillColor(sliderOne, sliderTwo, name);
}



function slideTwo(name) {
  console.log("---------slideTwo-----------");
  var sliderOne = document.getElementById("slider-1"+name);
  var sliderTwo = document.getElementById("slider-2"+name);
  var displayValTwo = document.getElementById("range2"+name);
  console.log("displayValTwo", displayValTwo);
  
  minGapOne = getMinGapOne(name);

  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGapOne) {
      sliderTwo.value = parseInt(sliderOne.value) + minGapOne;
  }

  // Formatage avec séparateur de milliers
  if (name == "Effectif"){
    displayValTwo.textContent = formatNumbers(sliderTwo.value);
  } else {
    displayValTwo.textContent = formatNumbersEuros(sliderTwo.value);
  }
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

function fetchData(params) {

  document.querySelector('.loader-container').style.display = 'flex';

var secteurSelect = document.getElementById('secteur');
var secteur = Array.from(secteurSelect.selectedOptions).map(option => option.value);
console.log("secteurs:", secteur);


var activiteSelect = document.getElementById('activite');
var activite = Array.from(activiteSelect.selectedOptions).map(option => option.value);
console.log("activites:", activite);

var searchInputVille = document.getElementById('searchInput').value;
if (searchInputVille != ""){
    var codePostal = searchInputVille.match(/\((\d+)\)/)[1];; 
    var cityLabel = searchInputVille.split(' (')[0].trim();
    console.log("  cityLabel   ",cityLabel," codePostal   ", codePostal );
} else {
    var codePostal = ""; 
    var cityLabel = "";
}

var EffectifMin = document.getElementById('slider-1Effectif').value;
console.log("EffectifMin",EffectifMin);

var EffectifMax = document.getElementById('slider-2Effectif').value;
console.log("EffectifMax",EffectifMax);

var LoyerMin = document.getElementById('slider-1Loyer').value;
console.log("LoyerMin",LoyerMin);

var LoyerMax = document.getElementById('slider-2Loyer').value;
console.log("LoyerMax",LoyerMax);

var PrixMin = document.getElementById('slider-1Prix').value;
console.log("PrixMin",PrixMin);

var PrixMax = document.getElementById('slider-2Prix').value;
console.log("PrixMax",PrixMax);

var reference = document.getElementById('annonce').value;
console.log("reference",reference);

var departement = document.getElementById('departement').value;;
console.log("departement",departement);

var checkbox = false;
document.getElementById("achatMursCheckbox").checked == true ? checkbox = "OUI" : checkbox = "NON";
console.log("checkbox",checkbox);   


// Objet avec tous les paramètres à inclure dans l'URL
var params = {
secteur: secteur ?? null,
activite: activite ?? null,
codePostal: codePostal ?? null,
cityLabel: cityLabel ?? null,
PrixMin: PrixMin ?? null,
PrixMax: PrixMax ?? null,
LoyerMin: LoyerMin ?? null,
LoyerMax: LoyerMax ?? null,
EffectifMin: EffectifMin ?? null,
EffectifMax: EffectifMax ?? null,
departement: departement ?? null,
reference: reference ?? null,
checkbox : checkbox ?? null
};


      const urlStart = "https://transrep.cmar-paca.fr:2020/getSheetData";
      //const urlStart = 'http://82.97.22.52:2020/getSheetData';
      //var urlStart = 'http://10.100.3.227:2020/getSheetData'; 
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
              document.querySelector('.loader-container').style.display = 'none';
              const container = document.getElementById('annonces-container');
              container.innerHTML = '';
              const resultDiv = document.getElementById('result');
              resultDiv.innerHTML = "";
              const numberOfOffers = data.length;
            resultDiv.innerHTML = `<span class="number">${numberOfOffers}</span> <span class="offers-text">offres correspondent à votre recherche</span>`;
              // Parcourt chaque annonce et génère une carte
              data.forEach(annonce => {
                
                  container.innerHTML += createCard(annonce);
              });
          })
          .catch(error => {
              console.error('Erreur lors de la récupération des données:', error);
          });
}

function fetchActivite( ){

      fetch('activites.csv')
      .then(response => response.text())
      .then(data => {
        // Séparer chaque ligne du fichier CSV
        const rows = data.split('\n');
        
        // Récupérer la liste déroulante <select>
        const selectElement = document.querySelector('.form-select.activite');
        
        // Pour chaque ligne, créer une nouvelle option et l'ajouter au <select>
        rows.forEach((row, index) => {
          const trimmedRow = row.trim();  
          if (trimmedRow) {
            const option = document.createElement('option');
            option.value = trimmedRow;  
            option.text = trimmedRow;
            selectElement.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du fichier CSV:', error);
      });

}

async function searchBar () {
      const query = searchInput.value.toLowerCase();
      var suggestionsContainer = document.getElementById('suggestions');
      suggestionsContainer.innerHTML = '';
      
      if (query.length === 0) {
          suggestionsContainer.style.display = 'none';
          return;
      }
  
      // Filtrage des villes en fonction de la recherche
      const filteredData = cities.filter(item =>
          item.label.toLowerCase().includes(query) || item.code_postale.includes(query)
      );
  
  
      if (filteredData.length > 0) {
          suggestionsContainer.style.display = 'block';
          filteredData.forEach(item => {
  
              
              var div = document.createElement('div');
              div.className = 'suggestion-item';
              div.textContent = `${item.label} (${item.code_postale})`;
  
              div.addEventListener('click', function() {
                  var distanceDivs = document.querySelectorAll('.distance-div');
                  distanceDivs.forEach(div => div.remove());
                  

  
                  // Mettre à jour le champ de saisie avec le texte sélectionné
                  searchInput.value = `${item.label} (${item.code_postale})`;
                  // Réinitialiser les suggestions
                  suggestionsContainer.innerHTML = '';
                  suggestionsContainer.style.display = 'none';
              });
              suggestionsContainer.appendChild(div);
          });
      } else {
          suggestionsContainer.style.display = 'none';
      }
};

function handleInputEvent(event) {
    searchBar(event).catch(error => console.error('Erreur lors de la recherche:', error));
}

function loadCSVSync(filePath) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', filePath, false);  // false for synchronous request
  xhr.send(null);
  if (xhr.status === 200) {
      return xhr.responseText;
  } else {
      console.error("Erreur de chargement du fichier CSV:", xhr.status, xhr.statusText);
      return null;
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(';');
  const data = lines.slice(1).map(line => {
      const values = line.split(';');
      return headers.reduce((obj, header, index) => {
          obj[header.trim()] = cleanValue(values[index]);
          return obj;
      }, {});
  });
  return data;
}

function cleanValue(value) {
  return value.replace(/[\r\n]+/g, '').trim();
}

function createCard(annonce) {

  var departement = "";
  if (annonce.departement == "06") {
      departement = "Alpes-Maritimes (06)";
  } else if (annonce.departement == "04") {
      departement = "Alpes-de-Haute-Provence (04)";
  } else if (annonce.departement == "05") {
      departement = "Hautes-Alpes (05)";
  } else if (annonce.departement == "13") {
      departement = "Bouches-du-Rhône (13)";
  } else if (annonce.departement == "83") {
      departement = "Var (83)";
  } else if (annonce.departement == "84") {
      departement = "Vaucluse (84)";}



  annonce.departement
  return `
      <div class="card">
          <div class="reference-card margin-bottom">Réf. ${annonce.numeroAnnonce}</div>
          <div class="titreAnnonce-card margin-bottom">${annonce.titreAnnonce.toUpperCase()}</div>
          <div class="departement margin-bottom">${departement}</div>
          <div class="line-height margin-bottom">${annonce.descriptif}</div>
          <div class="div-blue-writing" ><span class="blue-writing" >Prix :</span> ${annonce.prixVente}</div>
          <div class="div-blue-writing" ><span class="blue-writing">Loyer /an :</span> ${annonce.loyerAnnuel}</div>
          <div class="div-blue-writing" ><span class="blue-writing">Effectif :</span> ${annonce.effectif}</div>
          <div class="div-blue-writing" ><span class="blue-writing">Surface du local :</span> ${annonce.surface} m²</div>
          <div class="contact">
              <strong>Contact : <BR> </strong> <a href="mailto:${annonce.mail}">${annonce.mail}</a> -  <a href="tel:${annonce.tel}">${annonce.tel}</a>
          </div>
      </div>
  `;
}

function formatNumbersEuros(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+ " €";
}

function formatNumbers(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

document.addEventListener("DOMContentLoaded", function () {
    function appendSearchIcon() {
        const searchIconSpan = document.createElement('span');
        searchIconSpan.classList.add('search-icon');

        searchIconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256" style="max-width:20px;max-height:20px;transform: translateX(-35px);">
                <g fill="#e94b3c" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                    <g transform="scale(8.53333,8.53333)">
                        <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                    </g>
                </g>
            </svg>
        `;

        // Select the inputs for secteur and activite
        const secteurSearchInput = document.querySelector('#secteur + span .select2-search__field');
        const activiteSearchInput = document.querySelector('#activite + span .select2-search__field');

        // Append search icon to each input if found
        if (secteurSearchInput) {
            secteurSearchInput.parentNode.appendChild(searchIconSpan.cloneNode(true));
        } else {
            console.error('Secteur search input not found.');
        }

        if (activiteSearchInput) {
            activiteSearchInput.parentNode.appendChild(searchIconSpan.cloneNode(true));
        } else {
            console.error('Activite search input not found.');
        }
    }

    // Delay to ensure elements are loaded
    setTimeout(appendSearchIcon, 500);

    const searchInput = document.getElementById("searchInput");
    const annonceInput = document.getElementById("annonce");

    const searchIconCity = document.createElement("span");
    searchIconCity.className = "search-icon-city";

    const searchIconAnnounce = document.createElement("span");
    searchIconAnnounce.className = "search-icon-announce";

    searchIconCity.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 256 256" style="max-width:20px;max-height:20px;">
            <g fill="#e94b3c" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10">
                <g transform="scale(8.53333,8.53333)">
                    <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                </g>
            </g>
        </svg>
    `;

    searchIconAnnounce.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 256 256" style="max-width:20px;max-height:20px;">
            <g fill="#e94b3c" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10">
                <g transform="scale(8.53333,8.53333)">
                    <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                </g>
            </g>
        </svg>
    `;

    // Insert the icons into the DOM
    searchInput?.parentNode?.insertBefore(searchIconCity, searchInput.nextSibling);
    annonceInput?.parentNode?.insertBefore(searchIconAnnounce, annonceInput.nextSibling);

    // Function to toggle the visibility of the icons
    function toggleIconVisibility(input, icon) {
        if (input.value.trim() !== "") {
            icon.style.display = "none";
        } else {
            icon.style.display = "inline-block";
        }
    }

    // Add event listeners for search inputs
    [searchInput, annonceInput].forEach(input => {
        if (input) {
            const icon = input.nextElementSibling; // This targets the span containing the icon
            input.addEventListener("input", function () {
                toggleIconVisibility(input, icon);
            });
        }
    });

    // Handle select2 fields with select2-specific events
    ['secteur', 'activite'].forEach(function (selectId) {
        const selectInput = document.querySelector(`#${selectId} + span .select2-search__field`);
        if (selectInput) {
            const icon = selectInput.parentNode.nextElementSibling; // Get the corresponding icon span

            selectInput.addEventListener("input", function () {
                toggleIconVisibility(selectInput, icon);
            });

            // For select2 selections
            const parentSelect = document.querySelector(`#${selectId}`);
            parentSelect.addEventListener("change", function (e) {
                toggleIconVisibility(selectInput, icon);
            });

            // Handle select2 close event to show the icon when the select box is closed
            parentSelect.addEventListener("select2:close", function () {
                toggleIconVisibility(selectInput, icon);
            });
        }
    });
});
