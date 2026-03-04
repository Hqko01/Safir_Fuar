const express = require('express');
const fs = require('fs');
const app = express();
const session = require('express-session');
const axios = require('axios');
const qs = require("qs");
const { XMLParser } = require("fast-xml-parser");
const cheerio = require('cheerio');
const cors = require('cors');
const nodemailer = require('nodemailer')
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    proxy: false,
}));
app.use(express.urlencoded({ extended: true }));

const acceptedLanguages = [
    'tr', 'en', 'pt',
    'es', 'sv', 'de',
    'nl', 'fr', 'it',
    'ar'
];

function connection(req, res, next) {
    if (req.headers.host.split(".safirfuar.com")[0] == "www") {
        const userLanguages = req.acceptsLanguages();
        req.session.language = userLanguages.find((usl) => acceptedLanguages.find((acl => usl.toLowerCase() == acl.toLowerCase())));

        if (req.session.language == undefined) {
            req.session.language = "tr";
        }
    }
    else {
        req.session.language = req.headers.host.split(".safirfuar.com")[0];
    }
    next();
}

const sepcialOrigins = [{ origin: "https://ambiente.messefrankfurt.com", pageLength: 124 }, { origin: "https://www.psi-messe.com", pageLength: 5 }, { origin: "https://www.itb.com", pageLength: 112 }]

async function getSpecialOriginData(origin, page) {
    switch (origin) {
        case "https://ambiente.messefrankfurt.com":
            var list = [];

            try {
                const res = await fetchExhibitors(page, origin);

                if (res && res.data && Array.isArray(res.data)) {
                    res.data.forEach(e => {
                        const email = e?.exhibitor?.address?.email;
                        if (email) {
                            list.push({ "e-mail": email });
                        }
                    });
                }

                return list;

            } catch (err) {
                console.error("Veri alınırken hata oluştu:", err);
                return []; // Boş liste dön
            }
        case "https://www.psi-messe.com":
            var list = [];

            try {
                const res = await fetchExhibitors(page, origin);

                if (res && res.data && Array.isArray(res.data)) {
                    res.data.forEach(e => {
                        const email = e.email;
                        if (email) {
                            list.push({ "e-mail": email });
                        }
                    });
                }

                return list;

            } catch (err) {
                console.error("Veri alınırken hata oluştu:", err);
                return []; // Boş liste dön
            }
        case "https://www.itb.com":
            var list = [];
            try {
                const res = await fetchExhibitors(page, origin);

                if (res && res.data && Array.isArray(res.data)) {
                    res.data.forEach(e => {
                        if (e) {
                            list.push({ "e-mail": e });
                        }
                    });
                }

                return list;

            } catch (err) {
                console.error("Veri alınırken hata oluştu:", err);
                return []; // Boş liste dön
            }
        default:
            throw new Error(`Origin ${origin} için özel işlem tanımlı değil.`);
    }
}

