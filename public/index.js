const firebaseConfig = {
    apiKey: "AIzaSyC9wQY6bCkr1mUgWxATGNnwSwOSs9JXkb4",
    authDomain: "thesis-11cc1.firebaseapp.com",
    projectId: "thesis-11cc1",
    storageBucket: "thesis-11cc1.appspot.com",
    messagingSenderId: "118723468214",
    appId: "1:118723468214:web:914ba2588d74c80a90bf17",
    measurementId: "G-RDE3Q38VC2",
    databaseURL: "https://thesis-11cc1-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
var ref = db.ref("/");

let tGuess = -1;
let tGuessSd = 2
let pThreshold = 0.82
let beta = 3.5;
let delta = 0.01
let gamma = 0.5;

const trials_TD = [
    ["TD200random35.jpg", "TD200random45.jpg"],
    ["TD200random50.jpg", "TD200random60.jpg"],
    // ["TD200random65.jpg", "TD200random75.jpg"],
    // ["TD100random35.jpg", "TD100random45.jpg"],
    // ["TD100random50.jpg", "TD100random60.jpg"],
    // ["TD100random65.jpg", "TD100random75.jpg"],
    // ["TD60random35.jpg", "TD60random45.jpg"],
    // ["TD60random50.jpg", "TD60random60.jpg"],
    // ["TD60random65.jpg", "TD60random75.jpg"],
    // ["TD30random33.jpg", "TD30random43.jpg"],
    // ["TD30random50.jpg", "TD30random60.jpg"],
    // // ["TD30random65.jpg", "TD30random75.jpg"],
    // //
    // ["TD200cluster35.jpg", "TD200cluster45.jpg"],
    // ["TD200cluster50.jpg", "TD200cluster60.jpg"],
    // ["TD200cluster65.jpg", "TD200cluster75.jpg"],
    // ["TD100cluster35.jpg", "TD100cluster45.jpg"],
    // ["TD100cluster50.jpg", "TD100cluster60.jpg"],
    // ["TD100cluster65.jpg", "TD100cluster75.jpg"],
    // ["TD200cluster50-unc.jpg", "TD200cluster60-unc.jpg"],
    // ["TD100cluster50-unc.jpg", "TD100cluster60-unc.jpg"],
];

const trials_F = [
    ["F200random35.jpg", "F200random45.jpg"],
    ["F200random50.jpg", "F200random60.jpg"],
    ["F200random65.jpg", "F200random75.jpg"],
    ["F100random35.jpg", "F100random45.jpg"],
    ["F100random50.jpg", "F100random60.jpg"],
    ["F100random65.jpg", "F100random75.jpg"],
    ["F60random35.jpg", "F60random45.jpg"],
    ["F60random50.jpg", "F60random60.jpg"],
    ["F60random65.jpg", "F60random75.jpg"],
    ["F30random33.jpg", "F30random43.jpg"],
    ["F30random50.jpg", "F30random60.jpg"],
    ["F30random65.jpg", "F30random75.jpg"],
    // Below are all uncorrelated.
    ["F200cluster35.jpg", "F200cluster45.jpg"],
    ["F200cluster50.jpg", "F200cluster60.jpg"],
    ["F200cluster65.jpg", "F200cluster75.jpg"],
    ["F100cluster35.jpg", "F100cluster45.jpg"],
    ["F100cluster50.jpg", "F100cluster60.jpg"],
    ["F100cluster65.jpg", "F100cluster75.jpg"]
];

//const trials = trials_TD.concat(trials_FP);
const trials = trials_TD

const trialOrder = [...trials.keys()];
shuffleArray(trialOrder);
const numTrials = trials.length;
let currentTrialIndex = -1;
const pageDelay = 0;
const trialDelay = 1000;
let startTime = new Date();
let results = []

myquest = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma);

setTimeout(() => $("#continueButton").prop("disabled", false), pageDelay);
$("#welcomeHeading").show();
$("#consentPage").show();
//startTrials()

if (window.screen.height < 600 || window.screen.width < 1000) {
    $("#consentPage").hide();
    $("#screenSizeWarning").show();
    $("#screenSize").text(`Your current screen size is ${window.screen.width}x${window.screen.height}.`);
}

function continueButtonPressed() {
    $("#consentPage").hide();
    $("#instructionPage").show();
    $("#welcomeHeading").hide();
    setTimeout(() => $("#trialStartButton").prop("disabled", false), pageDelay);
}

function startButtonPressed() {
    $("#instructionPage").hide();
    $("#referencePage").show();
    setTimeout(() => $("#trialStartButton").prop("disabled", false), pageDelay);
}

function trialStartButtonPressed() {
    //$("#referencePage").hide();
    $("#instructionPage").hide();
    startTrials();
}

function startTrials() {
    $("#trialPage").show();
    setButtonEnableTimer("realismButton", trialDelay);
    nextTrial();
}

function realismSubmit(button) {
    setButtonEnableTimer("realismButton", trialDelay);
    results.push(getTrialResult(button));
    nextTrial();
}

function getTrialResult(button) {
    let imageString = "";
    //let trialLevel = $("#refImage").attr("src");
    if (button === "Yes") {
        //imageString = $("#leftImage").attr("src");
        imageString = 'yes'
    }
    else {
        //imageString = $("#rightImage").attr("src");
        imageString = 'no'
    }
    console.log($("#leftImage").attr("src"), $("#rightImage").attr("src"), imageString)
    return {
        trialNum: trialOrder[currentTrialIndex],
        trialLeft: $("#leftImage").attr("src"),
        trialRight: $("#rightImage").attr("src"),
        answer: imageString
        //answer: imageString.substring(4, imageString.length - 4),
    }
}

function nextTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= numTrials) {
        console.log(0.001 * (new Date() - startTime))
        finishTrials();
    } else {
        $("#trialNumber").text(`Trial ${currentTrialIndex + 1}/${numTrials}`)
        //$("#refImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][0]}`);
        if (Math.random() < 0.5) {
            $("#leftImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][0]}`);
            $("#rightImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][1]}`);
        } else {
            $("#leftImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][1]}`);
            $("#rightImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][0]}`);
        }
    }
}

function finishTrials() {
    $("#trialPage").hide();
    $("#demographicsPage").show();
}

function verifyAndGatherData() {
    let potentialAge = parseInt($("input[name=age]").val(), 10);
    //let potentialCountry = $("input[name=country]").val();

    if (Number.isInteger(potentialAge)) {
        let data = {
            gender: $("select[name=gender]").find(":selected").text(),
            age: potentialAge,
            education: $("select[name=education]").find(":selected").text(),
            experience: $("select[name=experience]").find(":selected").text(),
            vision: $("select[name=vision]").find(":selected").text(),
            comments: $("textarea[name=comments]").val(),
            duration: 0.001 * (new Date() - startTime),
            trialResults: results
        }

        // const newPostRef = ref.push();
        // newPostRef.set({
        //     data: data
        // });

        $("input[name=Data]").val(JSON.stringify(data));
        $("#dataForm").submit();
        $("#demographicsPage").hide();
        $("#endPage").show();

    } else {
        alert("Incorrect data, correct any errors and try again.");
    }
}

function setButtonEnableTimer(className, delay) {
    $(`.${className}`).prop("disabled", true);
    setTimeout(() => $(`.${className}`).prop("disabled", false), delay);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

