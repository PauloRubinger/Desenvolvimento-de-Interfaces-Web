// API's key
const key = "ad1b303b07404267b2b570f6c2f594df";

function obtenhaParametosDaQueryString() {
	// Vetor que conterá a resposta do nosso método com os parâmetros da query string.
	var parametrosDaQueryString = [];

	// 'chave=valor&chave=valor&chave=valor' => Retira o "?" que representa o começo da query string
	var queryString = window.location.search.replace("?", "");
	
	// ['chave=valor', 'chave=valor', 'chave=valor'] => Separa os parâmetros, pois na URL são separados por "&"
	var parametrosJuntoComValores = queryString.split("&");
	
	for (var i = 0; i < parametrosJuntoComValores.length; i++) {
		var parametroComValor = parametrosJuntoComValores[i];
		
		// ['chave', 'valor'] => Separa a chave do valor, pois na URL são separados por "="
		var parametroSeparadoDoValor = parametroComValor.split('=');
		
		/*
			[
				{chave: 'chave', valor: 'valor'},
				{chave: 'chave', valor: 'valor'},
				{chave: 'chave', valor: 'valor'}
			]
		*/
		parametrosDaQueryString.push({
			chave: parametroSeparadoDoValor[0],
			valor: parametroSeparadoDoValor[1]
		});
	}
	
	return parametrosDaQueryString;
}

function obtenhaParametroDaQueryStringPorChave(chave) {
	var parametrosDaQueryString = obtenhaParametosDaQueryString();
	
	return parametrosDaQueryString.find(function(parametro) {
		return parametro.chave == chave;
	});
}

var parametroId = obtenhaParametroDaQueryStringPorChave('id');

// Requisição GET com o parâmetro id do game específico passado pela query string   
const urlSpecificGame = `https://api.rawg.io/api/games/${parametroId.valor}?key=${key}`;
const urlStores = `https://api.rawg.io/api/games/${parametroId.valor}/stores?key=${key}`