async function fetchExhibitors(page, origin) {
    switch (origin) {
        case "https://ambiente.messefrankfurt.com":
            try {
                const response = await axios.get('https://api.messefrankfurt.com/service/esb_api/exhibitor-service/api/2.1/public/exhibitor/search', {
                    headers: {
                        'Accept': 'application/json',
                        'apikey': 'LXnMWcYQhipLAS7rImEzmZ3CkrU033FMha9cwVSngG4vbufTsAOCQQ==',
                        'Origin': 'https://ambiente.messefrankfurt.com',
                        'Referer': 'https://ambiente.messefrankfurt.com/'
                    },
                    params: {
                        language: 'en-GB',
                        q: '',
                        orderBy: 'name',
                        pageNumber: page,
                        pageSize: 30,
                        orSearchFallback: false,
                        showJumpLabels: true,
                        findEventVariable: 'AMBIENTE'
                    }
                });

                return { "data": response.data.result.hits, "length": response.data.result.hits.length };
            } catch (error) {
                console.error(`❌ Hata oluştu:`, error.response?.result || error.message);
                return [];
            }
        case "https://www.psi-messe.com":
            const urlPSI = 'https://xd0u5m6y4r-dsn.algolia.net/1/indexes/evt-aa4429de-e83c-4e73-a9aa-dfc11a9003d5-index/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1);%20Browser&x-algolia-application-id=XD0U5M6Y4R&x-algolia-api-key=d5cd7d4ec26134ff4a34d736a7f9ad47';


            const dataPSI = {
                params: `query=&page=${Number(page) - 1}&filters=recordType:exhibitor AND locale:en-gb AND eventEditionId:eve-a02ac4b5-9023-408c-84f0-b14a8112399f&facetFilters=&optionalFilters=[]`
            };

            try {
                const res = await axios.post(urlPSI, dataPSI, {
                    headers: {
                        'Accept-Language': 'tr,en-US;q=0.9,en;q=0.8',
                        'Origin': 'https://www.psi-messe.com',
                        'Referer': 'https://www.psi-messe.com/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                return { "data": res.data.hits, "length": res.data.nhPages };
            } catch (error) {
                console.error(`❌ Hata oluştu:`, error.response?.result || error.message);
                return [];
            }
        case "https://www.itb.com":
            const url = "https://live.messebackend.aws.corussoft.de/webservice/search";
            // curl'deki --data-raw kısmı (temizlenmiş hali)
            const data = qs.stringify({
                topic: "2023_itb",
                os: "web",
                appUrl: "https://www.itb.com/en/itb-berlin-for-visitors/exhibitor-list#/",
                lang: "en",
                apiVersion: "39",
                timezoneOffset: "-300",
                userLang: "tr",
                filterlist: "entity_orga",
                startresultrow: Number(page - 1) * 50,
                numresultrows: (Number(page - 1) * 50) + 50 - 1,
                order: "lexic"
            });

            try {
                const res = await axios.post(url, data, {
                    headers: {
                        "Accept": "*/*",
                        "Accept-Language": "tr,en-US;q=0.9,en;q=0.8",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "Origin": "https://www.itb.com",
                        "Referer": "https://www.itb.com/",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                    },
                });


                const parser = new XMLParser({
                    ignoreAttributes: false,
                    attributeNamePrefix: ""
                });
                const xml = parser.parse(res.data);
                // organization dizisi
                const orgs = xml.result?.entities?.organization || [];

                // e-posta attribute'larını topla
                const emails = orgs
                    .map(o => o.email)
                    .filter(Boolean) // boşları at
                    .map(e => e.trim().toLowerCase());

                return { "data": emails, "length": 112 };

            } catch (error) {
                console.error(`❌ Hata oluştu:`, error.response?.result || error.message);
                return [];
            }

            break;
    }
}

app.post('/img/:category', (req, res) => {
    var imgCategory = req.params.category
    fs.readdir(`./public/assets/img/${imgCategory}/`, (err, data) => {
        if (err) throw err;

        res.json({ img: data })
    })
})

app.get('/robots.txt', (req, res) => {
    fs.readFile('./views/robots.txt', (err, data) => {
        if (err) throw err;
        res.send(data)
    })
})

app.get('/260822', (req, res) => {
    /* Güvenlik bağlantısı olacak liriandev ile */

    res.render('./auth/collet-emails')
})

app.post('/260822/page', async (req, res) => {
    var url = req.body.url;
    const baseUrl = new URL(url).origin;
    const specialOriginControl = sepcialOrigins.some(e => e.origin == baseUrl)

    if (specialOriginControl) {
        var page = req.body.page;

        getSpecialOriginData(baseUrl, page)
            .then(output => {

                sepcialOrigins.forEach(e => {
                    if (e.origin == baseUrl) {
                        res.send({ statu: 200, "code": "specialOrigin", data: output, "pageLength": e.pageLength, "currentPage": page })
                    }
                })
            })
    }
    else {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            // Tüm src ve href attribute'lerini absolute path yapalım
            $('img[src], script[src], link[href]').each((i, el) => {
                const attrib = el.name === 'link' ? 'href' : 'src';
                var attrVal = $(el).attr(attrib);

                if (attrVal && attrVal.startsWith('/') || !attrVal.startsWith('http')) {
                    // göreli yolsa absolute yap
                    attrVal = (attrVal[0] != "/") ? "/" + attrVal : attrVal;

                    $(el).attr(attrib, baseUrl + attrVal);
                }
            });

            const bodyHTML = $('body').html();

            return res.send({
                statu: 200,
                data: bodyHTML
            });

        } catch (err) {
            return res.status(500).json({
                statu: 500,
                message: 'İstek sırasında hata oluştu.',
                error: err.message
            });
        }
    }
})

app.get('/260822/webmailer', (req, res) => {
    /* Güvenlik bağlantısı olacak liriandev ile */

    res.render('./auth/web-mailer')
})

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
        user: "info@safirfuar.com",
        pass: "Aa883224."
    }
});

