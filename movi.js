document.addEventListener('DOMContentLoaded', function() {
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
        document.querySelector('#main').style.display = 'block';  
    } else {
        hideSemanticTags();
        alert('You need to verify your domain to use this theme. Please contact support.');
            document.body.innerHTML = 'Your License Is Not Active. Contact <a href="https://telegram.me/dhanjeerider">DHANJEE Rider</a> to get a license';
            }
var lazyanalisis=!1;window.addEventListener("scroll",function(){(0!=document.documentElement.scrollTop&&!1===lazyanalisis||0!=document.body.scrollTop&&!1===lazyanalisis)&&(!function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://www.googletagmanager.com/gtag/js?id=G-88SW9D6YBK";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(e,a)}(),lazyanalisis=!0)},!0);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-88SW9D6YBK');
    
});
