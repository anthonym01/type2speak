/*
Relies completely on Web Speech API and capacitor.js
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- https://capacitorjs.com/
*/

const { App, Camera, Toast, Storage } = Capacitor.Plugins;


App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
})

let wait = [];

let history = [];

let config = {

}

let favourites = []

window.addEventListener('load', async function () {

    (function () {//set history

    });
})

let config = {
    data: {//Loacal app data

    },

    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        Storage.set({ key: 'basicb', value: JSON.stringify(config.data) });
        console.table(config.data)
    },
    load: async function () {//Load the config file
        console.warn('Configuration is being loaded')
        let fromkey = await Storage.get({ key: 'basicb' })
        console.log('Loaded: ', fromkey)
        if (fromkey.value != null) {
            config.data = JSON.parse(fromkey.value);
            console.table(config.data)
        } else {
            console.warn('configuration loaded is empty')
        }

    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        Storage.remove({ key: 'basicb' });
        console.log('config deleted')
        console.table(config.data)
    }
}


document.getElementById('textput').addEventListener('keypress', function (e) {
    console.log(e.key)
    for (let i in wait) {
        clearTimeout(wait.pop())
    }
    let waitaction = setTimeout(() => {
        blurt(this.value)
    }, 1000)

    wait.push(waitaction)
})

document.getElementById('forceblurt').addEventListener('click', function () {
    blurt(document.getElementById('textput').value)
})

async function blurt(spookvalue) {
    console.log("Blurt: ", spookvalue)
    
    let synth = window.speechSynthesis;
    synth.pause()

    let utterThis = new SpeechSynthesisUtterance(spookvalue);

    utterThis.pa
    synth.speak(utterThis);
    synth.addEventListener('voiceschanged', function () {
        console.log(' handle voice chage')
    })

}
