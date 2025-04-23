document.getElementById('add-img-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(this);
    let token = localStorage.getItem('token')

    // Send POST request to your backend API endpoint
    fetch('http://localhost:5678/api/works', {
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                console.log(response)
                throw new Error('Network response was not ok', formData);
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response from the server
            console.log('Data sent successfully:', data);
            dynamicRefresh()
        })
        .catch(error => {
            // Handle error
            console.error('There was a problem with the form submission:', error);
        });
});


async function removeWork() {
    let deleteImgBtns = document.querySelectorAll('.delete-img-btn');
    console.log(deleteImgBtns);

    deleteImgBtns.forEach(deleteImgBtn => {
        console.log(deleteImgBtn);
        deleteImgBtn.addEventListener('click', async function () {
            // Get the work id from the deleteImgBtn
            let workId = deleteImgBtn.getAttribute('work-id');
            // Construct the URL for the DELETE request
            let url = `http://localhost:5678/api/works/${workId}`;
            let token = localStorage.getItem('token')
            try {
                // Send the DELETE request
                let response = await fetch(url, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Optionally handle the response, for example:
                let data = await response.json();
                console.log('Work removed:', data);

                // Refresh the page
                await dynamicRefresh();
            } catch (error) {
                console.error('Error removing work:', error);
            }
            await dynamicRefresh()
        });
    });
}



const fileInput = document.getElementById('add-img-file');
const previewImg = document.getElementById('preview-img');
const placeholder = document.getElementById('add-img-input-placeholder');

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.style.display = 'none';
        placeholder.style.display = 'block';
    }
});


// DISABLE SUBMIT WHEN FORM IS NOT FILLED

let requiredFields = document.getElementsByClassName("input-add-img")
let submitBtn = document.getElementById("add-img-submit")
let addImgForm = document.getElementById("add-img-form")

addImgForm.addEventListener('input', function () {
    let allFilled = true;

    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].value === '') {
            allFilled = false;
            break;
        }
    }

    if (allFilled) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'disabled');
    }
})
