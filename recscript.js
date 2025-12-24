const FOLDER_ID = '149R2-dRHqK7fVY6eXcq7QpXiLqkawSpx'; // Example folder ID

// Load the Google API client
function loadClient() {
    gapi.client.setApiKey('AIzaSyDV3x1vtzQQEBKw5CvKBh32d5Noviydy10'); // Your API key here
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/drive/v3/rest');
}

// Function to handle the pagination and list files
function listFiles(pageToken = null) {
    // API request with pagination support
    gapi.client.drive.files.list({
        q: `'${FOLDER_ID}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif' or mimeType='image/webp')`, // Include additional types if needed
        fields: 'files(id, name, thumbnailLink, webViewLink), nextPageToken', // Requesting nextPageToken for pagination
        pageToken: pageToken // This ensures we continue fetching if there's a next page
    }).then((response) => {
        const files = response.result.files;
        const container = document.getElementById('photo-gallery-container');
        if (files && files.length > 0) {
            files.forEach((file) => {
                const img = document.createElement('img');
                img.src = file.thumbnailLink; // Set the thumbnail as the image source
                img.alt = file.name;
                img.title = file.name;
                img.classList.add('lazy-load'); // Add class for lazy loading

                img.onclick = () => window.open(file.webViewLink, '_blank'); // Open full image in a new tab

                // Append the image to the gallery container
                container.appendChild(img);
            });
        } else {
            console.log('No images found.');
        }

        // Check if there is a next page and recursively fetch more files
        if (response.result.nextPageToken) {
            listFiles(response.result.nextPageToken);
        }
    }).catch((error) => {
        console.error('Error listing files:', error);
    });
}

// Initialize the API client and load the image files
function init() {
    gapi.load('client', () => {
        loadClient().then(() => {
            listFiles(); // Fetch and display images once the client is loaded
        });
    });
}

// Load the API client on page load
window.onload = init;