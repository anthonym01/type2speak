/*
Relies` on Web Speech API and capacitor
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- https://capacitorjs.com/
*/

const { App, Toast, Storage } = Capacitor.Plugins;

let config = {
    menuposition: true,//top or bottom
    favourites: [],
    spokenhistory:[]
}

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
    /* if(!isActive){
         window.speechSynthesis.pause()
     }*/

});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
})

(async function () {//get configuration
    let hold = await Storage.get({ key: 'config' })
    if (hold.value != null) { config = JSON.parse(hold.value) }
});


(async function () {//text input handling
    let wait = [];
    document.getElementById('textput').addEventListener('keypress', function (e) {
        console.log(e.key)

        for (let i in wait) { clearTimeout(wait.pop()) }

        let waitaction = setTimeout(() => { blurt(this.value) }, 1000)

        wait.push(waitaction)
    })

    document.getElementById('forceblurt').addEventListener('click', function () {
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
    config.spokenhistory.push(datum)

    document.getElementById('history').innerHTML = "";

    for (let i = config.spokenhistory.length - 1; i > -1; i--) {
        console.log('History elm ', i, config.spokenhistory[i])
    }

    Storage.set({ key: 'config', value: JSON.stringify(config) });
}