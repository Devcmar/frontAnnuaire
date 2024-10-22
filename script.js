window.onload = function () {




  $('.form-select.round.secteur').select2({
    placeholder: "Secteur",
    allowClear: true,
    width: '200px', // Ajustez la largeur du sélecteur
  });

  $('.form-select.round.activite').select2({
    placeholder: "Activité",
    allowClear: true,
    width: '300px', // Ajustez la largeur du sélecteur
  });


  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input',handleInputEvent );

  const csvCity = 'villes.csv';
  var dataCity = loadCSVSync(csvCity);
  cities = parseCSV(dataCity);

    slideOne("Prix");
    slideTwo("Prix");
    slideOne("Loyer");
    slideTwo("Loyer");
    slideOne("Effectif");
    slideTwo("Effectif");

    // Appelle la fonction pour récupérer les données
    fetchActivite()
    
 
    
  };
  
  

