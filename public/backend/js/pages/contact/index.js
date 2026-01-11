const postMailSubmit = document.getElementById('submit')

postMailSubmit.addEventListener('click', () => {
    var email = document.getElementById('email');
    var tel = document.getElementById('tel');
    var name = document.getElementById('name');
    var message = document.getElementById('message');
    var policyBox = document.getElementById('policy')
    var counter = 0;

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateTel = (tel) => {
        return String(tel)
            .toLowerCase()
            .match("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
    };

    // Email data
    if (validateEmail(email.value) != null) {
        email.classList.remove("error");
        counter += 1;
    }
    else {
        email.classList.add("error");
        (counter < 0) ? counter -= 1 : counter = counter;
    }

    // Tel data
    if (validateTel(tel.value) != null) {
        tel.classList.remove("error");
        counter += 1;
    }
    else {
        tel.classList.add("error");
        (counter < 0) ? counter -= 1 : counter = counter;
    }

    // Name data
    if (name.value) {
        name.classList.remove("error");
        counter += 1;
    }
    else {
        name.classList.add("error");
        (counter < 0) ? counter -= 1 : counter = counter;
    }

    // Message data
    if (message.value) {
        message.classList.remove("error");
        counter += 1;
    }
    else {
        message.classList.add("error");
        (counter < 0) ? counter -= 1 : counter = counter;
    }

    if (policyBox.checked == false) {
        policyBox.parentElement.parentElement.classList.add("error")
    }
    else {
        policyBox.parentElement.parentElement.classList.remove("error")
    }

    if (counter == 4 && policyBox.checked) {
        if (postMailSubmit.classList.contains('loading') == false && postMailSubmit.classList.contains('completed') == false && postMailSubmit.classList.contains('error') == false) {
            const routeMail = document.querySelector('.sff-post-mail .post')
            const sendMail = async () => {
                postMailSubmit.classList.add('loading');
                let response = await fetch('http://localhost:4000/api/sendMail', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "secure": `a0ecbcea0d7dfe87cf1d86d3df1f7e6b:1e493554b3d77d8d79c58f0443a6d1c8375be7bc6410fbbffe8ce646765fbfd79a7012c6fd55fa01438a4dd735c19999`
                    },
                    body: JSON.stringify({
                        "route-mail": routeMail.getAttribute('route-mail'),
                        "mail": email.value,
                        "tel": tel.value,
                        "company/name": name.value,
                        "message": message.value
                    })
                })

                const data = await response.json();
                return data;
            }

            sendMail().then(response => {
                console.log(response)
                postMailSubmit.classList.remove('loading');
                if (response.statu == 404) {
                    postMailSubmit.classList.add('error');
                }
                else if (response.statu == 200) {
                    (postMailSubmit.classList.contains('error')) ? postMailSubmit.classList.remove('error') : null;
                    postMailSubmit.classList.add('completed');
                    counter == 0;
                    email.value = "";
                    tel.value = "";
                    name.value = "";
                    message.value = "";
                    setTimeout(() => {
                        postMailSubmit.classList.remove('completed');
                    }, 4000);
                }
            })
        }
    }
})