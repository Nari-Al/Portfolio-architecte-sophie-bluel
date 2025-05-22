async function editorMode() {

  let token = localStorage.getItem('token')
  let modificationBtn = document.getElementById('modificationBtn')
  let editorBanner = document.getElementById('editor-banner')
  let editorBannerMargin = document.getElementById('editor-banner-margin')
  let addImageBtn = document.getElementById('add-img-btn')
  let modaleAddImage = document.getElementById('modale-inner-add')
  let addImagePseudoInput = document.getElementById('add-img-pseudo-input')
  console.log(addImageBtn)
  // Modale
  let closeModaleBtn = document.getElementById('close-modale-btn')
  let returnModaleBtn = document.getElementById('return-modale-btn')
  let outerModale = document.getElementById('modale')
  if (token) {
    modificationBtn.style.display = 'block'
    editorBanner.style.display = 'block'
    editorBannerMargin.style.display = 'block'

    // Open the modale
    modificationBtn.addEventListener('click', function () {
      modale.style.display = 'flex'
    })

    // Handle closing the modale
    closeModaleBtn.addEventListener('click', function () {
      modale.style.display = 'none'
    })
    outerModale.addEventListener('click', function (event) {
      if (event.target.closest('#modale-inner-gallery') == null
        && event.target.closest('div') != modaleAddImage
        && event.target.closest('div') != returnModaleBtn
        && event.target.closest('div') != addImagePseudoInput) {
        modale.style.display = 'none'
      }
    })
    addImageBtn.addEventListener('click', function () {
      modaleAddImage.style.display = 'flex'
    })
    returnModaleBtn.addEventListener('click', function () {
      modaleAddImage.style.display = 'none'
    })
  } else {
    modificationBtn.style.display = 'none'
    editorBanner.style.display = 'none'
    editorBannerMargin.style.display = 'none'
  }
}

editorMode()

// FETCH

async function fetchData() {
  // Fetch data from API
  const response = await fetch('http://localhost:5678/api/works');

  // Transform it into a JSON
  const worksArray = await response.json();

  // Return the array of works (now that it's readable by front)
  return worksArray;
}

// APPEND WORKS TO PORTFOLIO

async function appendWorks() {
  // Get the works data (from API)
  const works = await fetchData();

  // Get the gallery element
  const gallery = document.querySelector('.gallery');

  // Loop and append a figure for each work in works
  works.forEach(work => {
    // Define <figure> element
    const figure = document.createElement('figure');
    figure.setAttribute('category', work.category.name);

    // Define <img> element
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    // Define <figcaption> element
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    // Append <img> and <figcaption> to <figure>
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Append <figure> to the gallery
    gallery.appendChild(figure);
  });

  // FOR THE MODALE
  // Get the gallery element
  const modaleGallery = document.querySelector('.modale-gallery-container');

  // Loop and append a figure for each work in works
  works.forEach(work => {
    // Define <figure> element
    const figure = document.createElement('figure');
    figure.setAttribute('category', work.category.name);

    // Define <img> element
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    // Define img-delete-btn element
    const deleteImgBtn = document.createElement('div');
    deleteImgBtn.classList = 'delete-img-btn';
    deleteImgBtn.setAttribute('work-id', work.id);
    deleteImgBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>'

    // Add <img> element and deleteImgBtn to <figure>
    figure.appendChild(img);
    figure.appendChild(deleteImgBtn);

    // Append <figures> elements to gallery
    modaleGallery.appendChild(figure)
  })
  await removeWork()
}

// Call the appendWorks to create the works in the gallery in the portfolio
appendWorks();


// FILTERS
// Count the unique categories

async function fetchCategoryData() {
  // Fetch data from API
  const response = await fetch('http://localhost:5678/api/categories');

  // Transform it into a JSON
  const categoriesArray = await response.json();

  // Return the array of works (now that it's readable by front)
  return categoriesArray;
}

// For each unique category create a filter in filters

async function createFilters() {
  let categories = await fetchCategoryData()
  console.log(categories)
  let filters = document.querySelector('.filters')
  let selectAddImg = document.querySelector('#add-img-category')

  categories.forEach(category => {
    // Define .filter div
    const filter = document.createElement('div');
    filter.className = "filter";
    filter.innerHTML = category.name;

    // Append .filter divs
    filters.appendChild(filter);

    // Define option in modale
    const modaleOption = document.createElement('option')
    modaleOption.innerHTML = category.name;
    modaleOption.value = category.id;
    selectAddImg.appendChild(modaleOption)
  })
}

async function filterVisual() {
  await createFilters();
  let filters = document.querySelectorAll('.filter');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Remove the "selected" class from all filters
      filters.forEach(otherFilter => {
        otherFilter.classList.remove('selected');
      });
      // Add the "selected" class to the clicked filter
      filter.classList.add('selected');
      // Filter the content
      let selectedFilter = filter.innerText
      let figures = document.querySelectorAll('figure')

      figures.forEach(figure => {
        let category = figure.getAttribute('category')
        if (category === selectedFilter) {
          figure.style.display = 'block'
        } else {
          if (selectedFilter == 'Tous') {
            figure.style.display = 'block'
          } else {
            figure.style.display = 'none'
          }

        }
      })
    });
  });
}

// Call the function to filter gallery
filterVisual();


async function dynamicRefresh() {
  // Wipe the page
  let filters = document.querySelector('.filters')
  filters.innerHTML = ''
  const gallery = document.querySelector('.gallery')
  gallery.innerHTML = ''
  const modaleGallery = document.querySelector('.modale-gallery-container')
  modaleGallery.innerHTML = ''

  // Refill the page
  await filterVisual()
  await appendWorks()
  await removeWork()
  console.log("Page refreshed")
}