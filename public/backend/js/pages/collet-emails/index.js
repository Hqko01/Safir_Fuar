var list = []
var error;
var newSite;
var sendedMails = []

if (localStorage.getItem('sendedMails') != undefined) {
    sendedMails = JSON.parse(localStorage.getItem('sendedMails'))
}

const authButton = document.getElementById('auth-button')
const authPage = document.querySelector('.auth')
const reload = document.querySelector('.main .reload')

var sendedMails = [];

authButton.addEventListener('dblclick', () => {
    const user = document.getElementById('auth-user');

    const userAuth = async () => {
        const response = await fetch('/260822/webmailer/auth/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "user": user.value })
        })

        const data = await response.json();

        return data;
    }

    userAuth()
        .then(res => {
            if (res.statu) {
                authPage.classList.add('remove')
            }
            else {
                user.classList.add('err')

                setTimeout(() => {
                    user.classList.remove('err')
                }, 2000);
            }
        })
})

// Page links
var nowPage = "1";
var pageCounter = 0;
var examplePageLink;
var getOtherPageStatu = false
var originDomain;
var fullURL;

var outputListElement;

function listDupControl(originDomain) {
    const seen = new Set();

    return list[originDomain][nowPage].filter(mail => {
        const lower = mail["e-mail"].toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
    });
}

function arrayDupControl(array) {
    const seen = new Set();

    return array.filter(data => {
        const lower = data.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
    });
}

const main = document.querySelector('.main')
const getURL = document.getElementById('getURL')
const inputButton = document.querySelector('.main .input .content .input-area .button')
const output = document.querySelector('.main .output')

