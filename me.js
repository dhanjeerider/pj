  
    // CONFIG
    const API_BASE = "https://lightsteelblue-echidna-440852.hostingersite.com/wp-json/wp/v2";
    const SLIDER_CAT_ID = 19; 
    const POSTS_PER_PAGE = 24;

    // STATE
    let currentPage = 1;
    let totalPages = 1;
    let currentSearch = "";
    let currentCatId = "";
    let isLoading = false;
    let allCategories = {};
    let swiperInstance = null;

    // --- HELPER: HTML DECODER ---
    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // --- HELPER: EXTRACT IMAGE ---
    function extractImage(content) {
        if (!content) return null;
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = content.match(imgRegex);
        return match ? match[1] : null; 
    }

    // --- INIT ---
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        
        await loadCategories();
        initTopSlider(); 

        if (params.has('page')) {
            currentPage = parseInt(params.get('page')) || 1;
        }

        if (params.has('post')) {
            openPost(params.get('post'));
        } else if (params.has('cat')) {
            filterCat(params.get('cat'), allCategories[params.get('cat')] || 'Category');
        } else if (params.has('s')) {
            const searchVal = params.get('s');
            const searchInput = document.getElementById('heroSearchInput');
            if(searchInput) searchInput.value = searchVal;
            triggerSearch(searchVal);
        } else {
            loadPosts();
        }

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 600) {
                if (!isLoading && currentPage < totalPages && document.getElementById('singleView').classList.contains('hidden')) {
                    currentPage++;
                    loadPosts(true);
                }
            }
        });

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view === 'single') openPost(e.state.id, false);
            else if (e.state && e.state.view === 'grid') closeSingleView(false);
            else window.location.reload();
        });
    });

    // --- SEARCH FROM HEADER ---
    function activateSearch() {
        if(!document.getElementById('singleView').classList.contains('hidden')) {
            closeSingleView(false);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            const input = document.getElementById('heroSearchInput');
            if(input) input.focus();
        }, 300);
    }

    // --- 1. SWIPER SLIDER (FIXED) ---
    async function initTopSlider() {
        const track = document.getElementById('topSliderTrack');
        const section = document.getElementById('topSliderSection');
        if (!track || !section) return;

        try {
            const res = await fetch(`${API_BASE}/posts?categories=${SLIDER_CAT_ID}&per_page=20&_embed`);
            if (!res.ok) throw new Error("Network response was not ok");
            
            const posts = await res.json();
            if(!Array.isArray(posts) || posts.length === 0) {
                section.classList.add('hidden');
                return;
            }
            
            section.classList.remove('hidden');

            const sliderHtml = posts.map((p, i) => {
                let img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                if (!img && p.content?.rendered) img = extractImage(p.content.rendered);
                if (!img) img = 'https://via.placeholder.com/300x450?text=No+Image';

                const cleanTitle = decodeHtml(p.title.rendered);
                
                return `
                <div class="swiper-slide cursor-pointer animate-drop-in" style="animation-delay: ${i * 100}ms" onclick="openPost(${p.id})">
                    <div class="overflow-hidden rounded-md shadow-lg border border-white/5">
                        <img src="${img}" class="w-full aspect-[2/3] object-cover hover:scale-105 transition duration-500" loading="lazy" alt="${cleanTitle}">
                    </div>
                </div>`;
            }).join('');

            track.innerHTML = sliderHtml;

            // Ensure Swiper exists before calling
            if (typeof Swiper !== 'undefined') {
                swiperInstance = new Swiper(".mySwiper", {
                    spaceBetween: 10,
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    breakpoints: {
                        320: { slidesPerView: 3, spaceBetween: 8 },
                        640: { slidesPerView: 5, spaceBetween: 10 },
                        1024: { slidesPerView: 8, spaceBetween: 12 },
                        1280: { slidesPerView: 10, spaceBetween: 12 }
                    }
                });
            } else {
                console.error("Swiper Library not found. Please include Swiper JS in head.");
            }
        } catch (e) { 
            console.error("Slider Error:", e); 
            section.classList.add('hidden');
        }
    }

    // --- 2. SEO ---
    function updateMetaTags(title, desc) {
        document.title = title ? `${title} - HDHub4u` : "HDHub4u - Premium Downloads";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = desc ? desc.substring(0, 160) : "Download latest movies.";
    }

    // --- 3. CATEGORIES ---
    async function loadCategories() {
        try {
            const res = await fetch(`${API_BASE}/categories?per_page=50&orderby=count&order=desc`);
            const cats = await res.json();
            const sidebar = document.getElementById('sidebarLinks');
            const strip = document.getElementById('catStrip');
            
            if(strip) strip.innerHTML = `<button onclick="goHome()" class="px-5 py-2 rounded-full text-xs font-bold bg-white text-black flex-shrink-0"><i class="fa-solid fa-house fa-beat-fade"></i> All</button>`;

            cats.forEach((cat, index) => {
                allCategories[cat.id] = cat.name;
                if(cat.count > 0) {
                    if(sidebar) {
                        sidebar.innerHTML += `
                        <button onclick="filterCat(${cat.id}, '${cat.name}')" class="w-full text-left px-4 py-2.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition flex justify-between items-center text-xs">
                            <span><i class="fa-solid fa-folder fa-fade" style="color: #FFD43B;"></i> ${cat.name}</span>
                            <span class="bg-white/5 px-2 rounded-sm text-[10px]">${cat.count}</span>
                        </button>`;
                    }
                    
                    if(index < 12 && strip) {
                        const gradients = ['from-pink-500 to-rose-500', 'from-purple-500 to-indigo-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500'];
                        const gradClass = gradients[index % gradients.length];
                        strip.innerHTML += `
                            <button onclick="filterCat(${cat.id}, '${cat.name}')" class="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r ${gradClass} text-white opacity-80 hover:opacity-100 flex-shrink-0 transition shadow-lg border-0">
                                ${cat.name}
                            </button>`;
                    }
                }
            });
        } catch (e) { console.error("Category Load Error", e); }
    }

    // --- 4. POSTS ---
    async function loadPosts(append = false) {
        const container = document.getElementById('postContainer');
        const loader = document.getElementById('infiniteLoader');
        if(!container) return;

        if(!append) {
            container.innerHTML = Array(12).fill(0).map(() => `<div class="rounded-lg bg-white/5 aspect-[2/3] animate-pulse"></div>`).join('');
        }
        
        isLoading = true;
        if(loader) loader.classList.remove('hidden');

        let url = `${API_BASE}/posts?per_page=${POSTS_PER_PAGE}&page=${currentPage}&_embed`;
        if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
        if (currentCatId) url += `&categories=${currentCatId}`;

        try {
            const res = await fetch(url);
            totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
            const posts = await res.json();

            if(!append) container.innerHTML = ''; 

            if (posts.length === 0 && !append) {
                container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">Nothing found here.</div>`;
                return;
            }

            const html = posts.map((p, i) => {
                let img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                if (!img && p.content?.rendered) img = extractImage(p.content.rendered);
                if (!img) img = 'https://via.placeholder.com/300x450?text=No+Image';

                const cleanTitle = decodeHtml(p.title.rendered);

                return `
                <div class="movie-card group cursor-pointer rounded-sm overflow-hidden relative animate-fade-up" style="animation-delay: ${i * 50}ms" onclick="openPost(${p.id})">
                    <div class="aspect-[9/14] relative bg-[#050510] overflow-hidden">
                        <img src="${img}" alt="${cleanTitle}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy">
                    </div>
                    <div class="p-2">
                        <h3 class="text-white text-[11px] font-bold line-clamp-2 leading-tight group-hover:text-cyan-400 transition">${cleanTitle}</h3>
                    </div>
                </div>`;
            }).join('');

            container.insertAdjacentHTML('beforeend', html);

        } catch (e) { console.error("Posts Load Error", e); } finally {
            isLoading = false;
            if(loader) loader.classList.add('hidden');
        }
    }

    // --- 5. SINGLE VIEW ---
    function extractImdbId(content, fallbackId) {
        const regex = /imdb\.com\/title\/(tt\d+)/;
        const match = content.match(regex);
        return (match && match[1]) ? match[1] : fallbackId;
    }

    async function openPost(id, pushHistory = true) {
        const gridView = document.getElementById('gridView');
        const singleView = document.getElementById('singleView');
        const hero = document.getElementById('heroSection');
        const slider = document.getElementById('topSliderSection');

        if(pushHistory) history.pushState({ view: 'single', id: id }, "", `?post=${id}`);

        if(gridView) gridView.classList.add('hidden');
        if(hero) hero.classList.add('hidden');
        if(slider) slider.classList.add('hidden');
        if(singleView) singleView.classList.remove('hidden');
        window.scrollTo(0, 0);

        const player = document.getElementById('playerFrame');
        const titleEl = document.getElementById('singleTitle');
        const contentEl = document.getElementById('singleContent');
        
        if(player) player.src = ""; 
        if(titleEl) titleEl.innerText = "Loading...";
        if(contentEl) contentEl.innerHTML = `<div class="p-10 flex justify-center"><div class="loader-ring"></div></div>`;

        try {
            const res = await fetch(`${API_BASE}/posts/${id}?_embed`);
            const post = await res.json();

            const cleanTitle = decodeHtml(post.title.rendered);
            const cleanContent = post.content.rendered.replace(/<[^>]*>?/gm, '').substring(0, 150);
            updateMetaTags(cleanTitle, cleanContent);

            const videoId = extractImdbId(post.content.rendered, post.id);
            if(player) player.src = `https://smrta384und.com/play/${videoId}`;

            if(titleEl) titleEl.innerText = cleanTitle;
            const dateEl = document.getElementById('singleDate');
            if(dateEl) dateEl.innerText = new Date(post.date).toLocaleDateString();
            
            const catEl = document.getElementById('singleCat');
            if(catEl) catEl.innerText = post.categories.length ? (allCategories[post.categories[0]] || 'Movie') : 'Movie';

            let displayContent = post.content.rendered.replace(/<iframe(?!.*youtube).*?<\/iframe>/g, "");
            if(contentEl) contentEl.innerHTML = displayContent;

            if(post.categories.length) loadRelated(post.categories[0], id);

        } catch (e) { 
            console.error(e); 
            if(contentEl) contentEl.innerText = "Error loading content."; 
        }
    }

    async function loadRelated(catId, currentId) {
        const container = document.getElementById('relatedContainer');
        if(!container) return;
        try {
            const res = await fetch(`${API_BASE}/posts?categories=${catId}&exclude=${currentId}&per_page=12&_embed`);
            const posts = await res.json();
            
            container.innerHTML = posts.map(p => {
                let img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                if (!img && p.content?.rendered) img = extractImage(p.content.rendered);
                if (!img) img = 'https://via.placeholder.com/150x220';

                return `
                <div class="group cursor-pointer" onclick="openPost(${p.id})">
                    <div class="aspect-[2/3] rounded-md overflow-hidden relative border border-white/5">
                        <img src="${img}" class="w-full h-full object-cover group-hover:scale-110 transition">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <i class="fas fa-play text-white text-xl"></i>
                        </div>
                    </div>
                </div>`;
            }).join('');
        } catch (e) {}
    }

    function closeSingleView(pushHistory = true) {
        const singleView = document.getElementById('singleView');
        if(singleView) singleView.classList.add('hidden');
        
        document.getElementById('gridView')?.classList.remove('hidden');
        document.getElementById('heroSection')?.classList.remove('hidden');
        document.getElementById('topSliderSection')?.classList.remove('hidden');
        
        const player = document.getElementById('playerFrame');
        if(player) player.src = "";
        
        updateMetaTags(); 
        if(pushHistory) history.pushState({ view: 'grid' }, "", "/");
    }

    function filterCat(id, name) {
        currentCatId = id; currentPage = 1; currentSearch = "";
        const heading = document.getElementById('pageHeading');
        if(heading) heading.innerHTML = `<span class="text-cyan-400">${name}</span>`;
        
        toggleSidebar(false);
        closeSingleView(false); 

        history.pushState({ view: 'grid', cat: id }, "", `?cat=${id}`);
        loadPosts();
    }

    function triggerSearch(val) {
        const searchInput = document.getElementById('heroSearchInput');
        currentSearch = val || (searchInput ? searchInput.value : "");
        if(!currentSearch) return;
        
        currentPage = 1; currentCatId = "";
        const heading = document.getElementById('pageHeading');
        if(heading) heading.innerHTML = `Search: "${currentSearch}"`;
        
        closeSingleView(false); 

        history.pushState({ view: 'grid', s: currentSearch }, "", `?s=${currentSearch}`);
        loadPosts();
    }

    function goHome() {
        currentCatId = ""; currentSearch = ""; currentPage = 1;
        const heading = document.getElementById('pageHeading');
        if(heading) heading.innerHTML = `<i class="fas fa-fire text-red-500"></i> Latest Updates`;
        
        const searchInput = document.getElementById('heroSearchInput');
        if(searchInput) searchInput.value = "";
        
        toggleSidebar(false);
        closeSingleView();
        history.pushState({ view: 'grid' }, "", "/");
        loadPosts();
    }

    function toggleSidebar(force) {
        const s = document.getElementById('sidebar');
        const o = document.getElementById('sidebarOverlay');
        if(!s || !o) return;
        const show = force !== undefined ? force : s.classList.contains('-translate-x-full');
        if(show) { s.classList.remove('-translate-x-full'); o.classList.remove('hidden'); } 
        else { s.classList.add('-translate-x-full'); o.classList.add('hidden'); }
    }