function setSpecificGame(data) {

	// Tratando notas 0 ou indefinidas da RAWG
	let rawgRate = data.rating;
	if (data.rating == null || data.rating == undefined || data.rating == 0) {
		rawgRate = "Não definida";
	}

	// Tratando notas 0 ou indefinidas do Metacritic
	let metacriticRate = data.metacritic;
	if (data.metacritic == null || data.metacritic == undefined) {
		metacriticRate = "Não definida";
	}

	// Tratando links nulos ou indefinidos
	let metacriticUrl = data.metacritic_url;
	if (data.metacritic_url == null || data.metacritic_url == undefined) {
		metacriticUrl = "#";
	}

	// Tratando websites nulos ou indefinidos
	let website = data.website;
	if (data.website == null || data.website == undefined) {
		website = "";
	}

	// Pegando todos os gêneros do jogo e tratando se for null ou undefined
	let getAllGenres = [];
	let arrayGenres;
	let genresSeparated;
	for(let i = 0; i < data.genres.length; i++) {
		getAllGenres += data.genres[i].name + ",";
		arrayGenres = getAllGenres.split(",");
		arrayGenres.pop();
		genresSeparated = arrayGenres.join(", ");
	}
	if (genresSeparated == null || genresSeparated == undefined) {
		genresSeparated = "Não definido";
	}

	// Pegando todas as plataformas que rodam o jogo e tratando se for null ou undefined
	let getAllPlatforms = [];
	let arrayPlatforms;
	let platformsSeparated;
	for (let i = 0; i < data.platforms.length; i++) {
		getAllPlatforms += data.platforms[i].platform.name + ",";
		arrayPlatforms = getAllPlatforms.split(",");
		arrayPlatforms.pop();
		platformsSeparated = arrayPlatforms.join(", ");
	}
	if (platformsSeparated == null || platformsSeparated == undefined) {
		platformsSeparated = "Informação não disponível";
	}

	// Pegando as desenvolvedoras do jogo e tratando se for null ou undefined
	let getAllDevelopers = [];
	let arrayDevelopers;
	let developersSeparated;
	for (let i = 0; i < data.developers.length; i++) {
		getAllDevelopers += data.developers[i].name + ",";
		arrayDevelopers = getAllDevelopers.split(",");
		arrayDevelopers.pop();
		developersSeparated = arrayDevelopers.join(", ");
	}
	if (developersSeparated == null || developersSeparated == undefined) {
		developersSeparated = "Informação não disponível";
	}

	// Pegando todas as lojas que vendem o jogo e tratando se for null ou undefined
	let getAllStores = [];
	let arrayStores;
	let storesSeparated;
	for (let i = 0; i < data.stores.length; i++) {
		getAllStores += data.stores[i].store.name + ",";
		arrayStores = getAllStores.split(",");
		arrayStores.pop();
		storesSeparated = arrayStores.join(", ");
	}
	if (storesSeparated == null || storesSeparated == undefined) {
		storesSeparated = "Informação não disponível";
	}

	// Pegando os requisitos para rodar no PC e tratando se for null ou undefined
	let minRequirementsGame = "";
	let recRequirementsGame = "";
	let requirements = "";
	for (let i = 0; i < data.platforms.length; i++) {
			if (data.platforms[i].platform.name == "PC"){
				if (data.platforms[i].requirements.minimum != undefined)
					minRequirementsGame = data.platforms[i].requirements.minimum;
				else
					minRequirementsGame = "";
				if (data.platforms[i].requirements.recommended != undefined)
					recRequirementsGame = data.platforms[i].requirements.recommended;
				else
					recRequirementsGame = "";
			}
		}
	requirements = minRequirementsGame + "<br></br>" + recRequirementsGame;
	let str = "";
	if (minRequirementsGame != "" && recRequirementsGame != "") {
		str = `<b>Requisitos para rodar no PC: </b><p>${requirements}</p>`;
	}

	let playtime = data.playtime + " hora(s)";
	if (data.playtime == null || data.playtime == undefined ||data.playtime == 0) {
		playtime = "Informação não disponível";
	}

	document.getElementById("game_name").innerHTML = data.name;

	let grid = `
	<div id="game_image" class="imagem_jogo">
		<img src="${data.background_image}" alt="Imagem do Jogo">
	</div>
	<div class="nota_rawg">
		<a href="https://rawg.io/games/${data.slug}" target="_blank" rel="noopener noreferrer" class="rawg_link text-light"><b>Nota RAWG: </b>
		<p>${rawgRate}/5</p>
	</div>
	<div class="nota_metacritic">
		<a href="${metacriticUrl}" target="_blank" rel="noopener noreferrer" class="metacritic_link text-light"><b>Nota Metacritic: </b></a>
		<p>${metacriticRate}/100</p>
	</div>
	<div class="generos">
		<span><b>Gêneros: </b>
		<p>${genresSeparated}</p>
	</div>
	<div class="game_website">
	<b>Website: </b>
	<a href="${website}" target="_blank" rel="noopener noreferrer" class="website text-light"><p>${website}</p></a>
	</div>
	<div class="release_date">
		<b>Data de lançamento: </b>
		<p>${(data.released).split('-').reverse().join('/')}</p>
	</div>
	<div class="plataformas">
		<b>Plataformas: </b>
		<p>${platformsSeparated}</p>
	</div>
	<div class="onde_comprar">
		<b>Onde comprar: </b>
		<p>${storesSeparated}</p>
	</div>
	<div class="desenvolvedores_jogo">
		<b>Desenvolvedores:</b>
		<p>${developersSeparated}</p>
	</div>
	<div class="average_playtime">
		<b>Tempo médio de jogo: </b>
		<p>${playtime}</p>
	`

	let about = data.description_raw;
	if (data.description_raw == null || data.description_raw == undefined) {
		about = "Informação não disponível"
	}

	let flex = `
	<div class="container-fluid about_area">
		<div class="row about_game">
			<div class="col-12">
				<span><b>Sobre o jogo: </b>${data.description_raw}</span>
			</div>
		</div>

		<div class="row requisitos_pc">
			<div id="requirements" class="col-12">
				${str}
			</div>
		</div>
	</div>
	`
	document.getElementById("game_info").innerHTML = grid;
	document.getElementById("game_about").innerHTML = flex;


}

// function setStoresGame(data) {

// 	//Pegando os links das lojas que vendem o jogo
// 	let getAllLinksStores = [];
// 	let arrayLinksStores;
// 	for (let i = 0; i < data.results.length; i++) {
// 		getAllLinksStores += data.results[i].url + ",";
// 		arrayLinksStores = getAllLinksStores.split(",");
// 		arrayLinksStores.pop();
// 	}

// 	console.log(arrayLinksStores);
// 	let stores = `
	
	
// 	`
// }

async function getSpecificGame() {
    const response = await fetch(urlSpecificGame);
    console.log(response);

    const data = await response.json();
    console.log(data);

	setSpecificGame(data);
}

async function getStoresGame() {
	const response = await fetch(urlStores);
	console.log(response);

	const data = await response.json();
	console.log(data);

	// setStoresGame(data);
	
}

function searchGame() {
	let gameInput = document.getElementById("search").value;
	const searchUrl = "pesquisa.html?search=";
	let searchGameUrl = searchUrl + gameInput;
	console.log(searchGameUrl);
	
	let searchPage = window.open(searchGameUrl);
  }

getSpecificGame();

let btnSearch = document.getElementById("search_btn");
btnSearch.addEventListener("click", searchGame);
