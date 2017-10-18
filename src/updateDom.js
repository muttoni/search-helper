// Customize how the browser will display the contents of Thing update messages received
//

function handleMessage(msg) {  // called from within connectAsThing.js
     // display the JSON message in a panel
    document.getElementById('panel').innerHTML = msg;

    // unpack the message and find the city value.  Pop a child browser window to display images.
    var searchType = JSON.parse(msg).searchType;
    var searchTerm = JSON.parse(msg).searchTerm;
    var url = '';

    switch (searchType) {
        case 'image':
            url = 'https://www.google.com/search?tbm=isch&q=' + encodeURI(searchTerm);
            break;
        case 'text':
            url = 'https://www.google.com/search?q=' + encodeURI(searchTerm);
            break;
        default:
            url = "https://www.google.com/search?q=" + encodeURI(searchTerm);
            break;
    }

    pop(url);

}
function reloader() {
    location.reload(true);  // hard reload including .js and .css files

}

var childWindow;

function pop(url) {
    console.log('Opening child url ' + url);

    if (childWindow) {
        childWindow.location = url;
    } else {

        childWindow = window.open(
            url,
            'mychild',
            'height=500,width=700,titlebar=yes,toolbar=no,menubar=no,directories=no,status=no,location=yes,title=new'
        );
    }
}
