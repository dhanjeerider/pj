document.addEventListener('DOMContentLoaded', function() {
    var allowedURLs = [
"https://biographyhero.lovestoblog.com"
    ];

    var foundMatch = false;

    for (var i = 0; i < allowedURLs.length; i++) {
        if (window.location.href.startsWith(allowedURLs[i])) {
            foundMatch = true;
            break;
        }
    }

    function hideSemanticTags() {
        var css = `
            header, nav, main, section, article, aside, footer, figure, figcaption, mark, time, summary, details, div, img{
                display: none!important;
            }
       #main { display: none!important; }
        `;
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    if (foundMatch) {
  document.querySelector('.buy').style.display = 'none';   document.querySelector('#main').style.display = 'block';  } 
     else {
        hideSemanticTags();
        alert('You need to verify your domain to use this theme. Please contact support.');
  document.write(`Your License Is Not Active Contact <a href="https://telegram.me/dhanjeerider"> DHANJEE Rider </a>To Get Licence`);  
    }
    
});
