$(function(){

    // JSON 파일 불러오기
    page=0
    show(page,1)
})

//page : book.json 어디서부터 출력할건지
//btn_nm : 버튼 숫자 
function show(page, btn_nm){

    // URL 파라미터 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const categories = [];
    const tag = urlParams.get('tag');

    
    if (tag) {
        $('#category-title').text(tag);
    }

    urlParams.forEach((value, key) => {
        if (key.startsWith('cate')) {
            categories.push(value);
        }
    });

    $.ajax({
        url: './static/json/book2.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            let books = [];
            
            categories.forEach(category => {
                books = books.concat(data.item.filter(book => book.class_nm === category));
            });
            const bookList = $('#book-list');

            // 책 리스트 출력
            const html = books.slice(page,page+30).map((book) => `
                <div class="box data-link" data-isbn="${book.ISBN}"><a href="view-book.html">
                    <img src="${book.ImageURL}" alt="img" onerror="this.onerror=null; this.src='./static/logo.png'">
                    <h3>${book.bookname}</h3>
                    <p>${book.author}</p></a>
                </div>
            `).join('');
            bookList.html(html);


            //클릭 시 view 페이지 
            $(".data-link").click(function() {
                const isbn = $(this).data('isbn');
                const selectedBook = books.find(book => book.ISBN == isbn);
                if (selectedBook) {
                    localStorage.setItem('selectedBook', JSON.stringify(selectedBook));
                }
            });


//**페이징**
            const totalItems = Math.ceil(books.length/30);
            btns=`<div id="min_prev"><i class="fas fa-angle-double-left"></i></div><div id="prev"><i class="fas fa-caret-left"></i></div>`;

            if(btn_nm<3){//페이지가 3보다 작을 때
                for(var i=1;i<6;i++){
                    btns+=`<button>${i}</button>`
                }
            }else if(btn_nm>totalItems-4){//페이지가 마지막 페이지에 가까울 때
                for(var i=totalItems-4;i<=totalItems;i++){
                    btns+=`<button>${i}</button>`
                }
            }else{
                for(var i=btn_nm-2;i<btn_nm+3;i++){
                    if(i<totalItems) btns+=`<button>${i}</button>`
                }
            }

            btns+=`<div id="next"><i class="fas fa-caret-right"></i></div><div id="max_next"><i class="fas fa-angle-double-right"></i></div>`;

            $(".page-btn").html(btns)

            $(".page-btn button").click(function(){
                btn_nm=(Number($(this).text()))
                page=(btn_nm-1)*30;
                console.log("this page:",btn_nm)
                show(page, btn_nm)//page=어디서부터 출력할지 
            })
            
            //추가사항2 이전페이지 다음페이지 첫페이지 막페이지
            $(".page-btn #prev").click(function(){
                if(btn_nm>1){
                    --btn_nm;
                    page=(btn_nm-1)*30;
                    console.log("this page(prev):",btn_nm)
                }
                show(page, btn_nm)
            })
            $(".page-btn #next").click(function(){
                if(btn_nm<totalItems){
                    ++btn_nm;
                    page=(btn_nm-1)*30;
                    console.log("this page(next):",btn_nm)
                }
                show(page, btn_nm)
            })
            $(".page-btn #min_prev").click(function(){
                show(0, 1)
            })
            $(".page-btn #max_next").click(function(){
                btn_nm=totalItems;
                page=(btn_nm-1)*30;
                console.log("this page(next):",btn_nm)
                show(page, btn_nm)
            })

        },
        error: function(request, status, error) {
            console.error('Error fetching the JSON:', error);
        }
    });
}