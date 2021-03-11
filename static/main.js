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
    var my_books = `{{my_books}}`;
    console.log(my_books);
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
                        <a href="search" class="btn btn-default">Go Back To Search</a><br><br>
                    </div>
                </div>`;
                var m = 0;
                for (b in my_books){
                    if (b.gb_id == bookId){
                        m = 1;
                    }
                }
                if (m>0){
                    output +=`<button class="btn btn-success" disabled>&check Already in my bookshelf</button>`;
                }else{
                    output +=`<button class="btn btn-info" onclick="togglePopUp()">Add to my bookshelf</button>`;
                };
                output +=`
                <div class="container">
                    <div class="popup" id="popup-1">
                        <div class="overlay"></div>
                        <div class="content">
                            <div class="close-btn" onclick="togglePopUp()">&times;</div>
                            <h1>Add to personal boookshelf</h1>
                            <form method="POST">
                                <label>Google books ID: </label>
                                <input value="${book.id}" name="gb_id" readonly><br>
                                <label>Industry Identifier Type: </label>
                                <input value="${book.volumeInfo.industryIdentifiers[0].type}" name="iit" readonly><br>
                                <label>Industry Identifier's Value: </label>
                                <input value="${book.volumeInfo.industryIdentifiers[0].identifier}" name="iiv" readonly><br>
                                <label>Category: </label>
                                <input type="text" required name="category"><br>
                                <label>State: </label>
                                <input type="text" value="Unread" name="state" required><br>
                                <input type="submit" class="btn btn-success"  value="ADD">
                            </form>
                        </div>
                    </div>
                </div>
            `;
            $('#book').html(output);
        })
        .catch((err) => {
            console.log(err);
        })
}

function togglePopUp(){
    document.getElementById("popup-1").classList.toggle("active");
}
