const searchBtn = document.getElementById("searchBtn");
const searchText = document.getElementById("searchTXT");
const outputArea = document.getElementById("output");
const infoBtn = document.getElementById("infoBtn")
let current_anime_id;
let current_episode;
let rnd = 0

let output_info;



async function GetAnimeList(query, page) {
  const response = await fetch(`http://localhost:3000/anime/gogoanime/${query}?page=${page}`);
  const jsonData = await response.json();
  return jsonData.results;
}

async function GetAnimeInfo(anime_id){
  const response = await fetch(`http://localhost:3000/anime/gogoanime/info/${anime_id}`)
  const jsonData = await response.json();
  return jsonData;
}

async function LoadAnime(episode_id){
  const response = await fetch(`http://localhost:3000/anime/gogoanime/watch/${episode_id}?server=gogocdn`)
  console.log(episode_id)
  const jsonData = await response.json();
  return jsonData;
}

// Search anime index
searchBtn.addEventListener("click", async function () {

  console.log(searchText.value)
  await Yer(searchText.value)

});

async function Yer(txt){
  output_info = ""
  let i = 0
  outputArea.innerHTML = `<img class="justify-content-center" width="100" height="100" src="https://media.tenor.com/DpgEL1ITpE4AAAAd/nanashi-mumei-loading.gif">`

  let anime_list = await GetAnimeList(txt, 1);
  outputArea.innerHTML = ""
  outputArea.innerHTML = "<br>"
  outputArea.innerHTML = "<p>Anime results:</p>"
  anime_list.forEach(element => {
    i++;
    outputArea.innerHTML += `<div class="row">`
    if(i % 3 === 0){
      outputArea.innerHTML += `</div>`
      outputArea.innerHTML += `<div class="row">`
    }
    console.log(element["title"]) // WORK ON THE COLUMN AND IMG SYSTEM
    outputArea.innerHTML += `
    <div class="col-sm">
    <div class="card m-1 bg-dark">
      <div class="card-body">
        <img src="${element["image"]}" width="120" height="160">
        <a href="#" id="${element["id"]}" onClick="info_anime(this.id)" class="card-text">${element["title"]}</a>
      </div>

    </div>
    </div>
    
    `
  })
}
// Info of anime

async function info_anime(anime_id){

  current_anime_id = anime_id
  outputArea.innerHTML = "";
  outputArea.innerHTML = `<img class="justify-content-center" width="100" height="100" src="https://media.tenor.com/DpgEL1ITpE4AAAAd/nanashi-mumei-loading.gif">`

  anime_data = await GetAnimeInfo(anime_id)
  outputArea.innerHTML = `
  <div class="row" id="info">
    <div class="col-sm p-5 m-2 bg-secondary rounded">
      <p>${anime_data["title"]}</p>
      <p>Released: ${anime_data["releaseDate"]}</p>
      <p>Status: ${anime_data["status"]}</p><br>
      <img src=${anime_data["image"]} class="rounded" width="200" height="300">
    </div>
    <div class="col-sm p-5">
      <p>${anime_data["description"]}</p>
    </div>
  </div>
  <div class="row p-5">
  <p>Episodes:</p><br>
  </div>
  <div class="row p-5">
  `
  anime_data["episodes"].forEach(element => {

    //console.log(element)
    outputArea.innerHTML += `

    <button class="btn btn-danger m-1" id="${element["id"]}" onclick="ShowAnime(this.id); SaveEpisode(${element["number"]})">${element["number"]}</button>
    
    `

  })
  outputArea.innerHTML += `</div>`


}

// Play anime
async function PlayAnime(video_url_){
  let check = false;
  let player;
  if(outputArea.innerHTML.includes(`<video id="player_"`)){
    player.pause();
    player.currentTime = 0;
    check = true;
  }

  rnd += 1
  
  outputArea.innerHTML = ""
  outputArea.innerHTML = `
  <p>Current episode: ${current_episode}</p>
  <video id="player_${rnd}" class="video-js vjs-default-skin p-2" width="600" height="400" controls>
  <source src="${video_url_}" type="application/x-mpegURL">
  </video>
  <br><br><br>
  <button class="btn btn-danger p-3" id="next" onclick="NextEpisode()">Next episode</button>
  
  `
  player = videojs(`player_${rnd}`, {

    controls: true,
    autoplay: false,
    preload: 'none'

  })
  player.play();

}


