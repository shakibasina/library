document.addEventListener('DOMContentLoaded', function() {
    const bookContainer = document.querySelector('.book'); // The <ul> element
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const bookTitleMeta = document.querySelector('meta[name="book_title"]');
    const bookTitle = bookTitleMeta ? bookTitleMeta.getAttribute('content') : 'default_book';
    const lastPageKey = `last_page_${bookTitle}`;
    const pagesReadKey = `pages_read_${bookTitle}`;
    let currentPageIndex = parseInt(localStorage.getItem(lastPageKey)) || 0;
    let isAnimating = false;

    function add_pages(){
        const urlParams = new URLSearchParams(window.location.search)
        const book_name = urlParams.get("book_name")
        
        if (book_name){
            const content = localStorage.getItem(`content_${book_name}`)
            if (content){
                bookContainer.innerHTML = content
            }
        }
    }
    add_pages()
    
    const pages = document.querySelectorAll('.page'); // Re-select pages after creation

    function updateBook() {
        pages.forEach((page, index) => {
            page.classList.remove('flipped', 'flipping');
            if (index < currentPageIndex) {
                page.classList.add('flipped');
            } else if (index === currentPageIndex) {
                page.style.zIndex = pages.length;
            } else {
                page.style.zIndex = pages.length - index;
            }
        });

        prevButton.disabled = currentPageIndex === 0;
        nextButton.disabled = currentPageIndex === pages.length - 1;

        localStorage.setItem(lastPageKey, currentPageIndex.toString());
        localStorage.setItem(pagesReadKey, currentPageIndex.toString());
    }

    function turnPageForward() {
        if (isAnimating || currentPageIndex >= pages.length - 1) return;
        isAnimating = true;
        const currentPage = pages[currentPageIndex];
        const nextPage = pages[currentPageIndex + 1];

        currentPage.classList.add('flipping');
        nextPage.style.zIndex = pages.length + 1;

        setTimeout(() => {
            currentPage.classList.remove('flipping');
            currentPageIndex++;
            updateBook();
            isAnimating = false;
        }, 800);
    }

    function turnPageBackward() {
        if (isAnimating || currentPageIndex <= 0) return;
        isAnimating = true;
        const currentPage = pages[currentPageIndex];
        const previousPage = pages[currentPageIndex - 1];

        currentPage.classList.add('flipping');
        currentPage.style.zIndex = pages.length + 1;

        setTimeout(() => {
            currentPage.classList.remove('flipping');
            currentPageIndex--;
            updateBook();
            isAnimating = false;
        }, 800);
    }

    // Initialize the book based on the last saved page (after pages are created)
    if (pages.length > 0 && currentPageIndex < pages.length) {
        updateBook();
    } else {
        currentPageIndex = 0;
        updateBook(); // Ensure initial state is set even if last page is out of bounds
    }

    pages.forEach((page, index) => {
        page.addEventListener('click', function(event) {
            if (isAnimating) return;

            if (index === currentPageIndex && currentPageIndex < pages.length - 1) {
                turnPageForward();
            } else if (index < currentPageIndex && !isAnimating) {
                const clickedPage = pages[index];
                clickedPage.classList.add('flipping');
                clickedPage.style.zIndex = pages.length + 1;
                setTimeout(() => {
                    clickedPage.classList.remove('flipping');
                    currentPageIndex = index;
                    updateBook();
                    isAnimating = false;
                }, 800);
            }
        });
    });

    prevButton.addEventListener('click', turnPageBackward);
    nextButton.addEventListener('click', turnPageForward);
});
