const callRoutes = document.querySelectorAll('.router')

callRoutes.forEach(router => {
    router.addEventListener('click', () => {
        var routeType = router.getAttribute('type')
        if (routeType == "contact") {
            window.location = 'tel:+90 212 451 8810'
        }
        else if (routeType == "page") {
            var routePage = router.getAttribute('page')
            switch (routePage) {
                case "safirfuar-gastro":
                    window.location = 'pages/gastro/';
                    break;
                case "contact":
                    window.location = 'pages/contact/';

            }
        }
        else if (routeType == "url") {
            var url = router.getAttribute('url');

            window.location = url;
        }
    })
})