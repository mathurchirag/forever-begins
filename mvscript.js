const FOLDER_ID = '1QH01YWV5Hq87pF5otUPZSB4IytUCAahc'; // Your Google Drive folder ID

function loadClient() {
    gapi.client.setApiKey('AIzaSyDV3x1vtzQQEBKw5CvKBh32d5Noviydy10'); // Your API key
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/drive/v3/rest');
}

function listVideos(pageToken = null) {
    gapi.client.drive.files.list({
        q: `'${FOLDER_ID}' in parents and (mimeType='video/mp4' or mimeType='video/quicktime' or mimeType='video/x-msvideo')`,
        fields: 'files(id, name, webViewLink), nextPageToken',
        pageToken: pageToken
    }).then((response) => {
        const files = response.result.files;
        const container = document.getElementById('video-gallery-container');

        if (files && files.length > 0) {
            files.forEach(file => {
                const iframe = document.createElement('iframe');
                iframe.src = `https://drive.google.com/file/d/${file.id}/preview`;
                iframe.classList.add('video-frame');
                iframe.title = file.name;
                container.appendChild(iframe);
            });
        }

        if (response.result.nextPageToken) {
            listVideos(response.result.nextPageToken);
        }
    }).catch(error => console.error('Error listing videos:', error));
}

function init() {
    gapi.load('client', () => {
        loadClient().then(listVideos);
    });
}

window.onload = init;
