let navToggle = document.getElementById("navToggle");
let navItems = document.getElementById("navItems");
let burgerMenu = document.getElementById("burgerMenu");
let closeMenu = document.getElementById("closeMenu");
navToggle.addEventListener('click', () => {
    navItems.classList.toggle('show_menu');
    burgerMenu.classList.toggle('d-none');
    closeMenu.classList.toggle('d-none')
})
//apis 
const apiKey = '04c35731a5ee918f014970082a0088b1';
const imagePath = 'https://image.tmdb.org/t/p/w1280';
//page numbers 
let pageNumber = 1;
let previousPageEle = document.getElementById("previousPageEle");
let nextPageEle = document.getElementById("nextPageEle");
let footerSectionEle = document.getElementById("footerSectionEle");

// create active link 
let activeLink = "";




//create and append search results 
let moviesList = document.getElementById("moviesList")

function getColorByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 6) {
        return 'orange';
    } else {
        return "red"
    }
}

function createAndAppendMovie(movieItem) {
    let {
        title,
        vote_average,
        poster_path,
        id,
        overview,
    } = movieItem

    let createMovieItem = document.createElement('li');
    createMovieItem.classList.add("movie-list-item");
    moviesList.appendChild(createMovieItem);

    // navigate to independent movie page 
    createMovieItem.addEventListener('click', () => {
        independentMovieResult(movieItem);
    })


    let createImageContainer = document.createElement('div');
    createMovieItem.classList.add('movie-image-container');
    createMovieItem.appendChild(createImageContainer);

    let movieImage = document.createElement('img');
    movieImage.classList.add('movie-image');
    movieImage.src = `${imagePath+poster_path}`;
    createImageContainer.appendChild(movieImage);

    let createMovieTextContainer = document.createElement('div');
    createMovieTextContainer.classList.add('movie-text-container');
    createMovieItem.appendChild(createMovieTextContainer);

    let createMoveiTitle = document.createElement('p')
    createMoveiTitle.classList.add('moviie-title');
    createMoveiTitle.textContent = title;
    createMovieTextContainer.appendChild(createMoveiTitle)

    let createRatingContainer = document.createElement('div');
    createRatingContainer.classList.add('rating-box');
    createMovieTextContainer.appendChild(createRatingContainer);

    let rating = document.createElement('p');
    rating.textContent = vote_average;
    let classColor = getColorByRate(vote_average)
    rating.classList.add('rating-text', classColor);
    createMovieTextContainer.appendChild(rating);

    let createOverviewContainer = document.createElement('div');
    createOverviewContainer.classList.add('overview-container');
    createMovieItem.appendChild(createOverviewContainer);

    let overviewText = document.createElement('p');
    overviewText.classList.add('overview-text');
    overviewText.textContent = overview;
    createOverviewContainer.appendChild(overviewText);
}


function invalidSearch() {
    let invalidImage = document.createElement('img');
    invalidImage.classList.add('invalid-image');
    invalidImage.src = "https://b.rgbimg.com/cache1nGk7A/users/h/hi/hisks/600/mhYExIC.jpg";
    moviesList.appendChild(invalidImage)

}

function displayResult(results) {
    for (let movie of results) {
        createAndAppendMovie(movie)
    }
    createPreviousNext()
}


// get the top rated movies on oppening of the page 
getTopRatedMovies();

//movies data apis 
async function getMoviesList() {
    const moviesPageUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;
    let response = await fetch(moviesPageUrl);
    let responseData = await response.json();
    let {
        results
    } = responseData
    displayResult(results)
}


// ------------------------------------------------------------on enter search input ----------------------------------------------------------------------
//search for a movie 
const movieSearchApi = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
async function onSearchMovies(searchUrl) {
    activeLink = "searchedMovies"
    footerSectionEle.classList.add('d-none')
    let response = await fetch(searchUrl);
    let responseData = await response.json();
    console.log(responseData)
    let {
        results
    } = responseData
    if (results.length !== 0) {
        displayResult(results)
    } else {
        invalidSearch()
    }
}

let inputSearchEle = document.getElementById("inputSearchEle");

inputSearchEle.addEventListener('keydown', () => {
    let searchInput = inputSearchEle.value;
    if (event.key === "Enter") {
        //change active link 
        //close the momberger menu and show menu 
        navItems.classList.remove('show_menu');
        burgerMenu.classList.remove('d-none');
        closeMenu.classList.add('d-none');
        // makes the entire movie list to null 
        moviesList.textContent = "";
        onSearchMovies(movieSearchApi + searchInput);
        inputSearchEle.value = "";
    }
})

