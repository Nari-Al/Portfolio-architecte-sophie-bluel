async function editorMode() {
  
  let token = localStorage.getItem('token')
  let modificationBtn = document.getElementById('modificationBtn')
  let addImageBtn = document.getElementById('add-img-btn')
  console.log(addImageBtn)
  // Modale
  let closeModaleBtn = document.getElementById('close-modale-btn')
  let outerModale = document.getElementById('modale')
  if (token) {
    modificationBtn.style.display = 'block'
    
    // Open the modale
    modificationBtn.addEventListener('click', function() {
      modale.style.display = 'flex'
    })

    // Handle closing the modale
    closeModaleBtn.addEventListener('click', function() {
      modale.style.display = 'none'
    })
    outerModale.addEventListener('click', function(event) {
      if (event.target.closest('#modale-inner-gallery') == null) {
        modale.style.display = 'none'
      }
    })
  } else {
    modificationBtn.style.display = 'none'
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

      // Define <img> element
      const deleteImgBtn = document.createElement('div');
      deleteImgBtn.classList = 'delete-img-btn';
      
      // Add <img> element and deleteImgBtn to <figure>
      figure.appendChild(img);
      figure.appendChild(deleteImgBtn);

      // Append <figures> elements to gallery
      modaleGallery.appendChild(figure)
    })
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
    categories.forEach(category => {
        // Define .filter div
      const filter = document.createElement('div');
      filter.className = "filter";
      filter.innerHTML = category.name;

      // Append .filter divs
      filters.appendChild(filter);
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

