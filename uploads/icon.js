// Code to handle copying text on double-click
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

// Form show and hide functions
function showForm() {
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
}

// Form validation
function checkFormFilled() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const note = document.getElementById('note').value;

    if (name && email && note) {
        document.querySelector('.whatsapp-button').style.display = 'block';
        document.querySelector('.telegram-button').style.display = 'block';
    } else {
        document.querySelector('.whatsapp-button').style.display = 'none';
        document.querySelector('.telegram-button').style.display = 'none';
    }
}

// Submit order via WhatsApp
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

// Submit order via Telegram
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

// Initialize YouTube video players
function labnolIframe(e) {
    var t = document.createElement("iframe");
    t.setAttribute("src", "https://www.youtube.com/embed/" + e.dataset.id + "?autoplay=1&rel=0");
    t.setAttribute("frameborder", "0");
    t.setAttribute("allowfullscreen", "1");
    t.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
    e.parentNode.replaceChild(t, e);
}

function initYouTubeVideos() {
    for (var e = document.getElementsByClassName("youtube-player"), t = 0; t < e.length; t++) {
        var a = e[t].dataset.id,
            r = document.createElement("div");
        r.setAttribute("data-id", a);
        var i = document.createElement("img");
        i.src = "https://i.ytimg.com/vi_webp/ID/hqdefault.webp".replace("ID", a);
        r.appendChild(i);
        var n = document.createElement("div");
        n.setAttribute("class", "play");
        r.appendChild(n);
        r.onclick = function() { labnolIframe(this); };
        e[t].appendChild(r);
    }
}

document.addEventListener("DOMContentLoaded", initYouTubeVideos);

// Save and Download code box functionality
const codeBox = {
    img: "https://www.dktechnozone.in/favicon.ico",
    title: "by dk technozone"
};

if (document.querySelectorAll("div.pre.cdBox").length > 0) {
    let codeBoxes = document.querySelectorAll("div.pre.cdBox");
    function downloadCodeBox(e, fileName, content) {
        let blob = new Blob([content], {type: "text/plain"});
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    }

    codeBoxes.forEach(function(l) {
        l.classList.add("adv");
        let fileName = l.dataset.file || "code.txt";
        let content = l.querySelector("pre").innerText;

        l.insertAdjacentHTML("afterbegin", "<div class='preM'><div class='preT'><span class='prTl'>" + (l.dataset.text || "Code") + "</span><span class='prCd'></span></div><div class='preA'><button class='prCp'><i class="fa-light fa-copy"></i></button><button class='prDl'><i class="fa-light fa-download"></i></button></div></div>");
        
        l.querySelector(".prCp").addEventListener("click", function() {
            copyToClipboard(l.querySelector("pre"));
        });

        l.querySelector(".prDl").addEventListener("click", function() {
            downloadCodeBox(l, fileName, content);
        });
    });
}
