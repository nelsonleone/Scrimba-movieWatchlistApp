const myWatchListArray = JSON.parse(localStorage.getItem('watchlist'))
const watchlistContainer = document.querySelector('main')
const myTheme = localStorage.getItem('theme')


function getTheme(theme){
    document.body.classList.toggle(theme)
}
getTheme(myTheme)

if (myWatchListArray.length === 0){
    document.querySelector('.explore').innerHTML = 
    `
    <p style="font-weight:700">You don't have any movie in your watch list</p>
    <div>
     <a href="index.html">
        Search Movies
        <i class="fa fa-search" style="color:#00ccff"></i>
      </a>
    </div>
    `
}

async function getMovieWatchList(){
    if(myWatchListArray.length){
        myWatchListArray.map(async title => { 
            const resp = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=defe2c01&t=${title}`)
            const data = await resp.json()
            setWatchListHtml(data)
       })
    }
}

async function setWatchListHtml(movie){
    const movieData = await movie;
    const movieDiv = document.createElement('div')
    let watchListHtml = 
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
             <span><i class="fa fa-minus" data-id="${movieData.imdbID}"></i>Watchlist</span>
          </div>
          <p>${movieData.Plot}</p>
       </div>
    </div>
    `
    movieDiv.innerHTML = watchListHtml;
    watchlistContainer.appendChild(movieDiv)
}

document.addEventListener('click',async(e) =>  {
    if(e.target.dataset.id){
       const movieIndex = await myWatchListArray.indexOf(e.target.id)
       myWatchListArray.splice(movieIndex,1)
       localStorage.setItem('watchlist',JSON.stringify(myWatchListArray))
       getMovieWatchList()
    }
})
getMovieWatchList()
// localStorage.removeItem('watchlist')

