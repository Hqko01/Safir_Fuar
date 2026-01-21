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

const worksArrayTR = ["fuar", "otel", "restoran", "showroom", "mağaza"]
const worksOutput = document.getElementById('works-output');
let workCounter = 1;

function getWork() {
    worksOutput.style.color = 'transparent';
    setTimeout(() => {
        worksOutput.textContent = worksArrayTR[workCounter]

        setTimeout(() => {
            worksOutput.style.color = 'black';
        }, 200)
    }, 200)

    if (worksArrayTR.length - 1 == workCounter) {
        workCounter = 0;
    }
    else {
        workCounter += 1;
    }
}

setInterval(getWork, 2000);


(async function () {

    /* =======================
       1️⃣ VERİ (SENİN JSON)
    ======================= */
    const countryStats = [
        {
            country: "Turkey",
            country_lang: "Türkiye",
            countryCode: "tr",
            comment: "Türkiye’de katıldığımız fuarlarda markaların doğru kitleyle etkili şekilde buluşmasını sağladık.",
            list: [
                "25+ Fuar Katılımı",
                "50+ Marka ile İş Birliği",
                "Stand Tasarımı ve Dijital Sunum",
                "İstanbul, Ankara, Bursa projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-2.webp",
                LOC: "Made Expo İstanbul"
            }
        },
        {
            country: "Sweden",
            country_lang: "Sverige",
            countryCode: "sv",
            comment: "På mässor i Sverige hjälpte vi varumärken att möta rätt målgrupp på ett professionellt sätt.",
            list: [
                "10+ Mässdeltaganden",
                "Internationella Varumärken",
                "Monterdesign och Digital Presentation",
                "Projekt i Stockholm"
            ],
            sample: {
                IMG: "/assets/img/projects/project-3.webp",
                LOC: "Stockholm Expo"
            }
        },
        {
            country: "Portugal",
            country_lang: "Portugal",
            countryCode: "pt",
            comment: "Em feiras em Portugal, ajudámos marcas a conectar-se eficazmente com o público certo.",
            list: [
                "8+ Participações em Feiras",
                "Marcas Internacionais",
                "Design de Stands e Apresentação Digital",
                "Projetos em Lisboa"
            ],
            sample: {
                IMG: "/assets/img/projects/project-4.webp",
                LOC: "Lisbon Expo"
            }
        },
        {
            country: "Netherlands",
            country_lang: "Nederland",
            countryCode: "nl",
            comment: "Op beurzen in Nederland zorgden we ervoor dat merken duidelijk en effectief zichtbaar waren.",
            list: [
                "12+ Beursdeelnames",
                "Europees Gerichte Merken",
                "Standontwerp en Digitale Presentatie",
                "Projecten in Amsterdam"
            ],
            sample: {
                IMG: "/assets/img/projects/project-5.webp",
                LOC: "Amsterdam RAI"
            }
        },
        {
            country: "Italy",
            country_lang: "Italia",
            countryCode: "it",
            comment: "Nelle fiere in Italia abbiamo aiutato i brand a distinguersi davanti al pubblico giusto.",
            list: [
                "15+ Partecipazioni Fieristiche",
                "Brand Nazionali e Internazionali",
                "Progettazione Stand e Presentazione Digitale",
                "Progetti a Milano"
            ],
            sample: {
                IMG: "/assets/img/projects/project-6.webp",
                LOC: "Fiera Milano"
            }
        },
        {
            country: "France",
            country_lang: "France",
            countryCode: "fr",
            comment: "Lors des salons en France, nous avons permis aux marques de toucher efficacement leur public cible.",
            list: [
                "14+ Participations à des Salons",
                "Marques Internationales",
                "Design de Stand et Présentation Digitale",
                "Projets à Paris"
            ],
            sample: {
                IMG: "/assets/img/projects/project-7.webp",
                LOC: "Paris Expo"
            }
        },
        {
            country: "Spain",
            country_lang: "España",
            countryCode: "es",
            comment: "En ferias en España ayudamos a las marcas a conectar con el público adecuado.",
            list: [
                "11+ Participaciones en Ferias",
                "Marcas Internacionales",
                "Diseño de Stands y Presentación Digital",
                "Proyectos en Barcelona"
            ],
            sample: {
                IMG: "/assets/img/projects/project-8.webp",
                LOC: "Fira Barcelona"
            }
        },
        {
            country: "United States of America",
            country_lang: "United States",
            countryCode: "en",
            flagCode: "us",
            comment: "At trade shows in the United States, we helped brands connect effectively with the right audience.",
            list: [
                "20+ Trade Show Participations",
                "International & US-Based Brands",
                "Stand Design and Digital Presentation",
                "Projects in New York and Las Vegas"
            ],
            sample: {
                IMG: "/assets/img/projects/project-9.webp",
                LOC: "Las Vegas Expo"
            }
        },
        {
            country: "Germany",
            country_lang: "Deutschland",
            countryCode: "de",
            comment: "Auf Messen in Deutschland haben wir Marken gezielt mit ihrer Zielgruppe zusammengebracht.",
            list: [
                "20+ Messebeteiligungen",
                "Internationale Marken",
                "Standdesign und Digitale Präsentation",
                "Projekte in Berlin"
            ],
            sample: {
                IMG: "/assets/img/projects/project-10.webp",
                LOC: "Berlin Expo"
            }
        },
        {
            country: "Saudi Arabia",
            country_lang: "المملكة العربية السعودية",
            countryCode: "ar",
            comment: "في المعارض داخل السعودية ساعدنا العلامات التجارية على الوصول إلى الجمهور المناسب بفعالية.",
            list: [
                "10+ مشاركات في المعارض",
                "علامات تجارية دولية",
                "تصميم الأجنحة والعرض الرقمي",
                "مشاريع في الرياض"
            ],
            sample: {
                IMG: "/assets/img/projects/project-11.webp",
                LOC: "Riyadh Expo"
            }
        }
    ];

    /* =======================
       2️⃣ BOYUT + PROJECTION
    ======================= */
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

    /* =======================
       3️⃣ KÜRE GÖLGESİ
    ======================= */
    const defs = svg.append('defs');

    const gradient = defs.append('radialGradient')
        .attr('id', 'globeGradient');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ffffff')
        .attr('stop-opacity', 0.0);

    gradient.append('stop')
        .attr('offset', '70%')
        .attr('stop-color', '#ffffff')
        .attr('stop-opacity', 0.2);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000000')
        .attr('stop-opacity', 0.05);

    svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', projection.scale())
        .attr('fill', 'url(#globeGradient)');

    /* =======================
       4️⃣ DÜNYA VERİSİ
    ======================= */
    const world = await fetch(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    ).then(res => res.json());

    const countries = topojson.feature(
        world,
        world.objects.countries
    ).features;

    const g = svg.append('g');

    g.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', d => {
            const hasData = countryStats.some(
                c => c.country === d.properties.name
            );
            return hasData ? 'country data' : 'country';
        })
        .attr('d', path)
        .on('click', (e, d) => selectCountry(d.properties.name));

    /* =======================
       5️⃣ DRAG → DÖNDÜR
    ======================= */
    svg.call(
        d3.drag().on('drag', (event) => {
            const r = projection.rotate();
            projection.rotate([
                r[0] + event.dx * 0.25,
                r[1] - event.dy * 0.25
            ]);
            g.selectAll('path').attr('d', path);
        })
    );

    /* =======================
       6️⃣ KULLANICI ÜLKESİ
    ======================= */
    function detectUserCountry() {
        const lang = navigator.language || '';
        const map = {
            tr: 'Turkey',
            es: 'Spain',
            de: 'Germany',
            fr: 'France',
            it: 'Italy',
            en: 'United States'
        };
        return map[lang.split('-')[0]] || null;
    }

    /* =======================
       7️⃣ ÜLKE SEÇME (MERKEZ + RENK)
    ======================= */
    function focusCountry(feature) {
        var targetCountry = countryStats.find(c => feature.properties.name == c.country)

        if(targetCountry == undefined) {
            targetCountry = countryStats.find(c => c.countryCode == "en")
        }

        const [lng, lat] = d3.geoCentroid(feature);
        const rSlope = (window.innerWidth < 700) ? 1 : 2;

        d3.transition()
            .duration(900)
            .tween('rotate', () => {
                const r = d3.interpolate(
                    projection.rotate(),
                    [-lng, -lat / rSlope]
                );
                return t => {
                    projection.rotate(r(t));
                    g.selectAll('path').attr('d', path);
                };
            });

        // Country info outputs

        const countryName = document.querySelector('.world-by-us .info-card .country-info .country .name p')
        const countryFlag = document.querySelector('.world-by-us .info-card .country-info .country .flag img')
        const comment = document.querySelector('.world-by-us .info-card .country-info .comment p')
        const list = document.querySelector('.world-by-us .info-card .country-info .list')
        const sampleIMG = document.querySelector('.world-by-us .info-card .country-info .sample-img img')
        const sampleLOC = document.querySelector('.world-by-us .info-card .country-info .sample-img .sample-info p')
        list.innerHTML = "";

        countryName.textContent = targetCountry.country_lang;
        countryFlag.src = `https://countryflagsapi.netlify.app/flag/${(targetCountry.countryCode == "en") ? "us" : targetCountry.countryCode}.svg`;
        comment.textContent = targetCountry.comment;

        targetCountry.list.forEach(l => {
            var el = document.createElement('div');
            el.classList.add('el');

            el.innerHTML = `<p>${l}</p>`;

            list.appendChild(el);
        });

        sampleIMG.src = targetCountry.sample.IMG;
        sampleLOC.textContent = targetCountry.sample.LOC;
    }

    function selectCountry(countryName) {
        const feature = countries.find(
            f => f.properties.name === countryName
        );
        if (!feature) return;

        focusCountry(feature);
        if (countryStats.find(c => feature.properties.name == c.country)) {

            d3.selectAll('.country')
                .classed('active', d => d?.properties.name === countryName);

            currentCountry = countryName;
        }
    }

    let currentCountry = null;

    const userCountry = detectUserCountry();
    if (userCountry) {
        selectCountry(userCountry);
    }

    function getRandomCountry(exclude) {
        const list = countryStats
            .map(c => c.country)
            .filter(c => c !== exclude);

        if (!list.length) return null;
        return list[Math.floor(Math.random() * list.length)];
    }

    setInterval(() => {
        const next = getRandomCountry(currentCountry);
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