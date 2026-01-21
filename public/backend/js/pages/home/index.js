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
            country_lang: "İsveç",
            countryCode: "sv",
            comment: "İsveç’te katıldığımız fuarlarda markaların profesyonel şekilde temsil edilmesini sağladık.",
            list: [
                "10+ Fuar Katılımı",
                "Uluslararası Markalar",
                "Modern Stand Tasarımı",
                "Stockholm projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-3.webp",
                LOC: "Stockholm Expo"
            }
        },
        {
            country: "Portugal",
            country_lang: "Portekiz",
            countryCode: "pt",
            comment: "Portekiz’de yer aldığımız fuarlarda markaların doğru ziyaretçilerle buluşmasına katkı sağladık.",
            list: [
                "8+ Fuar Katılımı",
                "Uluslararası Katılımcılar",
                "Marka Odaklı Standlar",
                "Lizbon projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-4.webp",
                LOC: "Lisbon Expo"
            }
        },
        {
            country: "Netherlands",
            country_lang: "Hollanda",
            countryCode: "nl",
            comment: "Hollanda’daki fuarlarda markaların yenilikçi şekilde öne çıkmasını sağladık.",
            list: [
                "12+ Fuar Katılımı",
                "Avrupa Merkezli Markalar",
                "Stand ve Dijital Sunum",
                "Amsterdam projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-5.webp",
                LOC: "Amsterdam RAI"
            }
        },
        {
            country: "Italy",
            country_lang: "İtalya",
            countryCode: "it",
            comment: "İtalya’daki fuarlarda markaların hedef kitleleriyle güçlü bağlar kurmasına destek olduk.",
            list: [
                "15+ Fuar Katılımı",
                "Ulusal ve Uluslararası Markalar",
                "Stand Tasarımı",
                "Milano projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-6.webp",
                LOC: "Fiera Milano"
            }
        },
        {
            country: "France",
            country_lang: "Fransa",
            countryCode: "fr",
            comment: "Fransa’daki fuarlarda markaların görünürlüğünü ve etkileşimini artırdık.",
            list: [
                "14+ Fuar Katılımı",
                "Uluslararası Markalar",
                "Profesyonel Stand Çözümleri",
                "Paris projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-7.webp",
                LOC: "Paris Expo"
            }
        },
        {
            country: "Spain",
            country_lang: "İspanya",
            countryCode: "es",
            comment: "İspanya’daki fuarlarda markaların doğru kitleyle buluşmasına katkı sağladık.",
            list: [
                "11+ Fuar Katılımı",
                "Uluslararası Markalar",
                "Stand ve Sunum Tasarımı",
                "Barselona projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-8.webp",
                LOC: "Fira Barcelona"
            }
        },
        {
            country: "United States America",
            country_lang: "Amerika Birleşik Devletleri",
            countryCode: "us",
            comment: "ABD’de katıldığımız fuarlarda markaların küresel ölçekte öne çıkmasını sağladık.",
            list: [
                "20+ Fuar Katılımı",
                "Küresel ve Yerel Markalar",
                "Stand Tasarımı ve Dijital Sunum",
                "New York, Las Vegas projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-9.webp",
                LOC: "Las Vegas Expo"
            }
        },
        {
            country: "Germany",
            country_lang: "Almanya",
            countryCode: "de",
            comment: "Almanya’daki fuarlarda markaların hedef kitleleriyle etkili şekilde buluşmasını sağladık.",
            list: [
                "20+ Fuar Katılımı",
                "Uluslararası Markalar",
                "Stand Tasarımı",
                "Berlin projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-10.webp",
                LOC: "Berlin Expo"
            }
        },
        {
            country: "Saudi Arabia",
            country_lang: "Suudi Arabistan",
            countryCode: "ar",
            comment: "Suudi Arabistan’daki fuarlarda markaların doğru kitleye etkili şekilde ulaşmasını sağladık.",
            list: [
                "10+ Fuar Katılımı",
                "Uluslararası Markalar",
                "Stand ve Dijital Sunum",
                "Riyad projeleri"
            ],
            sample: {
                IMG: "/assets/img/projects/project-11.webp",
                LOC: "Riyadh Expo"
            }
        }
    ]


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

        if (targetCountry == undefined) {
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