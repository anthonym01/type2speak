
/*
Relies` on Web Speech API and capacitor
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- https://capacitorjs.com/
*/

const textput = document.getElementById('textput');
const favourites_content = document.getElementById('favourites_content')
const history_content = document.getElementById('history_content')

const { App, Toast, Storage } = Capacitor.Plugins;

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
    /* if(!isActive){
         window.speechSynthesis.pause()
     }*/

});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed');
});

let config = {
    menuposition: true,//top or bottom
    favourites: [],
    spokenhistory: []
};

window.addEventListener('load', async function () {// Startup point
    let hold = await Storage.get({ key: 'config' });
    if (hold.value != null) {
        config = JSON.parse(hold.value);
        histoize(false);
        favouritize(false);
    }
});

(async function () {//text input handling
    let wait = [];//stores key inputs for a short time

    textput.addEventListener('keypress', function (e) {
        console.log(e.key);

        for (let i in wait) { clearTimeout(wait.pop()); }//remove old /waiting key inputs

        let waitaction = setTimeout(() => { blurt(this.value) }, 1000);//wait 1 second before speaking

        wait.push(waitaction);//save incase inputs are received after this timer is set
    })

    document.getElementById('speak_btn').addEventListener('click', function () { blurt(textput.value) });
})();

async function blurt(spookvalue) {// Speak a string value
    console.log("Blurt: ", spookvalue);

    let synth = window.speechSynthesis;
    //synth.pause()

    let utterThis = new SpeechSynthesisUtterance(spookvalue);

    //utterThis.pa
    synth.speak(utterThis);
    synth.addEventListener('voiceschanged', function () {
        console.log(' handle voice chage');
    })

    histoize(spookvalue);
}

async function histoize(datum) {
    /*
        Handle history and certain favourite interactions
    */

    if (datum != false) {//alows displaying history on first startup
        config.spokenhistory.push(datum);
        Storage.set({ key: 'config', value: JSON.stringify(config) });
    }

    history_content.innerHTML = "";


    for (let i = config.spokenhistory.length - 1; i > -1; i--) {
        console.log('History elm ', i, config.spokenhistory[i]);
        making_of_history(i, config.spokenhistory[i]);
    }

    function making_of_history(inxed, spokhistdatum) {
        let history_element = document.createElement('div');
        history_element.setAttribute('class', "history_element");
        //history_element.innerHTML = spokhistdatum;

        let element_title = document.createElement('div');
        element_title.setAttribute('class', "element_title");
        element_title.innerHTML = spokhistdatum;
        element_title.title = "Speak " + spokhistdatum;
        history_element.appendChild(element_title);

        let element_controls = document.createElement('div');
        element_controls.setAttribute('class', "element_controls");
        history_element.appendChild(element_controls);

        let add_to_favourite_trigger = document.createElement('div');
        add_to_favourite_trigger.setAttribute('class', "add_to_favourite");
        add_to_favourite_trigger.title = `Add "${spokhistdatum}" to favourites`
        element_controls.appendChild(add_to_favourite_trigger);

        let remove_element_trigger = document.createElement('div');
        remove_element_trigger.setAttribute('class', "remove_element");
        remove_element_trigger.title = "remove";
        element_controls.appendChild(remove_element_trigger);

    history_content.appendChild(history_element);

        element_title.addEventListener('click', function (event) {//copy old history
            console.log('Clicked titile: ', inxed);
            textput.value = spokhistdatum;
            blurt(spokhistdatum);
        });

        remove_element_trigger.addEventListener('click', function (event) {//remove only this from history
            console.log('Clicked remove history element: ', inxed);
            config.spokenhistory.splice(inxed, 1);//remove
            Storage.set({ key: 'config', value: JSON.stringify(config) });//save
            histoize(false);
        });

        add_to_favourite_trigger.addEventListener('click', function (event) {
            console.log('Clicked add to favourite: ', inxed);
            favouritize(config.spokenhistory[inxed]);
        });
    }
}

async function favouritize(newfavourite) {

    /* Create favourites via strings and handle favourite actions */
    if (newfavourite != false) {
        console.log('Create favourite: ', newfavourite)

        //remove possible old duplicates
        let duplicate = false;
        for (i in config.favourites) {
            if (config.favourites[i] == newfavourite) {
                duplicate = true;
                config.favourites.splice(i, 1);
                break;
            }
        }

        config.favourites.push(newfavourite)
        Storage.set({ key: 'config', value: JSON.stringify(config) });//save
    }

    if (config.favourites.length > 0) {//pre-existing favourites, Display saved favourites
        favourites_content.innerHTML = "";

        for (let i = config.favourites.length - 1; i > -1; i--) {
            console.log('favourite elm ', i, config.favourites[i])
            favouritinator(i, config.favourites[i])
        }
        document.getElementById("mid-space").classList = "mid-space-with-favourites"
    } else {
        document.getElementById("mid-space").classList = "mid-space"
    }

    function favouritinator(inxed, favouritestring) {
        let history_element = document.createElement('div');
        history_element.setAttribute('class', "history_element");
        //history_element.innerHTML = spokhistdatum;

        let element_title = document.createElement('div');
        element_title.setAttribute('class', "element_title");
        element_title.innerHTML = favouritestring;
        element_title.title = "Speak " + favouritestring;

        history_element.appendChild(element_title);

        let element_controls = document.createElement('div');
        element_controls.setAttribute('class', "element_controls");
        element_controls.title = "Remove";
        history_element.appendChild(element_controls);

        let remove_element_trigger = document.createElement('div');
        remove_element_trigger.setAttribute('class', "remove_element");
        element_controls.appendChild(remove_element_trigger);
        

        favourites_content.appendChild(history_element);

        element_title.addEventListener('click', function (event) {//copy old history
            console.log('Clicked titile: ', inxed);
            textput.value = favouritestring;
            blurt(favouritestring);
        });

        remove_element_trigger.addEventListener('click', function (event) {//remove only this from history
            console.log('Clicked remove avourite element: ', inxed);
            config.favourites.splice(inxed, 1);//remove
            Storage.set({ key: 'config', value: JSON.stringify(config) });//save
            favouritize(false);
        });
    }
}