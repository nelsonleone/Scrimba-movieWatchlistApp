const searchInput = document.querySelector('input')
const searchButton = document.getElementById('search-btn')
const container = document.getElementById('movie')
const exploreDiv = document.querySelector('.explore')
const apiURL = 'https://www.omdbapi.com/?i=tt3896198&apikey=defe2c01&';
const watchListArray = localStorage.getItem("watchlist") ? JSON.parse(localStorage.getItem("watchlist")) : []
let movieSearchArray = []
let foundMoviesArray;


// handling the theme switch 
const toggle = document.querySelector('.toggle')
let loadingImg =  "images/icon-gear.svg";

// handling the default theme on document load
const defaultTheme = localStorage.getItem('theme')
window.onload = document.body.classList.add(defaultTheme)
if(defaultTheme === 'theme1'){
    toggle.style.left = '2%'
}else if(defaultTheme === 'theme2'){
    toggle.style.left = '57%'
    loadingImg = "images/icon-gear2.svg";
}


toggle.addEventListener('click',handleTheme)

function handleTheme(){
    if(document.body.classList.contains('theme1')){
        document.body.classList.add('theme2')
        document.body.classList.remove('theme1')
        toggle.style.left = '57%'
        loadingImg = "images/icon-gear2.svg";
        localStorage.setItem('theme','theme2')
    }else{
        document.body.classList.add('theme1')
        document.body.classList.remove('theme2')
        loadingImg =  "images/icon-gear.svg";
        toggle.style.left = '2%'
        localStorage.setItem('theme','theme1')
    }
}


searchButton.addEventListener('click',() => {
    if(searchInput.value.length){
        handleSearchRequest()
    }else{
        document.querySelector('.explore').innerHTML = `Please enter a movie name `;
    }
})
function handleSearchRequest(){
    getMovieSearch().then(() => renderMovie());
}
async function getMovieSearch(){
    const search = searchInput.value.toLocaleUpperCase().trim();
    exploreDiv.innerHTML = `<img src="${loadingImg}" class="loading">`;
    const URL = `${apiURL}s=${search}`;
    const resp =  await fetch(`${URL}`)
    const data = await resp.json()

    if(data.Response === "True"){
       movieSearchArray = data.Search;
       foundMoviesArray = movieSearchArray.map(search => findMovies(search.Title))
       return foundMoviesArray;
    }else{
      document.querySelector('.explore').innerHTML = `Unable to find what you are looking for`
    }
}

async function findMovies(title){
    const resp = await fetch(`${apiURL}t=${title}`)
    const data = await resp.json();
    return data;
}

async function setMoviesHtml(){
    let movieListHtml = ``;
    await foundMoviesArray.forEach( async movie => {
        const movieDiv = document.createElement('div')
        movieData = await movie;
        movieListHtml = 
        `
        <div class="movie-contents">
           <div class="movie-poster">
             <img src="${movieData.Poster}" alt="Movie Poster">
           </div>

           <div class="movie-textContext">
              <div class="movie-detailsheader">
                 <h1>${movieData.Title}</h1>
                 <span>
                 <i class="fa fa-star" aria-hidden="true"></i>
                 ${movieData.imdbRating}
                 </span>
              </div>
              <div class="row">
                 <span>${movieData.Runtime}</span>
                 <span>${movieData.Genre}</span>
                 <span><i class="fa fa-plus" data-id="${movieData.Title}"></i>Watchlist</span>
              </div>
              <p>${movieData.Plot}</p>
           </div>
        </div>
        `
        movieDiv.innerHTML = movieListHtml;
        container.appendChild(movieDiv)
    })
}


// handling the watchlist add Button response
document.addEventListener('click',async(e) =>  {
    if( e.target.dataset.id){
        watchListArray.push(e.target.dataset.id) 
        localStorage.setItem("watchlist", JSON.stringify(watchListArray))
        handleAdded(e)
    }
})

function handleAdded(e){
    if(e.target.classList.contains('fa-plus')){
        e.target.classList.add('fa-check')
        e.target.classList.remove('fa-plus')
    }
}




function renderMovie(){
    setMoviesHtml()
    movieSearchArray = []
    searchInput.value = '';
    container.innerHTML = '';
    document.querySelector('.explore').innerHTML = `<img src="${loadingImg}" class="loading">`
    setTimeout(() => {
        document.querySelector('.explore').innerHTML = ``;
    }, 2000);;
}
