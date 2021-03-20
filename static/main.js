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
            let m = 0;
            $.each(books, (index, book) => {
            //while (i < 11){
                m++;
                output+= `<div class="col-md-3"><div class="box"><div class="well text-center">`
                if (book.volumeInfo.imageLinks){
                    output+= `<img src="${book.volumeInfo.imageLinks.thumbnail}" width="128px" height="206px">`
                }else{
                    output+= `<img src="https://www.walterbrueggemann.com/wp-content/uploads/1971/01/Book-Cover-Unavailable.png" width="128px" height="206px">`
                }
                output+= `<div class="book-title"><h5>${book.volumeInfo.title}</h5></div><div class="book-author"<p>Autor(es): `
                if (book.volumeInfo.authors){
                    output+= `${book.volumeInfo.authors}`
                }
                output+=`</p></div></div><div class="select"><button class="btn btn-info" onclick=bookSelected("${book.id}")>Select</button></div></div></div>
                ${m % 4 == 0 ? `</div><div class="row">`:``}`
            });
            output += `</div><br><div id="btn-more" style="text-align: center;"><button class="btn btn-info" onclick="loadMore()">Load more</button></div><br>`
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
            let m = 0;
            let output = `<div id="load_${start_index}" class="row">`;
            $.each(books, (index, book) => {
                m++;
                output+= `<div class="col-md-3"><div class="box"><div class="well text-center">`
                if (book.volumeInfo.imageLinks){
                    output+= `<img src="${book.volumeInfo.imageLinks.thumbnail}" width="128px" height="206px">`
                }else{
                    output+= `<img src="https://www.walterbrueggemann.com/wp-content/uploads/1971/01/Book-Cover-Unavailable.png" width="128px" height="206px">`
                }
                output+= `<div class="book-title"><h5>${book.volumeInfo.title}</h5></div><div class="book-author"<p>Autor(es): `
                if (book.volumeInfo.authors){
                    output+= `${book.volumeInfo.authors}`
                }
                output+=`</p></div></div><div class="select"><button class="btn btn-info" onclick=bookSelected("${book.id}")>Select</button></div></div></div>
                ${m % 4 == 0 ? `</div><div class="row">`:``}`
            });
            $('#btn-more').remove();
            output += `</div><br><div id="btn-more" style="text-align: center;"><button class="btn btn-info" onclick="loadMore()">Load more</button></div><br>`
            $('#books').append(output);
            $('html, body').animate({scrollTop: $(`#load_${start_index}`).offset().top}, 1000);
        })
        .catch((err) => {
            console.log(err);
        })
    
}

function bookSelected(id){
    sessionStorage.setItem("bookId", id);
    window.location = `book_${id}`;
    return false;
}

