var codeElements = document.querySelectorAll("pre");
    codeElements.forEach(function(element) {
        element.addEventListener("dblclick", function() {
            copyToClipboard(element);
        });
    });
    function copyToClipboard(element) {
        var tempTextArea = document.createElement("textarea");
        tempTextArea.value = element.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); 
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        
        showBottomAlert();
    }
    function showBottomAlert() {
        var bottomAlert = document.getElementById("bottomAlert");
        bottomAlert.style.display = "block";
        setTimeout(function() {
            bottomAlert.style.display = "none";
        }, 3000);
    }
function showForm() {
        document.getElementById('formContainer').style.display = 'block';
    }

    function hideForm() {
        document.getElementById('formContainer').style.display = 'none';
    }

    function checkFormFilled() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const note = document.getElementById('note').value;

        if (name && email && note) {
            document.querySelector('.whatsapp-button').style.display = 'block';
            document.querySelector('.telegram-button').style.display = 'block';
        } else {
            document.querySelector('.whatsapp-button').style.display = 'block';
            document.querySelector('.telegram-button').style.display = 'block';
        }
    }

    function submitOrder() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const note = document.getElementById('note').value;

        const themeTitle = document.querySelector('.entry-title')?.innerText || document.querySelector('h1')?.innerText || 'Unknown Theme';
        const price = document.querySelector('.price')?.innerText || 'Unknown Price';

        const message = `Hello, I would like to order the following:\n\nName: ${name}\nEmail: ${email}\nTheme: ${themeTitle}\nPrice: ${price}\nCustom Note: ${note}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=+917759060810&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    function sendTelegramOrder() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const note = document.getElementById('note').value;

        const themeTitle = document.querySelector('.entry-title')?.innerText || document.querySelector('h1')?.innerText || 'Unknown Theme';
        const price = document.querySelector('.price')?.innerText || 'Unknown Price';

        const message = `Hello, I would like to order the following:\n\nName: ${name}\nEmail: ${email}\nTheme: ${themeTitle}\nPrice: ${price}\nCustom Note: ${note}`;

        const telegramUrl = `https://t.me/dhanjeerider?text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    }
