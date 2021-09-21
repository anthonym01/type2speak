const { App, Camera, Toast, Storage } = Capacitor.Plugins;


App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
})

let wait = [];

window.addEventListener('load', async function () {

    try {
        await config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {

    }

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

document.getElementById('forceblurt').addEventListener('click',function(){
    blurt(document.getElementById('textput').value)
})

async function blurt (spookvalue) {
    console.log("Blurt: ",spookvalue)
    var synth = window.speechSynthesis;

    //e.preventDefault();

    var utterThis = new SpeechSynthesisUtterance(spookvalue);
    /*var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
        }
    }*/
    synth.speak(utterThis);


}
