window.addEventListener('load', () => {
    if (window.location.href.includes('?')) {
        var route = window.location.search.split('=')[1]

        const routeLocs = document.querySelectorAll('[route-loc]')
        routeLocs.forEach(loc => {
            if (loc.getAttribute('route-loc') == route) {
                window.scroll({
                    top: window.scrollY + loc.getBoundingClientRect().top,
                    behavior: "smooth"
                })
            }
        })
    }
})

const targetArea = document.querySelector('.about')
const aboutContents = document.querySelectorAll('.about .content .card')

let aboutCounter = -1
let targetAreaStatu = false // FALSE FOR LIVE
let touchStartY = 0

function activateSlide(direction) {
    if (!targetAreaStatu) {
        if (targetArea.getBoundingClientRect().top < window.innerHeight / 5) {
            window.scroll({
                top: window.scrollY + targetArea.getBoundingClientRect().top,
                behavior: 'smooth'
            })

            document.body.classList.add('hidden')

            if (direction === 'down') {
                if (aboutCounter < aboutContents.length - 1) {
                    aboutCounter++
                    aboutContents[aboutCounter].classList.add('active')
                    aboutContents[aboutCounter - 1]?.classList.remove('active')
                } else {
                    finishSection()
                }
            }

            if (direction === 'up') {
                if (aboutCounter > 0) {
                    aboutCounter--
                    aboutContents[aboutCounter].classList.add('active')
                    aboutContents[aboutCounter + 1]?.classList.remove('active')
                } else {
                    finishSection()
                }
            }
        }
    }
}

function finishSection() {
    targetAreaStatu = true
    targetArea.classList.add('active')
    document.body.classList.remove('hidden')
    aboutContents[aboutCounter]?.classList.remove('active')
}

window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) activateSlide('down')
    else activateSlide('up')
}, { passive: false })

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
}, { passive: true })

window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY - touchEndY

    if (Math.abs(diff) > 50) {
        if (diff > 0) activateSlide('down')
        else activateSlide('up')
    }
}, { passive: true })

function infoCard() {
    const list = document.querySelector('.world-by-us .info-card .country-info .list');
    const sampleImg = document.querySelector('.world-by-us .info-card .country-info .sample-img');
    const router = document.querySelector('.world-by-us .info-card .country-info .router');

    list.classList.toggle('active')
    sampleImg.classList.toggle('active')
    router.classList.toggle('active')
}

/* MAP */

const worksArray = {
    "tr": ["fuar", "otel", "restoran", "showroom", "mağaza"],
    "en": ["exhibition", "hotel", "restaurant", "showroom", "store"],
    "de": ["messe", "hotel", "restaurant", "showroom", "ladenbau"],
    "ar": ["معرض", "فندق", "مطعم", "صالة عرض", "متجر"],
    "es": ["feria", "hotel", "restaurante", "showroom", "tienda"],
    "fr": ["exposition", "hôtel", "restaurant", "showroom", "boutique"],
    "it": ["fiera", "hotel", "ristorante", "showroom", "negozio"],
    "nl": ["beurs", "hotel", "restaurant", "showroom", "winkel"],
    "pt": ["feira", "hotel", "restaurante", "showroom", "loja"],
    "sv": ["mässa", "hotell", "restaurang", "showroom", "butik"]
}

const worksOutput = document.getElementById('works-output');
let workCounter = 1;

function getWork() {
    worksOutput.style.color = 'transparent';
    setTimeout(() => {
        worksOutput.textContent = worksArray[navigator.language.split('-')[0].toLowerCase()][workCounter];

        setTimeout(() => {
            worksOutput.style.color = 'black';
        }, 200)
    }, 200)

    if (worksArray[navigator.language.split('-')[0].toLowerCase()].length - 1 == workCounter) {
        workCounter = 0;
    }
    else {
        workCounter += 1;
    }
}

setInterval(getWork, 2000);


