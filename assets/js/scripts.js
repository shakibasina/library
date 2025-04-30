document.addEventListener('DOMContentLoaded', function() {
    const today = getToday()
    const last_day = localStorage.getItem("last_day")

    if (last_day){
        if (last_day !== today){
            localStorage.setItem("last_day", today)
            reset_readings()
        }
    }else{
        localStorage.setItem("last_day", today)
    }

    function getToday(){
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const day = String(today.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }
    function reset_readings(){
        books_list = localStorage.getItem("books_list")
        if (books_list){
            books_list = JSON.parse(books_list)
            for (book of books_list) {
                localStorage.setItem(`pages_read_${book}`, 0)
            }
        }
    }
});
