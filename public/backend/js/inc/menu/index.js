var navigationOptions = document.querySelectorAll('[type="navigation"] .option')

navigationOptions.forEach(option => {
    option.addEventListener('click', () => {
        var route = option.getAttribute('type')

        if (route == "main") {            
            window.location = "/"
        }
        else if (route == "gastro") {
            window.location = "/pages/gastro/"
        }
        else if (route == "contact") {
            console.log(route == "contact")
            window.location = "/pages/contact"
        }
        else if (route == "about") {
            if (window.location.href.includes('/pages/contact') == false) {
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
            else {
                window.location = "/?" + route
            }
        }
        else {
            if (window.location.href.includes('/pages/') == false) {
                const routeLocs = document.querySelectorAll('[route-loc]')
                routeLocs.forEach(loc => {
                    if (loc.getAttribute('route-loc') == route) {
                        window.scroll({
                            top: window.scrollY + loc.getBoundingClientRect().top,
                            behavior: "smooth"
                        })
                    }
                })

                targetAreaStatu = true
            }
            else {
                window.location = "/?" + route
            }
        }

        navMenu("close")
    })
})

// Nav menu
var navMenuDiv = document.querySelector('.header .mobil-nav')

function navMenu(statu) {
    
    if (statu == "open") {
        navMenuDiv.classList.add('active')
    }
    else if (statu == "close") {
        navMenuDiv.classList.remove('active')
    }
    else {
        navMenuDiv.classList.toggle('active')
    }
}