(async function () {
    const worldDiv = document.querySelector('.world-by-us');
    var countryStats = []; // Diziyi en üstte tanımlıyoruz

    // ======================= DATA FETCHING =======================
    try {
        const response = await fetch('https://api.safirfuar.com/memories/work-list');
        const data = await response.json();

        if (data.status == 200) {
            data.data.forEach(work => {
                countryStats.push(work);
            });
            worldDiv.style.display = "block";
        }
    } catch (err) {
        console.error("Veri çekme hatası:", err);
    }

    // countryStats dolmadan kodun aşağı devam etmemesini sağladık.
    if (countryStats.length === 0) return;

    // ======================= D3 SETUP =======================
    const width = 900;
    const height = 800;

    const projection = d3.geoOrthographic()
        .scale(400)
        .translate([width / 2, height / 2])
        .rotate([0, -20]);

    const path = d3.geoPath(projection);

    const svg = d3.select('#map')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

    // ======================= SHADOW / GRADIENT =======================
    const defs = svg.append('defs');
    const gradient = defs.append('radialGradient').attr('id', 'globeGradient');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff').attr('stop-opacity', 0.0);
    gradient.append('stop').attr('offset', '70%').attr('stop-color', '#ffffff').attr('stop-opacity', 0.2);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#000000').attr('stop-opacity', 0.05);

    svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', projection.scale())
        .attr('fill', 'url(#globeGradient)');

    // ======================= WORLD DATA =======================
    const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(res => res.json());
    const countries = topojson.feature(world, world.objects.countries).features;

    const g = svg.append('g');

    g.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', d => {
            const hasData = countryStats.some(c => c.country === d.properties.name);
            return hasData ? 'country data' : 'country';
        })
        .attr('d', path)
        .on('click', (e, d) => selectCountry(d.properties.name));

    // ======================= DRAG TO ROTATE =======================
    svg.call(d3.drag().on('drag', (event) => {
        const r = projection.rotate();
        projection.rotate([r[0] + event.dx * 0.25, r[1] - event.dy * 0.25]);
        g.selectAll('path').attr('d', path);
    }));

    // ======================= HELPER FUNCTIONS =======================
    function detectUserCountry() {
        const lang = navigator.language || '';
        const map = { tr: 'Turkey', es: 'Spain', de: 'Germany', fr: 'France', it: 'Italy', en: 'United States' };
        return map[lang.split('-')[0]] || null;
    }

    function focusCountry(feature) {
        let targetCountry = countryStats.find(c => feature.properties.name == c.country);

        if (targetCountry) {
            const [lng, lat] = d3.geoCentroid(feature);
            const rSlope = (window.innerWidth < 700) ? 1 : 2;

            d3.transition().duration(900).tween('rotate', () => {
                const r = d3.interpolate(projection.rotate(), [-lng, -lat / rSlope]);
                return t => {
                    projection.rotate(r(t));
                    g.selectAll('path').attr('d', path);
                };
            });

            // DOM Updates
            document.querySelector('.world-by-us .info-card .country-info .country .name p').textContent = targetCountry.country_lang;
            document.querySelector('.world-by-us .info-card .country-info .country .flag img').src = `https://countryflagsapi.netlify.app/flag/${targetCountry.countryCode === "en" ? "us" : targetCountry.countryCode}.svg`;
            document.querySelector('.world-by-us .info-card .country-info .comment p').textContent = targetCountry.comment;

            const listContainer = document.querySelector('.world-by-us .info-card .country-info .list');
            listContainer.innerHTML = "";
            targetCountry.list.forEach(l => {
                const el = document.createElement('div');
                el.className = 'el';
                el.innerHTML = `<p>${l}</p>`;
                listContainer.appendChild(el);
            });

            document.querySelector('.world-by-us .info-card .country-info .sample-img img').src = targetCountry.sample.IMG;
            document.querySelector('.world-by-us .info-card .country-info .sample-img .sample-info p').textContent = targetCountry.sample.LOC;
        }
    }

    function selectCountry(countryName) {
        const feature = countries.find(f => f.properties.name === countryName);
        if (!feature) return;
        focusCountry(feature);

        if (countryStats.some(c => c.country === countryName)) {
            d3.selectAll('.country').classed('active', d => d?.properties.name === countryName);
            currentCountry = countryName;
        }
    }

    // ======================= INITIALIZE & AUTO-ROTATE =======================
    let currentCountry = null;
    const userCountry = detectUserCountry();

    // Kullanıcının ülkesinde veri varsa onu seç, yoksa rastgele bir tanesini başlat
    if (userCountry && countryStats.some(c => c.country === userCountry)) {
        selectCountry(userCountry);
    } else {
        const initial = countryStats[Math.floor(Math.random() * countryStats.length)].country;
        selectCountry(initial);
    }

    setInterval(() => {
        const list = countryStats.map(c => c.country).filter(c => c !== currentCountry);
        const next = list[Math.floor(Math.random() * list.length)];
        if (next) selectCountry(next);
    }, 20000);

})();

