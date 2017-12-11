var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
// var reader = new XMLHttpRequest();

console.log("day8.js: Hello, World!");

// loadFile();
makeCorsRequest();

function loadFile() {
    var sourceUrl = "http://cors.io/?http://adventofcode.com/2017/day/8/input";
    try {
        reader.
        reader.open("get", sourceUrl, true); 
        reader.onreadystatechange = function () {
            if(reader.readyState==4) {
                document.getElementById("day8").innerHTML = reader.responseText;
            }
        };
        reader.send(null);
    }
    catch (e) {
        console.log("loadFile(): Failed to load! " + e);
    }
}

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
  
  // Helper method to parse the title tag from the response.
  function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
  }
  
  // Make the actual CORS request.
  function makeCorsRequest() {
    // This is a sample server that supports CORS.
    // var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';

    var url = 'http://cors.io/?http://adventofcode.com/2017/day/8/input';
  
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }
  
    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
    //   var title = getTitle(text);
    //   alert('Response from CORS request to ' + url + ': ' + title);
      console.log("makeCorsRequest(): " + text);
    };
  
    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };
  
    xhr.send();
  }