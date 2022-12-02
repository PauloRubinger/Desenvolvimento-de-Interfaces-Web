// API's key
const key = "ad1b303b07404267b2b570f6c2f594df";
// Get the URL query string
const queryString = window.location.search;
// Parse the query string's parameters
const urlParameters = new URLSearchParams(queryString);

// Get the parameter "search"
const searchParameter = urlParameters.get("search");

// API URL to get search results
const searchAPIUrl = `https://api.rawg.io/api/games?key=${key}&dates=1980-01-01,2022-12-01&search=${searchParameter}`;

function cardSearchResults(data) {

    let cards = "";
    for (let i = 0; i < data.results.length; i++) {
        let game = data.results[i];

        // Pegando todos os gêneros do jogo e tratando se for null ou undefined
        let getAllGenres = [];
        let arrayGenres;
        let genresSeparated;
        for(let i = 0; i < game.genres.length; i++) {
          getAllGenres += game.genres[i].name + ",";
          arrayGenres = getAllGenres.split(",");
          arrayGenres.pop();
          genresSeparated = arrayGenres.join(", ");
        }
        if (genresSeparated == null || genresSeparated == undefined) {
          genresSeparated = "Não definido";
        }

        //Tratando notas 0
        let nota = game.rating;
        if (game.rating == 0 || game.rating == null || game.rating == undefined) {
            nota = "Não definida ainda";
        }

        cards += `<div class="card col-md-4 col-sm-6 cards">
        <img src="${game.background_image}" class="card-img-top" alt="Imagem do jogo ${game.name}">
        <div class="card-body">
          <h5 class="card-title"><strong>${game.name}</strong></h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Nota:</strong> ${nota}</li>
          <li class="list-group-item"><strong>Data de lançamento:</strong> ${(game.released).split('-').reverse().join('/')}</li>
          <li class="list-group-item"><strong>Gêneros:</strong> ${genresSeparated}</li>
        </ul>
        <div class="card-body">
          <a href="detalhes.html?id=${game.id}" class="card-link">Mais detalhes</a>
        </div>
      </div>`
    }
    document.getElementById("games_list").innerHTML = cards;
}

async function getSearchResults() {
    const response = await fetch(searchAPIUrl);
    console.log(response);

    const data = await response.json();
    console.log(data);

    cardSearchResults(data);
}

function searchGame() {
    let gameInput = document.getElementById("search").value;
    
    const searchUrl = "pesquisa.html?search=";
    let searchGameUrl = searchUrl + gameInput;
    console.log(searchGameUrl);
    
    let searchPage = window.open(searchGameUrl);
    }

getSearchResults();

let btnSearch = document.getElementById("search_btn");
btnSearch.addEventListener("click", searchGame);