document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('select')
    const text = document.getElementById('textbox')
    const gifBod = document.getElementById('gifbody')
    const num = document.getElementById('numLimit')
    const buttons = document.getElementsByClassName('button')
    const boxes = document.querySelectorAll('input')

    Array.from(boxes).map(function(box){
        box.addEventListener('click',function(event){
            box.innerHTML = ""
        })
    })

    Array.from(buttons).map(function (btns) {
        btns.addEventListener('click', function (event) {
            let tVal = text.value
            let numVal = num.value
            let option = select.options[select.selectedIndex].text
                fetch(`https://api.giphy.com/v1/gifs/search?api_key=XcRVCEDm97mqsnXmrNsRZGdrZACwiY1C&q=${tVal}&limit=${numVal}&offset=0&rating=${option}&lang=en`)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    for(var x = 0; x < data.data.length; x++){
                        let display = document.createElement('div')
                        display.classList.add('displayGif')
                        display.style.backgroundImage = `url(${data.data[x].images.original.url})`
                        display.style.backgroundRepeat = "no-repeat"
                        display.style.backgroundSize = "100% 100%"
                        gifBod.appendChild(display)
                    }
                })
        })
    })
})


//https://api.giphy.com/v1/gifs/search?api_key=XcRVCEDm97mqsnXmrNsRZGdrZACwiY1C&q=lebron&limit=25&offset=0&rating=PG&lang=en