//  ----------------------------------------Top Rated Movies ---------------------------------------------------------------------------------------------------------

// opening the page get the top rated movies or on click top rated movies get movies 
let topRatedMoviesEle = document.getElementById("topRatedMoviesEle");
async function getTopRatedMovies() {
    //on geting the movie list page should always come from start 
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    //console.log(pageNumber)
    //remove the old movies list 
    moviesList.textContent = "";
    // change status of active link to topRatedMovies
    activeLink = "topRatedMovies";
    //console.log(activeLink)
    // make sure the next and previous buttons are visable 
    footerSectionEle.classList.remove('d-none');
    const topratedMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    //console.log(topratedMoviesUrl);
    let response = await fetch(topratedMoviesUrl);
    let responseData = await response.json();
    // console.log(responseData)
    let {
        results
    } = responseData
    if (results.length !== 0) {
        displayResult(results)
    } else {
        invalidSearch()
    }
}

topRatedMoviesEle.addEventListener('click', () => {
    topRatedMoviesEle.classList.add('active-link');
    upComingMoviesELe.classList.remove('active-link');
    nowPlayingEle.classList.remove('active-link');
    favouriteMovieEle.classList.remove('active-link');
    //the below 3 steps closes show menu option on click . changes toggle menu to hamberger removes cross menu 
    navItems.classList.toggle('show_menu');
    burgerMenu.classList.toggle('d-none');
    closeMenu.classList.toggle('d-none');

    // get the top rated movies 
    pageNumber = 1;
    getTopRatedMovies();
})


// -----------------------------------------------------on clcik logo -----------------------------------------------------

// on click logo 
navLogoEle.addEventListener('click', () => {
    // get the top rated movies 
    pageNumber = 1;
    getTopRatedMovies();
})



//----------------------------------------------------up coming movies ----------------------------------------------------up
let upComingMoviesELe = document.getElementById("upComingMoviesELe");

async function getUpcomingMovies() {
    let upcomingMoviesUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    //on geting the movie list page should always come from start 
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    //console.log(pageNumber)
    //remove the old movies list 
    moviesList.textContent = "";
    // change status of active link to topRatedMovies
    activeLink = "upComingMovies";
    //console.log(activeLink);
    // make sure the next and previous buttons are visable 
    footerSectionEle.classList.remove('d-none');
    const response = await fetch(upcomingMoviesUrl);
    const responseData = await response.json();
    let {
        results
    } = responseData
    if (results.length !== 0) {
        displayResult(results)
    } else {
        invalidSearch()
    }
}


upComingMoviesELe.addEventListener('click', () => {
    topRatedMoviesEle.classList.remove('active-link');
    upComingMoviesELe.classList.add('active-link');
    nowPlayingEle.classList.remove('active-link');
    favouriteMovieEle.classList.remove('active-link');
    activeLink = "upComingMovies";
    //the below 3 steps closes show menu option on click . changes toggle menu to hamberger removes cross menu 
    navItems.classList.toggle('show_menu');
    burgerMenu.classList.toggle('d-none');
    closeMenu.classList.toggle('d-none');
    //ste page number to 1 and display movies 
    pageNumber = 1;
    getUpcomingMovies();
})


//----------------------------------------------------Now Playing------------------------------
let nowPlayingEle = document.getElementById("nowPlayingEle");
async function nowPlayingMovies() {
    let nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    //on geting the movie list page should always come from start 
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    //console.log(pageNumber)
    //remove the old movies list 
    moviesList.textContent = "";
    // change status of active link to topRatedMovies
    activeLink = "nowPlaying";
    //console.log(activeLink);
    // make sure the next and previous buttons are visable 
    footerSectionEle.classList.remove('d-none');
    const response = await fetch(nowPlayingUrl);
    const responseData = await response.json();
    let {
        results
    } = responseData
    if (results.length !== 0) {
        displayResult(results)
    } else {
        invalidSearch()
    }
}

nowPlayingEle.addEventListener('click', () => {
    topRatedMoviesEle.classList.remove('active-link');
    upComingMoviesELe.classList.remove('active-link');
    nowPlayingEle.classList.add('active-link');
    favouriteMovieEle.classList.remove('active-link');
    //the below 3 steps closes show menu option on click . changes toggle menu to hamberger removes cross menu 
    navItems.classList.toggle('show_menu');
    burgerMenu.classList.toggle('d-none');
    closeMenu.classList.toggle('d-none');
    activeLink = "nowPlaying";
    pageNumber = 1;
    nowPlayingMovies()
})

