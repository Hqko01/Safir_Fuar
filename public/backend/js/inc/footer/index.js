function footerStageNameEdit() {
    const contentStages = document.querySelectorAll('.sff-footer .footer-content .content-stage')

    contentStages.forEach(stage => {
        if (stage.querySelector('.options') != undefined) {
            var name = stage.querySelector('.stage-name')
            var options = stage.querySelector('.options')
            var optionsWidth = window.getComputedStyle(options, false).getPropertyValue("width")
            name.style.width = optionsWidth
        }
    })

} footerStageNameEdit()

function signatureDate() {
    const date = document.querySelector('.date')
    const nowDate = new Date();
    date.children[0].textContent = nowDate.getFullYear();
    
} signatureDate()