inputButton.addEventListener('click', () => {
    if (!inputButton.classList.contains('load') && getURL.value && !getURL.classList.contains('err')) {
        inputButton.classList.add('load')

        const url = getURL.value.trim();
        originDomain = new URL(url).hostname.replace('www.', '');
        fullURL = url;

        console.log(originDomain, list)

        if (list[originDomain] == undefined) {
            list[originDomain] = {}
        }

        if (list[originDomain][nowPage] == undefined) {
            list[originDomain][nowPage] = [];
            newSite = true
        }

        const skipTags = ['head', 'script', 'noscript', 'style', 'footer', 'nav'];

        const request = async () => {
            const response = await fetch(`/260822/page/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, "page": nowPage })
            });

            const data = await response.json();
            return data;
        };

        request().then(res => {
            if (res.statu !== 200) {
                error = true
                return alert("❌ Veri çekilemedi.");
            }

            if (res.code == undefined) {
                pageCounter = 0

                const container = document.createElement('div');
                container.innerHTML = res.data;

                const mailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const allElements = container.querySelectorAll('body > *');

                allElements.forEach((el) => {
                    const tag = el.tagName?.toLowerCase();
                    if (skipTags.includes(tag)) return;

                    const classes = el.className?.toLowerCase();
                    const id = el.id?.toLowerCase();

                    // 💣 Footer, header, menu, navbar gibi elementleri atla
                    const skipByPosition =
                        tag.includes('footer') ||
                        tag.includes('nav') ||
                        tag.includes('header') ||
                        classes?.includes('footer') ||
                        classes?.includes('nav') ||
                        classes?.includes('menu') ||
                        classes?.includes('appbar') ||
                        id?.includes('footer') ||
                        id?.includes('nav') ||
                        id?.includes('menu');

                    if (skipByPosition) return;

                    // ✨ İçerikten mail ayıklama
                    const rawHTML = el.innerHTML;
                    const decoded = decodeHTMLEntities(rawHTML);
                    const matches = decoded.match(mailRegex);

                    if (matches) {
                        matches
                            .filter(isValidEmail)
                            .forEach(mail => {
                                const mailDomain = mail.split('@')[1];

                                // Eğer mail domain siteye aitse ve element konumu şüpheliyse, atla
                                if (mailDomain.includes(originDomain) || skipByPosition) return;


                                // ❌ Aynı mail zaten varsa listeye ekleme
                                const isExist = list[originDomain][nowPage].some(item => item["e-mail"] === mail);
                                if (!isExist) {
                                    list[originDomain][nowPage].push({ "e-mail": mail });
                                }
                            });
                    }
                });

                // Cloudflare encoded mailleri çöz
                const cfElements = container.querySelectorAll('[data-cfemail]');

                cfElements.forEach((el, index) => {
                    const tag = el.tagName?.toLowerCase();
                    const classes = el.className?.toLowerCase();
                    const id = el.id?.toLowerCase();

                    // ⚠️ Şüpheli yerler: footer, header, menu, nav...
                    const skipByPosition =
                        tag.includes('footer') ||
                        tag.includes('nav') ||
                        tag.includes('header') ||
                        classes?.includes('footer') ||
                        classes?.includes('nav') ||
                        classes?.includes('menu') ||
                        classes?.includes('appbar') ||
                        id?.includes('footer') ||
                        id?.includes('nav') ||
                        id?.includes('menu');

                    if (skipTags.includes(tag)) return;

                    const encoded = el.getAttribute('data-cfemail');
                    const decodedEmail = decodeCfEmail(encoded);

                    // ❌ Eğer domain uyumluysa ve pozisyon da şüpheliyse atla
                    const mailDomain = decodedEmail.split('@')[1];
                    if (mailDomain.includes(originDomain) || skipByPosition) return;

                    // ❌ Aynı mail zaten varsa listeye ekleme
                    const isExist = list[originDomain][nowPage].some(item => item["e-mail"] === decodedEmail);
                    if (!isExist) {
                        list[originDomain][nowPage].push({ "e-mail": decodedEmail });
                    }

                    // ✅ Son elemanda callback tetikle
                    if (index === cfElements.length - 1) {
                        findParent(el, index);
                    }
                });

                container.querySelectorAll('[href]').forEach((hrefEl, index) => {

                    // Get list pages
                    if (hrefEl.href.includes('?') && hrefEl.href.includes('=')) {
                        if (getURL.value.includes((hrefEl.href.split('?')[0].includes(window.location.origin)) ? hrefEl.href.split('?')[0].replace(window.location.origin, "") : hrefEl.href.split('?')[0]) || hrefEl.href.split('?')[0] == "" || hrefEl.href.split('?')[0] == window.location.href) {
                            var pageNumber = hrefEl.href.split('=')[1].match(/\d+/g)?.[0];

                            if (pageCounter < Number(pageNumber)) {
                                pageCounter = Number(pageNumber)
                                examplePageLink = hrefEl.getAttribute('href')
                                outputListElement = hrefEl;
                            }
                        }
                    }

                    if (index == container.querySelectorAll('[href]').length - 1) {
                        getOutputList().then(() => {
                            if (!error) {
                                main.classList.add('output');
                                list[originDomain][nowPage] = listDupControl(originDomain);
                            }

                            inputButton.classList.remove('load');
                        });
                    }
                })
            }
            else {
                nowPage = res.currentPage;
                pageCounter = res.pageLength;
                list[originDomain][nowPage] = list[originDomain][nowPage].concat(res.data);
                getOutputContent(true)
            }

        })
        // main.classList.add('active')
    }

    if (!getURL.value && !getURL.classList.contains('err')) {
        inputButton.classList.remove('load')
        getURL.classList.add('err')
        setTimeout(() => {
            getURL.classList.remove('err')
        }, 2000)
    }
    else {
        getURL.classList.remove('err')
    }
})

async function getOutputList() {
    if (!getOtherPageStatu) { nowPage = "1" }

    originDomain = new URL(getURL.value).hostname.replace('www.', '');

    const array = [];
    const promises = [];
    var listParent = outputListElement;

    if (listParent == undefined) {
        alert("Bir problem meydana geldi")
    }
    else {
        function control() {
            if (listParent.childElementCount < 4 || listParent.querySelector('[href]').getAttribute('href').includes('?page') || listParent.querySelector('[href]').getAttribute('href').includes('?p') || listParent.querySelector('[href]').classList.contains('page-lingk')) {
                listParent = listParent.parentElement
                control()
            }
            else if (listParent.childElementCount >= 4) {
                listParent.querySelectorAll('*').forEach(el => {
                    if (el.classList.value.includes('pagination')) {
                        el.remove();
                    }
                })

                start()
            }
        } control()
    }

    function start() {
        var url;
        for (let x = 0; x < listParent.childElementCount; x++) {
            const child = listParent.children[x];

            if (child.innerHTML.includes('href=')) {
                const elements = child.querySelectorAll('a');

                elements.forEach((el) => {
                    const href = el.getAttribute('href');
                    const text = el.textContent.trim();

                    if (!href.includes('tel:+')) {
                        if (href.startsWith('http') == false) {
                            if (href.startsWith('www') == false) {
                                if (href && href != "#") {
                                    if (!getURL.value.includes(href)) {

                                        if (href.startsWith('/')) {
                                            url = `https://${originDomain}${href}`
                                        }
                                        else {
                                            url = `https://${originDomain}/${href}`
                                        }

                                        const reqPromise = fetch(`/260822/page/`, {
                                            method: "POST",
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ "url": url })
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.statu !== 200) {
                                                    console.error("❌ Veri çekilemedi:", url);
                                                    return;
                                                }
                                                var newArray = []
                                                const skipTags = ['head', 'script', 'noscript', 'style', 'footer', 'nav'];
                                                originDomainChild = new URL(url).hostname.replace('www.', '');

                                                const container = document.createElement('div');
                                                container.innerHTML = data.data;

                                                const mailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                                                const allElements = container.querySelectorAll('*');

                                                allElements.forEach((el) => {
                                                    if (["VIDEO", "IMG", "SOURCE", "SRC"].includes(el.tagName)) el.remove();

                                                    const rawHTML = el.innerHTML;
                                                    const decoded = decodeHTMLEntities(rawHTML);
                                                    const matches = decoded.match(mailRegex);

                                                    const tag = el.tagName?.toLowerCase();
                                                    if (skipTags.includes(tag)) return;

                                                    if (typeof el.className == "string") {
                                                        var classes = el.className?.toLowerCase();
                                                        var id = el.id?.toLowerCase();

                                                        // 💣 Footer, header, menu, navbar gibi elementleri atla
                                                        var skipByPosition =
                                                            tag.includes('footer') ||
                                                            tag.includes('nav') ||
                                                            tag.includes('header') ||
                                                            classes?.includes('footer') ||
                                                            classes?.includes('nav') ||
                                                            classes?.includes('menu') ||
                                                            classes?.includes('appbar') ||
                                                            id?.includes('footer') ||
                                                            id?.includes('nav') ||
                                                            id?.includes('menu');

                                                        if (skipByPosition) return;
                                                    }

                                                    // ✨ İçerikten mail ayıklama

                                                    if (matches) {
                                                        matches
                                                            .filter(isValidEmail)
                                                            .forEach(mail => {
                                                                const mailDomain = mail.split('@')[1];

                                                                // Eğer mail domain siteye aitse ve element konumu şüpheliyse, atla
                                                                if (mailDomain.includes(originDomain) || skipByPosition) return;

                                                                // ❌ Aynı mail zaten varsa listeye ekleme
                                                                const isExist = newArray.some(item => item["e-mail"] === mail);
                                                                if (!isExist) {
                                                                    newArray.push({ "e-mail": mail });
                                                                }
                                                            });
                                                    }
                                                });

                                                // Cloudflare decode
                                                const cfElements = container.querySelectorAll('[data-cfemail]');
                                                cfElements.forEach((el) => {
                                                    const tag = el.tagName?.toLowerCase();
                                                    const classes = el.className?.toLowerCase();
                                                    const id = el.id?.toLowerCase();

                                                    // ⚠️ Şüpheli yerler: footer, header, menu, nav...
                                                    const skipByPosition =
                                                        tag.includes('footer') ||
                                                        tag.includes('nav') ||
                                                        tag.includes('header') ||
                                                        classes?.includes('footer') ||
                                                        classes?.includes('nav') ||
                                                        classes?.includes('menu') ||
                                                        classes?.includes('appbar') ||
                                                        id?.includes('footer') ||
                                                        id?.includes('nav') ||
                                                        id?.includes('menu');

                                                    if (skipTags.includes(tag)) return;

                                                    const encoded = el.getAttribute('data-cfemail');
                                                    const decodedEmail = decodeCfEmail(encoded);

                                                    // ❌ Eğer domain uyumluysa ve pozisyon da şüpheliyse atla
                                                    const mailDomain = decodedEmail.split('@')[1];
                                                    if (mailDomain.includes(originDomain) || skipByPosition) return;

                                                    // ❌ Aynı mail zaten varsa listeye ekleme
                                                    const isExist = newArray.some(item => item["e-mail"] === decodedEmail);
                                                    if (!isExist) {
                                                        newArray.push({ "e-mail": decodedEmail });
                                                    }
                                                });

                                                if (newArray.length == 0) {
                                                    var AElements = container.querySelectorAll('a');

                                                    AElements.forEach((el) => {
                                                        const href = el.getAttribute('href');
                                                        const text = el.textContent.trim();

                                                        if (href != null || href != undefined) {
                                                            if (!href.includes('tel:+')) {
                                                                if (href.startsWith('http') || href.startsWith('www')) {
                                                                    if (!getURL.value.includes(href)) {
                                                                        if (el.textContent) {
                                                                            if (compareFirmNameWithSlug(href, el.textContent) >= 0.6) {
                                                                                if ((countOccurrences(href, 'iletisim') <= 1) && (countOccurrences(href, 'contact') <= 1)) {
                                                                                    const isExist = array.some(item => item["url"] === href);
                                                                                    if (!isExist) {
                                                                                        array.push({ "origin": originDomainChild, "url": href });
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                                else {
                                                    list[originDomain][nowPage] = list[originDomain][nowPage].concat(newArray)
                                                }
                                            })
                                        // Promise listesine ekle
                                        promises.push(reqPromise);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    await Promise.all(promises);

    // İletişim sayfalarına da istek at
    const contactPromises = array.map(async (page) => {
        const baseURL = page.url.startsWith('http')
            ? page.url
            : page.url.startsWith('www')
                ? page.url.replace('www.', 'https://')
                : null;

        if (!baseURL) {
            console.error(page.url, "geçersiz");
            return;
        }

        const tryUrls = [baseURL]; // önce ana sayfa
        const endsWithSlash = baseURL.endsWith('/');
        tryUrls.push(baseURL + (endsWithSlash ? 'iletisim' : '/iletisim'));
        tryUrls.push(baseURL + (endsWithSlash ? 'contact' : '/contact'));

        for (let fullURL of tryUrls) {
            try {
                const res = await fetch("/260822/page/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: fullURL })
                });

                const data = await res.json();
                if (data.statu !== 200) {
                    console.warn("❌ Sayfa çekilemedi:", fullURL);
                    continue; // bir sonrakine geç
                }

                const container = document.createElement('div');
                container.innerHTML = data.data;

                const mailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                if (!list[originDomain][nowPage]) list[originDomain][nowPage] = [];

                let found = false;

                container.querySelectorAll('*').forEach(el => {
                    if (["VIDEO", "IMG", "SOURCE", "SRC"].includes(el.tagName)) return;

                    const rawHTML = el.innerHTML;
                    const decoded = decodeHTMLEntities(rawHTML);
                    const matches = decoded.match(mailRegex);

                    if (matches) {
                        matches
                            .filter(isValidEmail)
                            .forEach(mail => {
                                const isExist = list[originDomain][nowPage].some(item => item["e-mail"] === mail);
                                if (!isExist) {
                                    list[originDomain][nowPage].push({ "e-mail": mail });
                                    found = true;
                                }
                            });
                    }
                });

                // Cloudflare encoded mailleri çöz
                container.querySelectorAll('[data-cfemail]').forEach(el => {
                    const encoded = el.getAttribute('data-cfemail');
                    const decodedEmail = decodeCfEmail(encoded);

                    const isExist = list[originDomain][nowPage].some(item => item["e-mail"] === decodedEmail);
                    if (!isExist) {
                        list[originDomain][nowPage].push({ "e-mail": decodedEmail });
                        found = true;
                    }
                });

                if (found) {
                    console.log("📥 E-posta bulundu:", fullURL);
                    break; // eğer bulunduysa diğer URL'lere bakma
                }

            } catch (err) {
                console.error("⚠️ Hata:", fullURL, err.message);
            }
        }
    });

    await Promise.all(contactPromises);


    const outputDivs = output.querySelectorAll('.list')

    if (outputDivs.length > 0) {
        outputDivs.forEach((div, index) => {
            var list = div.getAttribute('id')

            if (list == originDomain) {
                getOtherPageStatu = true
            }

            if (index == outputDivs.length - 1) {
                getOutputContent()
            }
        })
    }
    else {
        getOutputContent()
    }
}

function getOutputContent(specialOrigin = null) {
    if (!getOtherPageStatu) {
        var listDiv = document.createElement('div');
        var listDivTop = document.createElement('div')
        var listDivCenter = document.createElement('div')
        var listDivBottom = document.createElement('div')

        listDiv.classList.add('list')
        listDiv.setAttribute('id', originDomain)

        listDivTop.classList.add('top')
        listDivTop.innerHTML = `<div class="name"><p>${originDomain}</p></div>`;
        listDiv.appendChild(listDivTop);

        listDivCenter.classList.add('center')
        list[originDomain][nowPage].map(email => {
            var data = document.createElement('div')
            data.classList.add('data')

            sendedMails.forEach(sendedMail => {
                if (sendedMail['e-mail'] == email['e-mail']) {
                    data.classList.add('sended')
                }
            })

            data.setAttribute('data-email', email['e-mail'])
            data.setAttribute('ondblclick', `removeListData(this, this.getAttribute('data-email'), '${originDomain}', '${nowPage}')`)

            data.innerHTML = `<p>${email['e-mail']}</p>`
            listDivCenter.appendChild(data);
        })
        listDiv.appendChild(listDivCenter);

        listDivBottom.classList.add('bottom')
        var pagesDiv = document.createElement('div')
        pagesDiv.classList.add('pages')

        if (specialOrigin == null) {
            if (!examplePageLink.startsWith('http') && !examplePageLink.startsWith('www')) {
                examplePageLink = `${getURL.value}${examplePageLink.split('=')[0]}`
            }

            for (let x = 1; x <= pageCounter; x++) {
                var page = document.createElement('div')
                page.classList.add('page')
                page.setAttribute('page', x)


                if (examplePageLink.startsWith('http') || examplePageLink.startsWith('www')) {
                    page.setAttribute('onclick', `getOtherPages('${examplePageLink.split('=')[0]}=${x}', null, this)`)
                }
                else {
                    page.setAttribute('onclick', `getOtherPages('${examplePageLink}=${x}', null, this)`)
                }
                page.innerHTML = `<p>${x}</p>`;

                if (nowPage == x) {
                    page.classList.add('active')
                }

                pagesDiv.appendChild(page)
            }
        }
        else {
            for (let x = 1; x <= pageCounter; x++) {
                var page = document.createElement('div')
                page.classList.add('page')
                page.setAttribute('page', x)

                page.setAttribute('onclick', `getOtherPages('${fullURL}', '${x}', this)`)
                page.innerHTML = `<p>${x}</p>`;

                if (nowPage == x) {
                    page.classList.add('active')
                }

                pagesDiv.appendChild(page)
            }
        }

        listDivBottom.appendChild(pagesDiv)

        var buttons = document.createElement('div')
        buttons.classList.add('buttons')

        buttons.innerHTML = `<div class="trash button" onclick="removeList('${originDomain}')">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                            </svg>
                        </div>
                        <div class="mail button" onclick="sendToMailer('${originDomain}')">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
                            </svg>
                        </div>`

        listDivBottom.appendChild(buttons)
        listDiv.appendChild(listDivBottom)
        output.appendChild(listDiv)

        if (!main.classList.contains('active')) {
            main.classList.add('active')
        }

        pagesDiv.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                pagesDiv.scroll({
                    left: pagesDiv.scrollLeft + 128,
                    behavior: 'smooth'
                })
            }
            else {
                pagesDiv.scroll({
                    left: pagesDiv.scrollLeft - 128,
                    behavior: 'smooth'
                })
            }
        })
    }
    else {
        const listDivs = output.querySelectorAll('.list')

        listDivs.forEach(listDiv => {
            if (listDiv.id == originDomain) {
                const center = listDiv.querySelector('.center');
                const pages = listDiv.querySelectorAll('.bottom .pages .page');

                center.innerHTML = ``

                list[originDomain][nowPage].map(email => {
                    var data = document.createElement('div')
                    data.classList.add('data')
                    data.setAttribute('data-email', email['e-mail'])
                    data.setAttribute('ondblclick', `removeListData(this, this.getAttribute('data-email'), '${originDomain}', '${nowPage}')`)

                    sendedMails.forEach(sendedMail => {
                        if (sendedMail['e-mail'] == email['e-mail']) {
                            data.classList.add('sended')
                        }
                    })

                    data.innerHTML = `<p>${email['e-mail']}</p>`
                    center.appendChild(data);
                })

                pages.forEach(page => {
                    if (page.classList.contains('active')) { page.classList.remove('active') }

                    if (page.getAttribute('page') == nowPage) {
                        page.classList.add('active')
                    }
                })

                getOtherPageStatu = false
            }
        })
    }

    inputButton.classList.remove('load');
}

function isValidEmail(mail) {
    const forbiddenExtensions = ['.jpg', '.png', '.svg', '.webp', '.jpeg', '.gif'];
    return !forbiddenExtensions.some(ext => mail.toLowerCase().endsWith(ext));
}

function decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

function decodeCfEmail(encoded) {
    const r = parseInt(encoded.substr(0, 2), 16);
    let email = '';
    for (let n = 2; n < encoded.length; n += 2) {
        const charCode = parseInt(encoded.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(charCode);
    }
    return email;
}

function countOccurrences(str, word) {
    return (str.match(new RegExp(word, 'gi')) || []).length;
}

function normalizeText(str) {
    return str
        .toLocaleUpperCase('tr-TR')
        .replace(/[Ç]/g, 'C')
        .replace(/[Ğ]/g, 'G')
        .replace(/[İI]/g, 'I')
        .replace(/[Ö]/g, 'O')
        .replace(/[Ş]/g, 'S')
        .replace(/[Ü]/g, 'U')
        .replace(/[\.\,\&\-\_]/g, ' ') // özel karakterleri boşluk yap
        .replace(/\s+/g, ' ')         // çoklu boşlukları tek boşluk yap
        .trim();
}

function levenshteinDistance(a, b) {
    const matrix = [];
    const lenA = a.length;
    const lenB = b.length;

    for (let i = 0; i <= lenB; i++) matrix[i] = [i];
    for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

    for (let i = 1; i <= lenB; i++) {
        for (let j = 1; j <= lenA; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }

    return matrix[lenB][lenA];
}

function stringSimilarity(a, b) {
    const distance = levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - distance / maxLen;
}

function compareFirmNameWithSlug(name, slug) {
    const nameNorm = normalizeText(name);
    const slugNorm = normalizeText(slug.replace(/-/g, ' ')); // slug'taki '-''leri boşluğa çevir

    const similarity = stringSimilarity(nameNorm, slugNorm);
    return similarity;
}

function findParent(el, targetLength) {
    var current = el.parentElement;

    function find() {
        if (current.children.length >= targetLength) {
            current = current.parentElement
            find()
        }
        else {
            if (newSite) {
                findZero(current.children[0])
            }
            else {

            }
        }
    } find()
}

function findZero(div) {
    if (div.childElementCount != 0) {
        for (let x = 0; x < div.childElementCount; x++) {
            findZero(div.children[x])
        }
    }
    else {
        if (div.textContent && div.textContent != "[email protected]") {
            //  path - getGeneralPath(div)
            // element - div
        }
    }
}
function getGeneralPath(el) {
    if (!(el instanceof Element)) return null;

    const path = [];
    while (el && el.tagName !== 'HTML') {
        let selector = el.tagName.toLowerCase();

        if (el.className) {
            const classes = el.className.trim().split(/\s+/).filter(c => !!c);
            if (classes.length > 0) {
                selector += '.' + classes.join('.');
            }
        }

        path.unshift(selector);
        el = el.parentElement;
    }

    return path.join(' > ');
}

function getOtherPages(url, page = null, target) {
    if ((target.parentElement.getBoundingClientRect().width / 2) < target.getBoundingClientRect().left) {
        target.parentElement.scroll({
            left: target.parentElement.scrollLeft + (-1 * ((target.parentElement.getBoundingClientRect().width / 2) - target.getBoundingClientRect().left)),
            behavior: 'smooth'
        })
    }
    else {
        target.parentElement.scroll({
            left: target.parentElement.scrollLeft - ((target.parentElement.getBoundingClientRect().width / 2) - target.getBoundingClientRect().left),
            behavior: 'smooth'
        })
    }

    getOtherPageStatu = true
    if (page != null) {
        nowPage = page;
    }
    else {
        nowPage = String(url.split('=')[1]);
    }
    getURL.value = url;
    inputButton.click();
}

function removeList(originDomain) {
    const listDivs = output.querySelectorAll('.list');

    listDivs.forEach(div => {
        if (div.getAttribute('id') == originDomain) {
            div.remove();
            delete list[originDomain];

            if (listDivs.length - 1 == 0) {
                getURL.value = ""
                main.classList.remove('active')
            }
        }
    })
}

function removeListData(el, data, originDomain, page) {
    if (!list[originDomain] || !list[originDomain][page]) return;

    list[originDomain][page] = list[originDomain][page].filter(email => email['e-mail'] !== data);
    el.remove();
}

function sendToMailer(originDomain) {
    const listDivs = document.querySelectorAll('.main .output .list');

    listDivs.forEach(div => {
        if (div.getAttribute('id') == originDomain) {
            const pages = div.querySelectorAll('.bottom .pages .page');
            const contents = div.querySelectorAll('.center .data')

            pages.forEach(page => {
                if (page.classList.contains('active')) {
                    var listNowPage = page.getAttribute('page');

                    list[originDomain][listNowPage].forEach(listEmail => {
                        const isSent = sendedMails.find(sent => sent["e-mail"] === listEmail["e-mail"]);
                        if (!isSent) {
                            sendedMails.push({ "e-mail": listEmail["e-mail"] })

                            contents.forEach(email => {
                                if (email.getAttribute('data-email') == listEmail["e-mail"]) {
                                    email.classList.add('sended');
                                }
                            })
                        }
                    })

                    localStorage.setItem('sendedMails', JSON.stringify(sendedMails));
                }
            })
        }
    })
}