/* --------------- */

const referancesDiv = document.querySelector('.stage-referances .referances-content .referances-output')
const allReferancesDiv = document.querySelector('.stage-referances .referances-content .all-referances-output')
const viewButton = document.querySelector('.stage-referances .referances-content .all-referance-view-button')

function allReferances() {
    if (allReferancesDiv.classList.contains('active')) {
        allReferancesDiv.classList.remove('active')
        referancesDiv.classList.remove('active')
        viewButton.classList.remove('active')
        setTimeout(() => {
            allReferancesDiv.style.display = "none"
        }, 400);

    }
    else {
        allReferancesDiv.style.display = "grid"
        setTimeout(() => {
            allReferancesDiv.classList.add('active')
            viewButton.classList.add('active')
            referancesDiv.classList.add('active')
        }, 10);
    }
}

const projectsDiv = document.querySelector('.stage-projects .projects-output')
const AllProjectsDiv = document.querySelector('.stage-projects .projects-output .all-projects')
const AllProjectsDivOutput = document.querySelector('.stage-projects .projects-output .all-projects .content .output')
const AllProjectsDivClose = document.querySelector('.stage-projects .projects-output .all-projects .content .close')
const loadingAnimation = document.querySelector('.stage-projects .projects-output .all-projects .content .loading')
var allImages = []

function allProjects() {
    if (AllProjectsDiv.classList.contains('active')) {
        AllProjectsDiv.classList.remove('active')
        projectsDiv.classList.remove('active')
        setTimeout(() => {
            AllProjectsDiv.style.display = "none"
        }, 400);

    }
    else {
        AllProjectsDiv.style.display = "block"
        setTimeout(() => {
            AllProjectsDiv.classList.add('active')
            projectsDiv.classList.add('active')
        }, 10);
    }

    fetch('/img/projects', {
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {
            allImages = data.img
        })
}

AllProjectsDivClose.addEventListener('click', () => {
    allProjects()
})

var projectsFull = false;
AllProjectsDivOutput.addEventListener('scroll', () => {
    if (AllProjectsDivOutput.offsetHeight + AllProjectsDivOutput.scrollTop >= AllProjectsDivOutput.scrollHeight && projectsFull == false) {
        loadingAnimation.style.display = "flex"
        setTimeout(() => {
            loadingAnimation.classList.add('active')
        }, 10);

        setTimeout(() => {
            function addProject() {
                for (let x = 0; x < AllProjectsDivOutput.childElementCount; x++) {
                    allImages.forEach((img, index) => {
                        if (AllProjectsDivOutput.children[x].querySelector('img').getAttribute('src').split('/')[4] == img) {
                            allImages.splice(index, 1)
                        }
                    })
                }

                var c = 0;
                allImages.forEach((img, index) => {
                    if (c < 6) {
                        var newImgDiv = document.createElement('div')
                        newImgDiv.classList.add("data")
                        newImgDiv.innerHTML = `<div class="background"><div class="effect"></div><div class="img" type="project"><img src="/assets/img/projects/${img}" loading="lazy"></div></div>`;
                        AllProjectsDivOutput.appendChild(newImgDiv)
                        c++
                        imgLoad()
                    }
                })

                if (allImages.length == 0) {
                    projectsFull = true
                }
                setTimeout(() => {
                    loadingAnimation.classList.remove('active')
                    setTimeout(() => {
                        loadingAnimation.style.display = "none"
                    }, 400);
                }, 400);
            } addProject()

        }, 400);
    }
})