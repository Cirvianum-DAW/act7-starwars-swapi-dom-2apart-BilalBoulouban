import swapi from "./swapi.js";

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(
  movieId,
  titleSelector,
  infoSelector,
  directorSelector
) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  if (!movieId) {
    title.innerHTML = "";
    info.innerHTML = "";
    director.innerHTML = "";
    return;
  }
  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}

async function initMovieSelect(selector) {
  const movies = await swapi.listMoviesSorted();
  const select = document.querySelector(selector);

  // movies.forEach(movie => {
  //   const optionElement = document.createElement('option');

  //   optionElement.value = movie.id;
  //   optionElement.textContent = movie.title;
  //   optionElement.innerHTML += ` (${movie.name})`;
  //   selectElement.appendChild(optionElement);

  const option = document.createElement("option");
  option.value = "";
  //  option.value = movie.id;
  option.textContent = "Selecciona una pel·licula";
  select.appendChild(option);
  movies.forEach((movie) => {
    const option = document.createElement("option");
    option.value = _filmIdToEpisodeId(movie.episodeID);
    option.textContent = movie.name;
    select.appendChild(option);
  });
}

// function deleteAllCharacterTokens() {} la hem implementat en _handleOnSelectMovieChanged

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {
  document.querySelector(".list_characters").innerHTML = "";
  const homeworld = document.querySelector("#select_homeworld");
  homeworld.addEventListener("change", _createCharacterTokens);
}

//event handlers

async function _createCharacterTokens(event) {
  //Necessitem saber quina pelicula i quin planeta homeworls shan seleccionat
  const idPelicula = document.querySelector("#select_movies").value;
  const selectHomeworld = document.querySelector("#select_homeworld").value;
  const ul = document.querySelector(`.list_characters`);
  if (!idPelicula) {
    throw Error("no movie selected.");
  }
  // if(!selectHomeworld){
  //   throw Error('No homeworld selected')
  // }
  //
  let movieInfo = await swapi.getMovieCharactersAndHomeworlds(idPelicula);

  let filteredcaracters = movieInfo.filter(
    (caracter) => caracter.homeword == event.target.value
  );
  console.log(filteredcaracters);

  filteredcaracters.map((personatge) => {
    const li = document.createElement("li");
    li.classList.add("list_item", "item", "character");
    ul.appendChild(li);
    //les imatges les tenim en local. hem de crear un element img
    const img = document.createElement("img");
    //anem a introduir la imatge del personatge
    const urlParts = personatge.url.split("/");
    const characterNumber = urlParts[urlParts.length - 1];
    //const characterNumber = urlPart.pop()
    img.src = `../public/assets/people/${characterNumber}.jpg`;
    img.className = "character_image";
    img.style.maxWidth = "100%";
    li.appendChild(img);
    // em de afeguir el nom del personatge
    const h2 = document.createElement("h2");
    h2.classList.add("character_name");
    h2.innerHTML = personatge.name;
    li.appendChild(h2);
    _addDivChild(li, 'character__birth','<strong>Birth Year:</strong>' + personatge.birth_year);
    _addDivChild(li, 'character__eye','<strong>Eye Color:</strong>' + personatge.eye_color);
    _addDivChild(li, 'character__gender','<strong>Gender:</strong>' + personatge.gender);
    _addDivChild(li, 'character__home','<strong>Homeworld:</strong>' + personatge.homeword);

  });

  
}

function _addDivChild(parent, className, html) {
  const div = document.createElement('div')
  div.className = className
  div.innerHTML = html 
  parent.appendChild(div)
}

function setMovieSelectCallbacks() {
  const selectMovie = document.querySelector("#select-movie");
  selectMovie.addEventListener("change", _handleOnSelectMovieChanged);
}

async function _handleOnSelectMovieChanged(event) {
  //obtenir  el id de la pel·licula seleccionada
  const movieID = event.target.value;
  //modifiquem la capsalera amb la informacio correcponent mab aquesta peli
  setMovieHeading(movieID, ".movie__title", ".movie__info", ".movie__director");

  //ex4 recuperar infomracio de l'auxiliar _populateHomeWorldSelector
  const selector = document.querySelector("#select-homeworld");

  const caracters = await swapi.getMovieCharactersAndHomeworlds(movieID);
  //necesitem una llista amb els planetes d'origuen dels diferents personatges
  const homeworlds = caracters.characters.map((caracter) => caracter.homeworld);
  const homeworldsFiltred = _removeDuplicatesAndSort(homeworlds);
  //amb la llista neta i de fet ordenada podem cridad a la funcio que actualitza el selector de homeword
  _populateHomeWorldSelector(homeworldsFiltred, selector);
  document.querySelector(".list_caracters").innerHTML = "";
}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find((item) => item.e === episodeID);
  if (mapping) {
    return mapping.m;
  } else {
    return null;
  }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) {}

function _populateHomeWorldSelector(homeworlds) {
  console.log(homeworlds);
  const selector = document.querySelector("#select-homeworld");
  selector.innerHTML = "";
  //aqui implementem la logica per poblar o injectar els planetes al desplegable homeworld
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "Selecciona un homeworld";
  selector.appendChild(option);
  homeworlds.forEach((homeword) => {
    const option = document.createElement("option");
    option.value = homeword;
    option.textContent = homeword;
    selector.appendChild(option);
  });
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = [...set].sort();
  return array;
  // const array = Array.from(set);
  // // i ordenem alfabèticament
  // return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  //deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