/* const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'info@liriandev.com',
        pass: 'yvsj afww cxps hspn'
    }
}); */

app.post('/260822/webmailer/auth/:func', (req, res) => {
    const func = req.params.func;

    if (func == "mail") {
        transporter.verify((err, success) => {
            if (err) {
                res.send({ "statu": false, "err": err })
            }
            else {
                res.send({ "statu": true })
            }
        })
    }
    else if (func == "login") {
        const user = req.body.user;
        if (user == "safirfuar") {
            res.send({ "statu": true })
        }
        else {
            res.send({ "statu": false })
        }
    }
})

app.post('/260822/webmailer/send', async (req, res) => {
    const { to, subject, content } = req.body;

    if (!to || !subject || !content) {
        return res.status(400).json({ error: 'Eksik parametre.' });
    }

    try {
        const mailOptions = {
            from: `Safir Fuar <info@safirfuar.com>`,
            to,
            subject,
            html: `<p>${textToHtml(content)}</p>
            <img src="https://safirfuar.com/assets/img/logo/signature.jpg" alt="Safir Fuar Signature" style="width:100%; max-width:600px; margin-top:10px; display:block;"/>`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Gönderildi:", result.messageId);

        return res.status(200).json({ success: true, id: result.messageId });
    } catch (err) {
        console.error("❌ Gönderim hatası:", err.message);
        return res.status(500).json({ error: err.message });
    }
})

function textToHtml(content) {
    if (!content) return "";

    // 1. XSS güvenliği için HTML özel karakterlerini escape et
    let safeContent = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. URL'leri yakala (http://, https://, www.)
    const urlRegex = /\b((https?:\/\/[^\s]+)|(www\.[^\s]+))/g;
    safeContent = safeContent.replace(urlRegex, function (url) {
        let href = url.startsWith("www.") ? "http://" + url : url;
        return `<a href="${href}" target="_blank">${url}</a>`;
    });

    // 3. E-posta adreslerini yakala
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    safeContent = safeContent.replace(emailRegex, function (email) {
        return `<a href="mailto:${email}">${email}</a>`;
    });

    // 4. Telefon numaralarını yakala (ör: +905551112233 veya 05551112233)
    const phoneRegex = /(\+?\d[\d\s-]{7,}\d)/g;
    safeContent = safeContent.replace(phoneRegex, function (phone) {
        // boşluk ve tireleri kaldırıp sadece rakam bırak
        let cleanPhone = phone.replace(/[\s-]/g, "");
        return `<a href="tel:${cleanPhone}">${phone}</a>`;
    });

    // 5. Satır sonlarını <br> ile değiştir
    safeContent = safeContent.replace(/\n/g, "<br>");

    return safeContent;
}

app.get('/', connection, (req, res) => {
    res.render(`./pages/${req.session.language}/home/index`, { "language": req.session.language });
})

app.get('/pages/:page', connection, (req, res) => {
    var page = req.params.page;

    if (fs.existsSync(`./views/pages/${req.session.language}/${page}/index.ejs`)) {
        res.render(`./pages/${req.session.language}/${page}/index`, { "language": req.session.language });
    }
    else {
        res.redirect(`/`)
    }
})

app.get('/sitemap.xml', connection, (req, res) => {
    fs.readFile(`./views/${req.session.language}/sitemap.xml`, (err, data) => {
        if (err) throw err;
        res.send(data)
    })
})

app.listen(process.env.PORT || 5000, function () {
    console.log('http://localhost:5000')
});