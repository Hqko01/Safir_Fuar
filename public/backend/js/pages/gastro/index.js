const AllProjectsDiv = document.querySelector('.sffg-gallery .all-gallery-output')
const AllProjectsDivOutput = document.querySelector('.sffg-gallery .all-gallery-output .cnt .output')
const AllProjectsDivClose = document.querySelector('.sffg-gallery .all-gallery-output .cnt .close')
const loadingAnimation = document.querySelector('.sffg-gallery .all-gallery-output .cnt .loading')
var allImages = [];

function galleryData() {
    if (AllProjectsDiv.classList.contains('active')) {
        AllProjectsDiv.classList.remove('active')
        setTimeout(() => {
            AllProjectsDiv.style.display = "none"
        }, 400);

    }
    else {
        AllProjectsDiv.style.display = "block"
        setTimeout(() => {
            AllProjectsDiv.classList.add('active')
        }, 10);
    }

    fetch('/img/gastro-gallery', {
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {
            allImages = data.img
        })
}

AllProjectsDivClose.addEventListener('click', () => {
    galleryData()
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
                        newImgDiv.innerHTML = `<div class="img" type="project"><img src="/assets/img/gastro-gallery/${img}" loading="lazy"></div>`;
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