async function ShowAnime(episode_id){
  outputArea.innerHTML = `<img class="justify-content-center" width="100" height="100" src="https://media.tenor.com/DpgEL1ITpE4AAAAd/nanashi-mumei-loading.gif">`
  let source = await LoadAnime(episode_id)

  console.log(source["sources"])
  outputArea.innerHTML = ""
  source["sources"].forEach(element => {
    console.log(element["quality"])
    outputArea.innerHTML += `<a id="${element["url"]}" href="#" onclick="PlayAnime(this.id)">${element["quality"]}</a><br>`

  })
}

async function SaveEpisode(num){
  current_episode = num;
}

async function NextEpisode(){
  current_episode += 1
  let player = videojs(`player_${rnd}`, {

    controls: true,
    autoplay: false,
    preload: 'none'

  })
  player.pause();
  player.currentTime(0);
  console.log(current_anime_id)
  let info = await GetAnimeInfo(current_anime_id)

  
  info["episodes"].forEach(element => {
    if(current_episode + 1 == element["number"]){
      
      ShowAnime(element["id"])
      

    }


  })
  
}

/* ============== HOME PAGE STUFF ==================*/



// Load Trending shows
async function GetTrending(){

  const response = await fetch(`http://localhost:3000/meta/anilist/trending?page=1&perPage=5`)
  const jsonData = await response.json();
  return jsonData;

}

async function GetPopular(){

  const response = await fetch(`http://localhost:3000/meta/anilist/popular?page=1&perPage=5`)
  const jsonData = await response.json();
  return jsonData;

}


async function HomePage(){
  let trending = await GetTrending()
  let popular = await GetPopular()

  console.log(trending)
  outputArea.innerHTML = ""

  outputArea.innerHTML += `<div class="container">`
  outputArea.innerHTML += `<p> top 5 trending Anime </p>`
  outputArea.innerHTML += `<div class="row a">`
  outputArea.innerHTML += `</div>`
  outputArea.innerHTML += `</div>`
  console.log(trending["results"])
  trending["results"].forEach(element => {
    $(".a").append(`
    <div class='col'>
      <div class="card bg-dark p-1 h-100">
        <div class="card-body text-align-center">
          <img src="${element["image"]}" width="100" height="150"><br>
          <p>${element["title"].english}</p>
          <a href="#" onclick="AnimeIndexinit('${element["title"].romaji}')">Watch</a>

        </div>
      </div>
    
    </div>
    `);

  })


  outputArea.innerHTML += `<div class="container">`
  outputArea.innerHTML += `<p class="pt-5"> top 5 popular Anime </p>`
  outputArea.innerHTML += `<div class="row b">`
  outputArea.innerHTML += `</div>`
  outputArea.innerHTML += `</div>`
  console.log(popular["results"])
  popular["results"].forEach(element => {
    $(".b").append(`
    <div class='col'>
      <div class="card bg-dark p-1 h-100">
        <div class="card-body text-align-center">
          <img src="${element["image"]}" width="100" height="150"><br>
          <p>${element["title"].english}</p>
          <a href="#" onclick="AnimeIndexinit('${element["title"].english}')">Watch</a>

        </div>
      </div>
    
    </div>
    `);
    

  })

}
async function AnimeIndexinit(txt){

  Yer(txt)
  searchText.innerHTML = txt
  //await searchBtn.click()

}

/* =================== NEWS =============== */

async function GetNewsAnime(){

  const response = await fetch(`http://localhost:3000/news/ann/recent-feeds?topic=anime`)
  const jsonData = await response.json();
  return jsonData;

}

async function NewsPage(){

  outputArea.innerHTML = `<img class="justify-content-center" width="100" height="100" src="https://media.tenor.com/DpgEL1ITpE4AAAAd/nanashi-mumei-loading.gif">`
  let news = await GetNewsAnime()
  console.log(news)
  let i = 0;
  outputArea.innerHTML = ""
  news.forEach(element => {

    i++
    if(i > 10){
      return;
    }

    outputArea.innerHTML += `
    
    <h1>${element["title"]}</h1>
    <p>${element["preview"].full}</p>
    <a href="${element["url"]}">Read more</a>
    <br>
    <br>
    <br>
    
    `
    

  })

}