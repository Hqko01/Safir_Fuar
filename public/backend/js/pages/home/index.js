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
    aboutContents[aboutCounter].classList.remove('active')
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