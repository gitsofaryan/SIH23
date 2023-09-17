let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}


const API_KEY = "4bda7c4f90b14dbbad82edebaa7c81ee";
const apiKey = "4bda7c4f90b14dbbad82edebaa7c81ee";
const baseUrl = "https://newsapi.org/v2/top-headlines";
const country = "in"; // Country code for India
const keyword = "nature"; // Keyword for disaster news (you can modify this)

// Create the URL with query parameters
const url = `${baseUrl}?country=${country}&apiKey=${apiKey}`;
const newsListContainer = document.getElementById("news-list");

// Make a GET request to the News API
fetch(url)
  .then((response) => {
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response
    return response.json();
  })
  .then((data) => {
    // Check if there are articles in the response
    if (data.totalResults > 0) {
      // Display the latest news articles
      const articles = data.articles;
      articles.forEach((article, index) => {
        const articleItem = document.createElement("div");
        articleItem.classList.add("article-item"); // You can add CSS classes as needed

        // Fill in the content of the article item
        articleItem.innerHTML = `
          <h3>${article.title}</h3>
          <p>Source: ${article.source.name}</p>
          <p>Published At: ${article.publishedAt}</p>
          <p>Description: ${article.description}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        `;

        // Append the article item to the news list container
        newsListContainer.appendChild(articleItem);
      });
    } else {
      console.log("No articles found.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
