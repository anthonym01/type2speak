
/*
Relies` on Web Speech API and capacitor
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- https://capacitorjs.com/
*/

const { App, Toast, Storage } = Capacitor.Plugins;

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
    /* if(!isActive){
         window.speechSynthesis.pause()
     }*/

});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
});

let config = {
    menuposition: true,//top or bottom
    favourites: [],
    spokenhistory: []
};



window.addEventListener('load', async function () {// Startup point
    let hold = await Storage.get({ key: 'config' })
    if (hold.value != null) {
        config = JSON.parse(hold.value);
        histoize(false);
    }
});

let Text;

(async function () {//text input handling
    let wait = [];//stores key inputs for a short time

    document.getElementById('textput').addEventListener('keypress', function (e) {
        console.log(e.key)

        for (let i in wait) { clearTimeout(wait.pop()) }//remove old /waiting key inputs

        let waitaction = setTimeout(() => { blurt(this.value) }, 1000)

        wait.push(waitaction)
    })

    document.getElementById('speak_btn').addEventListener('click', function () {
        blurt(document.getElementById('textput').value)
    })
})();

async function blurt(spookvalue) {
    console.log("Blurt: ", spookvalue)

    let synth = window.speechSynthesis;
    //synth.pause()

    let utterThis = new SpeechSynthesisUtterance(spookvalue);

    //utterThis.pa
    synth.speak(utterThis);
    synth.addEventListener('voiceschanged', function () {
        console.log(' handle voice chage')
    })

    histoize(spookvalue);
}

async function histoize(datum) {
    if (datum != false) {
        config.spokenhistory.push(datum)
        Storage.set({ key: 'config', value: JSON.stringify(config) });
    }

    document.getElementById('history_content').innerHTML = "";

    for (let i = config.spokenhistory.length - 1; i > -1; i--) {
        console.log('History elm ', i, config.spokenhistory[i])
        making_of_history(i, config.spokenhistory[i])
    }

    function making_of_history(inxed, spokhistdatum) {
        let history_element = document.createElement('div')
        history_element.setAttribute('class', "history_element")
        history_element.innerHTML = spokhistdatum;
        document.getElementById('history').appendChild(history_element)
    }
} 