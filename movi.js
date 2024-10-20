var allowedURLs = [
        "https://biographyhero.lovestoblog.com",
        "https://dkflix.000.pe",
        "https://hdhub4u-wp-theme-dktzn.is-best.net",
        "https://dktech.000.pe",
        "https://jet-movie.blogspot.com",
        "https://1stepno.blogspot.com",
        "https://actrers-biography.blogspot.com"
    ];
    
    var foundMatch = false;

    for (var i = 0; i < allowedURLs.length; i++) {
        if (window.location.href.startsWith(allowedURLs[i])) {
            foundMatch = false;
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
        document.querySelector('#main').style.display = 'block';  
    } else {
        hideSemanticTags();
        alert('You need to verify your domain to use this theme. Please contact support.');
                       }