/*-------------------------------------------on click next and previous -------------------------------------------------------*/
previousPageEle.addEventListener('click', () => {
    pageNumber -= 1;
    if (activeLink === "topRatedMovies") {
        getTopRatedMovies();
    } else if (activeLink === "upComingMovies") {
        getUpcomingMovies()
    } else if (activeLink === "nowPlaying") {
        nowPlayingMovies()
    }
})
nextPageEle.addEventListener('click', () => {
    pageNumber += 1;
    //console.log(activeLink);
    if (activeLink === "topRatedMovies") {
        getTopRatedMovies();
    } else if (activeLink === "upComingMovies") {
        getUpcomingMovies()
    } else if (activeLink === "nowPlaying") {
        nowPlayingMovies()
    }
})


/* ----------------------------------------on click each Movie ---------------------------------------------------------*/
async function independentMovieResult(movieDetails) {
    showIndependentMovieItem(movieDetails);
}

function getFavouriteMoviesFromStorage() {
    let parsedMovieList = JSON.parse(localStorage.getItem('movieList'));
    if (parsedMovieList === null) {
        return []
    } else {
        return parsedMovieList
    }
}
let favouriteMovieList = getFavouriteMoviesFromStorage();
//console.log(favouriteMovieList);
async function showIndependentMovieItem(movieDetails) {
    //console.log(movieDetails)
    let {
        title,
        vote_average,
        release_date,
        poster_path,
        id,
        original_language,
        original_title,
        overview,
        popularity,
    } = movieDetails;
    moviesList.textContent = "";
    footerSectionEle.classList.add("d-none");

    // entire movie detail page 
    let movieDetailsPage = document.createElement("div");
    movieDetailsPage.classList.add('independent-movie-page');
    moviesList.appendChild(movieDetailsPage);

    // movie title image rating overview container
    let movieTitleImageContainer = document.createElement("div");
    movieTitleImageContainer.classList.add("movie-title-image-container");
    movieDetailsPage.appendChild(movieTitleImageContainer);

    //movie image 
    let indMovieImage = document.createElement("img");
    indMovieImage.src = `${imagePath+poster_path}`;
    indMovieImage.classList.add("ind-movie-image");
    movieTitleImageContainer.append(indMovieImage)

    //movie image container 
    let indCreateMovieTextContainer = document.createElement("div");
    indCreateMovieTextContainer.classList.add('ind-text-container');
    movieTitleImageContainer.appendChild(indCreateMovieTextContainer);

    // movie title and reating container 
    let indMovieTitleRating = document.createElement("div");
    indMovieTitleRating.classList.add("movie-title-rating-container");
    indCreateMovieTextContainer.appendChild(indMovieTitleRating);

    //movie title container 
    let indMovieTitleContainer = document.createElement("div");
    indMovieTitleContainer.classList.add("ind-movie-title-container");
    indMovieTitleRating.appendChild(indMovieTitleContainer);
    //movie title 
    let indCreateMoveiTitle = document.createElement('h1')
    indCreateMoveiTitle.classList.add('ind-movie-title');
    indCreateMoveiTitle.textContent = title;
    indMovieTitleContainer.appendChild(indCreateMoveiTitle)

    //movie rating container 
    let indCreateRatingContainer = document.createElement('div');
    indCreateRatingContainer.classList.add('ind-rating-box');
    indMovieTitleRating.appendChild(indCreateRatingContainer);
    // rating fof the movie 
    let indrating = document.createElement('p');
    indrating.textContent = vote_average;
    let classColor = getColorByRate(vote_average)
    indrating.classList.add('ind-rating-text', classColor);
    indCreateRatingContainer.appendChild(indrating);

    //overview container 
    let indOverviewContainer = document.createElement("div");
    indOverviewContainer.classList.add("ind-overview-container");
    indCreateMovieTextContainer.appendChild(indOverviewContainer);
    //overview heading 
    let indOverviewHeading = document.createElement("h1");
    indOverviewHeading.textContent = "OverView :";
    indOverviewHeading.classList.add("overview-heading");
    indOverviewContainer.appendChild(indOverviewHeading);
    //movie overview 
    let indMovieOverview = document.createElement("p");
    indMovieOverview.classList.add("ind-movie-overview");
    indMovieOverview.textContent = overview;
    indOverviewContainer.appendChild(indMovieOverview);
    // add to favourite 
    let indAddToFavourite = document.createElement("div");
    indAddToFavourite.classList.add('ind-add-favourite-container');
    movieTitleImageContainer.appendChild(indAddToFavourite);
    //favourite icon 
    let indFavouriteIcon = document.createElement("i");
    indFavouriteIcon.classList.add('bi', 'bi-heart', 'heart-shape');
    indAddToFavourite.appendChild(indFavouriteIcon)
    // favourite text
    let indFavouriteHeading = document.createElement('p');
    if (favouriteMovieList.includes(id)) {
        indFavouriteHeading.textContent = "UnFavourite";
    } else {
        indFavouriteHeading.textContent = "Favourite";
    }
    indFavouriteHeading.classList.add('favourite-text');
    indAddToFavourite.appendChild(indFavouriteHeading)

    indAddToFavourite.addEventListener('click', () => {
        indFavouriteIcon.classList.add('bi', 'bi-heart-fill');
        //console.log(favouriteMovieList.includes(id))
        if (!favouriteMovieList.includes(id)) {
            alert('added To Favourite');
            indFavouriteHeading.textContent = "Favourite";
            favouriteMovieList.push(id)
            localStorage.setItem('movieList', JSON.stringify(favouriteMovieList));
            getTopRatedMovies();
        } else if (favouriteMovieList.includes(id)) {
            let index = favouriteMovieList.indexOf(id);
            // console.log(index);
            alert('Movie Removed');
            favouriteMovieList.splice(index, 1);
            localStorage.setItem('movieList', JSON.stringify(favouriteMovieList));
            //console.log(favouriteMovieList)
            getTopRatedMovies();
        }
    })
    //remove icon 


    // div cbutton container
    // add back Button 
    let indBackButton = document.createElement("Button");
    indBackButton.textContent = "back";
    indBackButton.classList.add("ind-back-button");
    moviesList.appendChild(indBackButton);
    indBackButton.addEventListener('click', () => {
        if (activeLink === "topRatedMovies") {
            getTopRatedMovies();
        } else if (activeLink === "upComingMovies") {
            getUpcomingMovies()
        } else if (activeLink === "nowPlaying") {
            nowPlayingMovies()
        } else if (activeLink === "favouriyteMovies") {
            getTopRatedMovies();
        } else {
            getTopRatedMovies();
        }
    })
    /**
    // semilar movies container 
    let similarMoviesContainer = document.createElement('div');
    similarMoviesContainer.classList.add("similar-movies-container");
    movieDetailsPage.appendChild(similarMoviesContainer);

    let similarMoviesHeading = document.createElement("h1");
    similarMoviesHeading.textContent = "Similar Movies";
    similarMoviesHeading.classList.add("similar-movie-heading");
    similarMoviesContainer.appendChild(similarMoviesHeading);

    let SimilarMoviesList = document.createElement("ul");
    SimilarMoviesList.classList.add("movies-unordered-list");
    similarMoviesContainer.appendChild(SimilarMoviesList);*/

}

//-----------------------------------Get Favourite Movies List -----------------------------------

async function favouriteMovieListFun(id) {
    //console.log(id)
    activeLink = "favouriyteMovies";
    //remove the old movies list 
    moviesList.textContent = "";
    const generalMovieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
    let response = await fetch(generalMovieUrl);
    let responseData = await response.json();
    createAndAppendMovie(responseData)
}

favouriteMovieEle.addEventListener('click', () => {
    //make it as a active link 
    topRatedMoviesEle.classList.remove('active-link');
    upComingMoviesELe.classList.remove('active-link');
    nowPlayingEle.classList.remove('active-link');
    favouriteMovieEle.classList.add('active-link');
    footerSectionEle.classList.add('d-none');
    //the below 3 steps closes show menu option on click . changes toggle menu to hamberger removes cross menu 
    navItems.classList.toggle('show_menu');
    burgerMenu.classList.toggle('d-none');
    closeMenu.classList.toggle('d-none');
    activeLink = "favouriyteMovies";
    if (favouriteMovieList.length != 0) {
        for (let id of favouriteMovieList) {
            favouriteMovieListFun(id);
        }
    } else {
        moviesList.textContent = "";
        invalidSearch()
    }
})
