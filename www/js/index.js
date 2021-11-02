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
})




let favourites = []

let config = {

}

window.addEventListener('load', async function () {

    (async function () {//set history
        let hold = await Storage.get({ key: 'spokenhistory' })
        if (hold.value != null) {
            spokenhistory = JSON.parse(hold.value)
        }
    });
});

(function () {//text input handling
    let wait = [];
    document.getElementById('textput').addEventListener('keypress', function (e) {
        console.log(e.key)

        for (let i in wait) { clearTimeout(wait.pop()) }

        let waitaction = setTimeout(() => { blurt(this.value) }, 1000)

        wait.push(waitaction)
    })
})();

document.getElementById('forceblurt').addEventListener('click', function () {
    blurt(document.getElementById('textput').value)
})

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

let spokenhistory = [];

async function histoize(datum) {
    spokenhistory.push(datum)

    document.getElementById('history').innerHTML = "";

    for (let i = spokenhistory.length - 1; i > -1; i--) {
        console.log('History elm ', i, spokenhistory[i])
    }

    Storage.set({ key: 'spokenhistory', value: JSON.stringify(spokenhistory) });
}