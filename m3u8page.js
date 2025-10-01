const SOURCE_URL = 'https://dhanjeerider.github.io/Projects/channels.json';
    let all = [], filtered = [], current = -1, playToken = 0;
    const listEl = document.getElementById('list');
    const qEl = document.getElementById('q');
    const video = document.getElementById('player');
    const videoContainer = document.getElementById('videoContainer');
    const backToTopBtn = document.getElementById('backToTop');

    // Sticky Video & Back to top
    let isSticky=false,isDragging=false,offsetX=0,offsetY=0;
    window.addEventListener('scroll',()=>{
      if(window.scrollY>300&&!isSticky){videoContainer.classList.add('sticky');isSticky=true}
      if(window.scrollY<=300&&isSticky){videoContainer.classList.remove('sticky');isSticky=false}
      backToTopBtn.style.display=(window.scrollY>200)?'block':'none';
    });
    backToTopBtn.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})});

    // Dragging for sticky video
    videoContainer.addEventListener('mousedown',e=>{
      if(!isSticky) return;
      isDragging=true;
      offsetX=e.clientX-videoContainer.getBoundingClientRect().left;
      offsetY=e.clientY-videoContainer.getBoundingClientRect().top;
    });
    window.addEventListener('mousemove',e=>{
      if(isDragging){videoContainer.style.left=(e.clientX-offsetX)+'px';videoContainer.style.top=(e.clientY-offsetY)+'px';videoContainer.style.right='auto';videoContainer.style.bottom='auto'}
    });
    window.addEventListener('mouseup',()=>{isDragging=false});

    async function loadChannels(){
      try{
        const res=await fetch(SOURCE_URL,{mode:'cors',cache:'no-store'});
        const data=await res.json();
        all=data.map(x=>({name:x.name||'Untitled',logo:x.logo||'',url:x.url||''}));
        filtered=[...all];render();
      }catch(err){listEl.innerHTML='<div style="padding:16px;color:#8aa3c3;text-align:center">लोड फेल</div>'}
    }
    function render(){
      const q=(qEl.value||'').toLowerCase();
      filtered=all.filter(c=>(c.name||'').toLowerCase().includes(q));
      listEl.innerHTML=filtered.map((c,i)=>`
        <div class="channel-item" data-idx="${i}">
          <img class="channel-thumb" src="${c.logo}" alt="">
          <div class="channel-name">${c.name}</div>
        </div>`).join('')||'<div style="padding:16px;color:#8aa3c3;text-align:center;grid-column:1/-1">कुछ नहीं मिला</div>';
      listEl.querySelectorAll('.channel-item').forEach(el=>{
        el.addEventListener('click',()=>{playByIndex(+el.dataset.idx)});
      });
      if(current===-1&&filtered.length){playByIndex(0)}
    }
    function updateNow(c){
      document.getElementById('nowLogo').src=c.logo||'';
      document.getElementById('nowName').textContent=c.name||'Untitled';
      document.getElementById('nowSub').textContent=safeHost(c.url);
      document.getElementById('chipHLS').style.display=/.m3u8/i.test(c.url)?'inline-flex':'none';
    }
    async function playByIndex(i){const token=++playToken;current=i;const c=filtered[i];if(!c) return;updateNow(c);await playSrc(c.url);if(token!==playToken)return}
    document.getElementById('playBtn').addEventListener('click',async()=>{if(current<0&&filtered.length){await playByIndex(0);return}if(video.paused){await safePlay(video)}else{video.pause()}if(video.muted)try{video.muted=false}catch{}});
    document.getElementById('prevBtn').addEventListener('click',()=>{if(!filtered.length)return;const i=current<=0?filtered.length-1:current-1;playByIndex(i)});
    document.getElementById('nextBtn').addEventListener('click',()=>{if(!filtered.length)return;const i=current>=filtered.length-1?0:current+1;playByIndex(i)});
    document.getElementById('shuffleBtn').addEventListener('click',()=>{if(!filtered.length)return;const i=Math.floor(Math.random()*filtered.length);playByIndex(i)});
    document.getElementById('theaterBtn').addEventListener('click',()=>{videoContainer.classList.remove('sticky');isSticky=false;window.scrollTo({top:0,behavior:'smooth'})});
    document.getElementById('stopBtn').addEventListener('click',()=>{destroyHls();video.removeAttribute('src');video.load();current=-1;document.getElementById('nowName').textContent='रुका हुआ';document.getElementById('nowSub').textContent='—';document.getElementById('nowLogo').src=''});
    document.getElementById('reloadBtn').addEventListener('click',loadChannels);
    qEl.addEventListener('input',render);
    window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();document.getElementById('playBtn').click()}if(e.key==='m'||e.key==='M'){video.muted=!video.muted}if(e.key==='ArrowRight'){document.getElementById('nextBtn').click()}if(e.key==='ArrowLeft'){document.getElementById('prevBtn').click()}});

    // Search category buttons
    const SEARCH_TERMS=["Movies","News","Music","Sports","Kids","India","bhojpuri","Live","mtv","star","entertainment"];
    const chipsEl=document.getElementById('searchChips');
    chipsEl.innerHTML=SEARCH_TERMS.map(t=>`<span class="chip" data-term="${t}">${t}</span>`).join('');
    chipsEl.querySelectorAll('.chip').forEach(btn=>{
      btn.addEventListener('click',()=>{qEl.value=btn.dataset.term;render();window.scrollTo({top:0,behavior:'smooth'})});
    });

    function safeHost(u){try{return new URL(u).hostname}catch{return '—'}}
    loadChannels();
  
