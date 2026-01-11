const statuPage = document.querySelector('.statu')
const contentInput = document.querySelector('.main .list-area .input');
const contentOutput = document.querySelector('.main .list-area .output');
const title = document.querySelector('.main .text-editor .content-title input');
const text = document.querySelector('.main .text-editor .content-text textarea');
const sendButton = document.querySelector('.main .text-editor .button');
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
                const mailAuth = async () => {
                    const res = await fetch('/260822/webmailer/auth/mail', {
                        method: "POST",
                    })

                    const data = await res.json();

                    return data;
                }

                mailAuth()
                    .then(res => {
                        if (res.statu) {
                            statuPage.classList.add('success')

                            // LocalStorage'dan sendedMails yükle veya örnek ekle
                            if (localStorage.getItem('sendedMails') != undefined) {
                                sendedMails = JSON.parse(localStorage.getItem('sendedMails'));
                                populateInputFromSendedMails();
                            }

                            let isPaused = true;  // Başlangıçta duraklamış (send class varsa duruyor)
                            let sendInterval;

                            sendButton.addEventListener('click', () => {
                                sendButton.classList.remove('err')
                                if (!title.value.trim() || !text.value.trim()) {
                                    sendButton.classList.add('err')

                                    setTimeout(() => {
                                        sendButton.classList.remove('err')
                                    }, 2000);
                                    return; // Fonksiyondan çık, devam etme
                                }

                                if (sendButton.classList.contains('send')) {
                                    // Duraklatılmış, tıklayınca başlat
                                    isPaused = false;
                                    sendButton.classList.remove('send');
                                    sendButton.classList.add('pause');
                                    startSending();
                                } else {
                                    // Gönderim devam ediyor, tıklayınca duraklat
                                    isPaused = true;
                                    sendButton.classList.remove('pause');
                                    sendButton.classList.add('send');
                                    stopSending();
                                }
                            });

                            function startSending() {
                                if (sendInterval) return;  // Zaten çalışıyorsa yeni interval açma

                                sendInterval = setInterval(() => {
                                    if (!isPaused) {

                                        sendNextMail();
                                    }
                                }, 15000); // 15 saniye
                            }

                            function stopSending() {
                                clearInterval(sendInterval);
                                sendInterval = null;
                            }

                            // Sıradaki maili gönder, inputtan kaldır, outputa ekle
                            async function sendNextMail() {
                                const mailDiv = document.querySelector('.main .list-area .input .data[data-email]');
                                // Input içindeki ilk mail div'i seç
                                if (!mailDiv) {
                                    console.log("Gönderilecek mail kalmadı.");
                                    stopSending();
                                    sendButton.classList.remove('pause');
                                    sendButton.classList.add('send');
                                    return;
                                }

                                const email = mailDiv.getAttribute('data-email');

                                try {
                                    const subjectText = title.value;
                                    const bodyText = text.value;

                                    console.log(text.value)

                                    const result = await sendMail(email, subjectText, bodyText);
                                    console.log("Gönderildi:", email, result);

                                    // Gönderilen mail input'tan kaldır
                                    mailDiv.remove();

                                    // sendedMails listesinden kaldır ve localStorage güncelle
                                    sendedMails = sendedMails.filter(m => m["e-mail"] !== email);
                                    localStorage.setItem('sendedMails', JSON.stringify(sendedMails));

                                    // Output div'e ekle
                                    addMailToOutput(email);

                                } catch (err) {
                                    mailDiv.classList.add('err')
                                    console.error("Gönderim hatası:", email, err);
                                }
                            }

                            function addMailToOutput(email) {
                                const mailDiv = document.createElement('div');
                                mailDiv.classList.add('data', 'sended');
                                mailDiv.setAttribute('data-email', email);
                                mailDiv.innerHTML = `<p>${email}</p>`;
                                contentOutput.appendChild(mailDiv);
                            }

                            async function sendMail(to, subject, content) {
                                const response = await fetch("/260822/webmailer/send", {
                                    method: "POST",
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ to, subject, content })
                                });
                                const data = await response.json();
                                return data;
                            }

                            function delay(ms) {
                                return new Promise(resolve => setTimeout(resolve, ms));
                            }
                        }
                        else {
                            const text = statuPage.querySelector('.text')
                            const textOutput = text.querySelector('p')

                            statuPage.classList.add('err')

                            text.style.opacity = 0;

                            setTimeout(() => {
                                textOutput.textContent = "Giriş Yapılamadı"
                                var error = document.createElement('span')
                                error.textContent = `Code: ${res.err.code}`
                                text.appendChild(error)

                                text.style.opacity = 1

                                statuPage.style.backgroundColor = 'rgb(81 23 23 / 60%)'
                            }, 400);
                        }
                    })
            }
            else {
                user.classList.add('err')

                setTimeout(() => {
                    user.classList.remove('err')
                }, 2000);
            }
        })
})

function populateInputFromSendedMails() {
    contentInput.innerHTML = "";
    sendedMails.forEach(email => {
        const data = document.createElement('div');
        data.classList.add('data');
        data.setAttribute('data-email', email['e-mail']);
        data.setAttribute('ondblclick', `removeData(this, this.getAttribute('data-email'), 'input')`);
        data.innerHTML = `<p>${email['e-mail']}</p>`;
        contentInput.appendChild(data);
    });

    sendedMails.length
}

reload.addEventListener('click', () => {
    // LocalStorage'dan sendedMails yükle veya örnek ekle
    if (localStorage.getItem('sendedMails') != undefined) {
        sendedMails = JSON.parse(localStorage.getItem('sendedMails'));
        populateInputFromSendedMails();
    }
})

function removeData(el, email, loc) {
    if (loc == "input") {
        sendedMails = sendedMails.filter(sendedMail => sendedMail['e-mail'] !== email);
        localStorage.setItem('sendedMails', JSON.stringify(sendedMails));
    }
    el.remove();
}