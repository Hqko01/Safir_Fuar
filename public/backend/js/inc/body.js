function imgLoad() {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
        if (img.complete) {
            img.parentElement.classList.add('loaded')
        }
        else {
            img.addEventListener('load', () => {
                img.parentElement.classList.add('loaded')
            })
        }

        img.addEventListener('error', () => {
            if (img.parentElement.getAttribute('type') == "project") {
                img.parentElement.parentElement.parentElement.remove();
            }
        })
    })

} imgLoad()


window.addEventListener('load', () => {
    const load = document.getElementById('load')

    load.classList.add('loaded')

    if (window.location.href.includes("mail.safirfuar.com")) { window.location = "mailto:info@safirfuar.com" }
})