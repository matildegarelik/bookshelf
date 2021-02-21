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
                output+=`</p><button onclick=bookSelected("${book.id}")>Select</button></div></div>`;
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
                output+=`</p><button onclick=bookSelected("${book.id}")>Select</button></div></div>`;
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

function bookSelected(id){
    sessionStorage.setItem("bookId", id);
    window.location = 'book';
    return false;
}

function getBook(){
    let bookId = sessionStorage.getItem('bookId');
    axios.get('https://www.googleapis.com/books/v1/volumes/'+bookId)
        .then((response) => {
            console.log(response);
            let book= response.data;
            console.log(book);
            let output =`<div class="row"><div class="col-md-4">`;
            if (book.volumeInfo.imageLinks){
                output+=`<img src="${book.volumeInfo.imageLinks.thumbnail}">`;
            }else{
                output+=`<img src="https://www.walterbrueggemann.com/wp-content/uploads/1971/01/Book-Cover-Unavailable.png" width="256px" height="412px">`;
            }
            output+=`</div>
                <div class="col-md-8">
                    <h2>${book.volumeInfo.title}</h2>
                    <h3>${book.volumeInfo.subtitle}</h3>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Authors:</strong> ${book.volumeInfo.authors}</li>
                        <li class="list-group-item"><strong>Published date:</strong>${book.volumeInfo.publishedDate}</li>
                        <li class="list-group-item"><strong>Publisher:</strong> ${book.volumeInfo.publisher}</li>
                        <li class="list-group-item"><strong>Language:</strong> ${book.volumeInfo.language}</li>
                        <li class="list-group-item"><strong>Pages (printed):</strong> ${book.volumeInfo.printedPageCount}</li>
                    </ul>
                </div></div>
                <div class="row">
                    <div class="well">
                        <h3>Description</h3>
                        ${book.volumeInfo.description}
                        <hr>
                        <a href="https://books.google.com.ar/books/?id=${bookId}" target="_blank" class="btn btn-primary">View in Google Books</a>
                        <a href="search" class="btn btn-default">Go Back To Search</a>
                    </div>
                </div>
                <div class="container" id="select_book">
                    <button type="btn btn-info" onclick="addBook(${bookId})">Add to my bookshelf</button>
                </div>
            `;
            $('#book').html(output);
        })
        .catch((err) => {
            console.log(err);
        })
}

function addBook(id){
    //Create a pop up div with form that adds element book to database
}