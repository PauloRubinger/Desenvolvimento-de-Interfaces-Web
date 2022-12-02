// API's key
const key = "ad1b303b07404267b2b570f6c2f594df";

// URL para lista de jogos
const urlGamesList = `https://api.rawg.io/api/games?key=${key}&page_size=20`;

// URL para lista de desenvolvedores de jogos
const urlDevsList = `https://api.rawg.io/api/developers?key=${key}&page_size=20`;

const urlOrderByRating = `https://api.rawg.io/api/games?key=${key}&dates=1980-01-01,2022-12-01&ordering=-rating`;

const urlOrderByReleasedDate = `https://api.rawg.io/api/games?key=${key}&dates=1980-01-01,2022-12-01&ordering=-released`;

// URL para game específico: "https://api.rawg.io/api/games/id?key=ad1b303b07404267b2b570f6c2f594df"
// Substituir "id" na URL pelo id do jogo

function cardGamesList(data) {

    let str = "";
    for (let i = 0; i < data.results.length; i++) {
        let game = data.results[i];

        // Pegando e tratando todos os gêneros do jogo
        let getAllGenres = [];
        let arrayGenres;
        let genresSeparated;
        for(let j = 0; j < game.genres.length; j++) {
          getAllGenres += game.genres[j].name + ",";
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

        str += `<div class="card col-md-4 col-sm-6 cards">
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
                  <button type="button" class="btn btn-primary"><a href="detalhes.html?id=${game.id}" class="card-link text-light">Mais detalhes</a></button>
                  </div>
                </div>`
    }
    document.getElementById("games_list").innerHTML = str;
}

function setDevsList(data) {
    let devsCards = "";
    let getAllGamesFromDevs = [];
    let arrayGamesFromDevs;
    let arrayGamesFromDevsSeparated;
    let str = "";
    for (let i = 0; i < data.results.length; i++) {
        let devs = data.results[i];

        // Pegando todos os games do array
        getAllGamesFromDevs = "";
        arrayGamesFromDevs = "";
        str = "";  
        for (let j = 0; j < 6; j++) {
            getAllGamesFromDevs += devs.games[j].name + ",";
            arrayGamesFromDevs = getAllGamesFromDevs.split(",");
            arrayGamesFromDevs.pop();                   
        }

        for (let k = 0; k < 6; k++) {
            str += `<li class="list-group-item">${arrayGamesFromDevs[k]}</li>`;
        }

        devsCards += `<div class="card col-md-4 col-sm-6 cards_devs">
                        <img src="${devs.image_background}" class="card-img-top" alt="Imagem de algum jogo da desenvolvedora">
                        <div id="devs_name" class="card-body">
                            <h5 class="card-title"><strong>${devs.name}</strong></h5>
                        </div>
                        <div id="games_count" class="card-header">
                            <p id="games_count_text">Total de jogos: ${devs.games_count}</p>
                        </div>
                        <div class="popular_games"><p>Jogos Populares:</p>
                          <ul id="card_games_list" class="list-group list-group-flush">
                            ${str}
                            </ul>
                        </div>
                      </div>`
      document.getElementById("devs_list").innerHTML = devsCards;
    }   
    
    console.log(arrayGamesFromDevs);
}

async function getGamesList() {
    const response = await fetch(urlGamesList);
    console.log(response);

    const data = await response.json();
    console.log(data);

    cardGamesList(data); 
}

async function getDevsList() {
    const response = await fetch(urlDevsList);
    console.log(response);

    const data = await response.json();
    console.log(data);

    setDevsList(data);
}

async function orderByRating() {
    const response = await fetch(urlOrderByRating);
    console.log(response);

    const data = await response.json();
    console.log(data);

    cardGamesList(data);
}

async function orderByReleasedDate() {
    const response = await fetch(urlOrderByReleasedDate);
    console.log(response);

    const data = await response.json();
    console.log(data);

    cardGamesList(data);
}

function searchGame() {
  let gameInput = document.getElementById("search").value;
  const searchUrl = "pesquisa.html?search=";
  let searchGameUrl = searchUrl + gameInput;
  console.log(searchGameUrl);
  
  let searchPage = window.open(searchGameUrl);
}

let filtroOrdenar = document.querySelector("#order");
document.body.onload = () => {
    filtroOrdenar.addEventListener("change", () => {
      if (filtroOrdenar.value == "rating"){
          orderByRating();
      }
      if (filtroOrdenar.value == "popularity"){
          getGamesList();
      }
      if (filtroOrdenar.value == "releasedDate"){
          orderByReleasedDate();
      }
  })
}

if (filtroOrdenar.value == "popularity"){   
    getGamesList();
}

getDevsList();

let btnSearch = document.getElementById("search_btn");
btnSearch.addEventListener("click", searchGame);