function labnolIframe(e){var t=document.createElement("iframe");t.setAttribute("src","https://www.youtube.com/embed/"+e.dataset.id+"?autoplay=1&rel=0"),t.setAttribute("frameborder","0"),t.setAttribute("allowfullscreen","1"),t.setAttribute("allow","accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"),e.parentNode.replaceChild(t,e)}function initYouTubeVideos(){for(var e=document.getElementsByClassName("youtube-player"),t=0;t<e.length;t++){var a=e[t].dataset.id,r=document.createElement("div");r.setAttribute("data-id",a);var i=document.createElement("img");i.src="https://i.ytimg.com/vi_webp/ID/hqdefault.webp".replace("ID",a),r.appendChild(i);var n=document.createElement("div");n.setAttribute("class","play"),r.appendChild(n),r.onclick=function(){labnolIframe(this)},e[t].appendChild(r)}}document.addEventListener("DOMContentLoaded",initYouTubeVideos)
const codeBox = {
      img: "https:www.dktechnozone.in/favicon.ico", /* Your favicon url */
      title: "by dk technozone" /* Your blog title */
};
/* Code_Box@main.js */ 0<document.querySelectorAll("div.pre.cdBox").length&&(()=>{let e=document.querySelectorAll("div.pre.cdBox");function t(e,t,a){if(a="string"==typeof a?a:"text/plain",t="string"==typeof t?t:"File_"+(new Date).getTime()+".txt",e){if(a=new Blob([e],{type:a}),navigator.msSaveBlob)return navigator.msSaveBlob(a,t);{let e=window.URL.createObjectURL(a),l=document.createElement("a");l.classList.add("hidden"),l.href=e,l.download=t,document.body.appendChild(l),l.click(),l.remove(),window.URL.revokeObjectURL(e)}}}for(let a=0;a<e.length;a++){let l=e[a];l.classList.add("adv");let n=l.dataset.text||"File_"+(new Date).getTime(),s=l.dataset.file||n,d=l.dataset.lang||".txt",i=void 0!==l.dataset.time?isNaN(Number(l.dataset.time))?"false"===l.dataset.time?0:10:Number(l.dataset.time):10,o=void 0===l.dataset.download||"true"==l.dataset.download,r=void 0===l.dataset.copy||"true"==l.dataset.copy,c=void 0===l.dataset.view||"true"==l.dataset.view,p=l.querySelector("pre"),m=p.innerText;l.insertAdjacentHTML("afterbegin","<div class='preM'><div class='preT'><span class='prTl'>"+(null==n?"&lt;/&gt;":n)+"</span><span class='prCd'></span></div><div class='preA'>"+(c?"\x3c!--[ Preview ]--\x3e<button class='prVw' aria-label='blob Button'><svg viewBox='0 0 24 24'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'/></svg></button>":"")+(o?"\x3c!--[ Download ]--\x3e<button class='prDl' aria-label='Download Button'><svg viewBox='0 0 24 24'><path class='a' d='M8 17V15H16V17H8M16 10L12 14L8 10H10.5V6H13.5V10H16M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z'/><path class='b' d='M13,2.03C17.73,2.5 21.5,6.25 21.95,11C22.5,16.5 18.5,21.38 13,21.93V19.93C16.64,19.5 19.5,16.61 19.96,12.97C20.5,8.58 17.39,4.59 13,4.05V2.05L13,2.03M11,2.06V4.06C9.57,4.26 8.22,4.84 7.1,5.74L5.67,4.26C7.19,3 9.05,2.25 11,2.06M4.26,5.67L5.69,7.1C4.8,8.23 4.24,9.58 4.05,11H2.05C2.25,9.04 3,7.19 4.26,5.67M2.06,13H4.06C4.24,14.42 4.81,15.77 5.69,16.9L4.27,18.33C3.03,16.81 2.26,14.96 2.06,13M7.1,18.37C8.23,19.25 9.58,19.82 11,20V22C9.04,21.79 7.18,21 5.67,19.74L7.1,18.37M12,16.5L7.5,12H11V8H13V12H16.5L12,16.5Z'/><path class='c' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M7,15H17V17H7V15M10.3,11.2L8.4,9.3L7,10.7L10.3,14L17,7.3L15.6,5.9L10.3,11.2Z'/></svg></button>":"")+(r?"\x3c!--[ Copy ]--\x3e<button class='prCp' aria-label='copy Button'><svg viewBox='0 0 24 24'><path class='a' d='M20,16V4H8V16H20M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z'/><path class='b' d='M20,16V10H22V16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H16V4H8V16H20M10.91,7.08L14,10.17L20.59,3.58L22,5L14,13L9.5,8.5L10.91,7.08M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z'/></svg></button>":"")+"</div></div>");let v=l.querySelector(".prVw"),L=l.querySelector(".prDl"),w=l.querySelector(".prCp"),u=l.querySelector(".prCd");null!==v&&v.addEventListener("click",(()=>{var e="#252526",t=codeBox.img;e="<!DOCTYPE html><html><head><title>"+s.replace(/\./g,"").replace(/ /g,"_")+d+"</title><meta content='width=device-width,initial-scale=1,user-scalable=1,minimum-scale=1,maximum-scale=5' name='viewport'/><meta content='"+e+"' name='theme-color'/><meta content='"+e+"' name='msapplication-navbutton-color'/><meta content='"+e+"' name='apple-mobile-web-app-status-bar-style'/><link rel='shortcut icon' type='image/png' href='"+t+"'><style>body{min-height:100vh;background:#fff;color:#000}*{margin:0;padding:0}html{line-height:1em;background:#1d1f21;color:#c5c8c6}pre{white-space:pre-wrap;word-wrap:break-word;word-break:break-all;padding:12px}pre i{font-style:normal}</style></head><body><div class='pre'>"+p.outerHTML+"</div></body></html>",e=new Blob([e],{type:"text/html"}),window.navigator.msSaveOrOpenBlob?window.navigator.msSaveOrOpenBlob(blobObject,fileName):(e=window.URL.createObjectURL(e),window.open(e,"_blank"),window.URL.revokeObjectURL(e))})),null!==L&&L.addEventListener("click",(()=>{L.disabled=!0;let e=i;l.classList.add("pnd","str"),u.innerHTML=0!==i?"Please wait "+e+"s...":"Please wait...";let a=setInterval((()=>{0!==i&&--e,0!==i&&(u.innerHTML="Please wait "+e+"s..."),e<=0&&(clearInterval(a),setTimeout((()=>{u.innerHTML="Downloading...",setTimeout((()=>{l.classList.remove("pnd"),l.classList.add("dwn"),t(m,s.replace(/\./g,"").replace(/ /g,"_")+codeBox.title+d,"text/plain"),u.innerHTML="Download started...",setTimeout((()=>{l.classList.remove("dwn","str"),L.disabled=!1}),3e3)}),2e3)}),1e3))}),1e3)})),null!==w&&w.addEventListener("click",(()=>{var e=getSelection(),t=document.createRange();t.selectNodeContents(p),e.removeAllRanges(),e.addRange(t),document.execCommand("copy"),e.removeAllRanges(),w.disabled=!0,l.classList.add("cpd"),setTimeout((function(){l.classList.remove("cpd"),w.disabled=!1}),3e3)}))}})();
var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos &gt; currentScrollPos) {
      document.getElementById(&quot;ATnav&quot;).style.bottom = &quot;10px&quot;;
    } else {
      document.getElementById(&quot;ATnav&quot;).style.bottom = &quot;-80px&quot;;
    }
    prevScrollpos = currentScrollPos;
  };
function addAttributes() {
      var links = document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        if (links[i].hostname !== window.location.hostname) {
          links[i].setAttribute('rel', 'nofollow noopener noreferrer');
        }
      }
    }
    window.onload = addAttributes;
