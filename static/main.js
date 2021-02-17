$(document).ready(()=> {
    $('#searchForm').on('submit', (e)=> {
        e.preventDefault();
        let searchText = $('#searchText').val();
        getBooks(searchText);
    }) 
});


function getBooks(searchText){
    //fetch('http://openlibrary.org/search.json?q='+searchText)
    fetch('https://www.googleapis.com/books/v1/volumes?q='+searchText+'&key=AIzaSyC7NZvD04yBnHpog9eRJdlRhgk41z8y_aI&maxResults=20')
        .then(a=>a.json())
        .then((response) => {
            console.log(response.items);
            let books= response.items;
            let output = `<div class="row">`;
            $.each(books, (index, book) => {
            //while (i < 11){
                output+= `<div class="col-md-3"><div class="well text-center">`
                if (book.volumeInfo.imageLinks){
                    output+= `<img src="${book.volumeInfo.imageLinks.thumbnail}">`
                }else{
                    output+= `<img src="https://www.walterbrueggemann.com/wp-content/uploads/1971/01/Book-Cover-Unavailable.png" width="128px" height="206px">`
                }
                output+= `<h5>${book.volumeInfo.title}</h5><p>Autor(es): `
                if (book.volumeInfo.authors){
                    output+= `${book.volumeInfo.authors}`
                }
                output+=`</p></div></div>`;
            });
            output += `</div><br><div id="btn-more" style="text-align: center;"><button class="btn btn-primary" onclick="loadMore()">Load more</button></div><br>`
            $('#books').html(output);
        })
        .catch((err) => {
            console.log(err);
        })
}

function loadMore(){
    let searchText = $('#searchText').val();
    var start_index= ($('#books .row').length)*20+1;
    console.log(start_index);
    fetch('https://www.googleapis.com/books/v1/volumes?q='+searchText+'&key=AIzaSyC7NZvD04yBnHpog9eRJdlRhgk41z8y_aI&maxResults=20&startIndex='+start_index)
        .then(a=>a.json())
        .then((response) => {
            console.log(response.items);
            let books= response.items;
            let output = `<div id="load_${start_index}" class="row">`;
            $.each(books, (index, book) => {
            //while (i < 11){
                output+= `<div class="col-md-3"><div class="well text-center">`
                if (book.volumeInfo.imageLinks){
                    output+= `<img src="${book.volumeInfo.imageLinks.thumbnail}">`
                }else{
                    output+= `<img src="https://www.walterbrueggemann.com/wp-content/uploads/1971/01/Book-Cover-Unavailable.png" width="128px" height="206px">`
                }
                output+= `<h5>${book.volumeInfo.title}</h5><p>Autor(es): `
                if (book.volumeInfo.authors){
                    output+= `${book.volumeInfo.authors}`
                }
                output+=`</p></div></div>`;
            });
            $('#btn-more').remove();
            output += `</div><br><div id="btn-more" style="text-align: center;"><button class="btn btn-primary" onclick="loadMore()">Load more</button></div><br>`
            $('#books').append(output);
            $('html, body').animate({scrollTop: $(`#load_${start_index}`).offset().top}, 1000);
        })
        .catch((err) => {
            console.log(err);
        })
    
}

/*function bookSelected(id){
    sessionStorage.setItem("movieId", id);
    window.location = 'movie.html';
    return false;
}

function getMovie(){
    let movieId = sessionStorage.getItem('movieId');
    axios.get('http://www.omdbapi.com/?apikey=74c31c16&i='+movieId)
        .then((response) => {
            console.log(response);
            let movie= response.data;
            let output =`
                <div class="row">
                    <div class="col-md-4">
                        <img src="${movie.Poster}" class="thumbnail">
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.Title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                            <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                            <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                            <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                            <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                            <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="well">
                        <h3>Plot</h3>
                        ${movie.Plot}
                        <hr>
                        <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
                        <a href="index.html" class="btn btn-default">Go Back To Search</a>
                    </div>
                </div>
            `;
            $('#movie').html(output);

        })
        .catch((err) => {
            console.log(err);
        })
}*/