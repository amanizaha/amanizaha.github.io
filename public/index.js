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

const trials_FP = [
    // 4 varieties
    ["200cluster4.jpg", "190cluster4.jpg"],
    ["200cluster4.jpg", "180cluster4.jpg"],
    ["200cluster4.jpg", "170cluster4.jpg"],
    ["200cluster4.jpg", "150cluster4.jpg"],
    //
    ["100cluster4.jpg", "95cluster4.jpg"],
    ["100cluster4.jpg", "90cluster4.jpg"],
    ["100cluster4.jpg", "85cluster4.jpg"],
    //
    ["60cluster4.jpg", "60cluster4a.jpg"],
    ["60cluster4.jpg", "57cluster4.jpg"],
    ["60cluster4.jpg", "54cluster4.jpg"],
    ["60cluster4.jpg", "51cluster4.jpg"],
    // 4 varieties
    ["30cluster4.jpg", "29cluster4.jpg"],
    ["30cluster4.jpg", "28cluster4.jpg"],
    ["30cluster4.jpg", "27cluster4.jpg"],
    ["30cluster4.jpg", "26cluster4.jpg"],
    // RANDOM //
    ["200random4.jpg", "200random4a.jpg"],
    ["200random4.jpg", "190random4.jpg"],
    ["200random4.jpg", "180random4.jpg"],
    ["200random4.jpg", "170random4.jpg"],
    ["200random4.jpg", "150random4.jpg"],
    //
    ["100random.jpg", "100random_a.jpg"],
    ["100random.jpg", "95random.jpg"],
    ["100random.jpg", "90random.jpg"],
    ["100random.jpg", "85random.jpg"],
    //
    ["60random.jpg", "60random_a.jpg"],
    ["60random.jpg", "57random.jpg"],
    ["60random.jpg", "54random.jpg"],
    ["60random.jpg", "51random.jpg"],
    //
    ["30random.jpg", "30random_a.jpg"],
    ["30random.jpg", "29random.jpg"],
    ["30random.jpg", "28random.jpg"],
    ["30random.jpg", "27random.jpg"],
    ["30random.jpg", "26random.jpg"],
];

const trials_TD = [
    // RANDOM //
    ["200randomTD4.jpg", "200randomTD4a.jpg"],
    ["200randomTD4.jpg", "190randomTD4.jpg"],
    ["200randomTD4.jpg", "180randomTD4.jpg"],
    ["200randomTD4.jpg", "170randomTD4.jpg"],
    //
    ["100randomTD4.jpg", "95randomTD4.jpg"],
    ["100randomTD4.jpg", "90randomTD4.jpg"],
    //
    ["60randomTD4.jpg", "60randomTD4a.jpg"], // shape!
    ["60randomTD4.jpg", "57randomTD4.jpg"],
    ["60randomTD4.jpg", "54randomTD4.jpg"],
    ["60randomTD4.jpg", "51randomTD4.jpg"],
    //
    ["30randomTD4.jpg", "29randomTD4.jpg"], // shape!
    ["30randomTD4.jpg", "28randomTD4.jpg"],
    ["30randomTD4.jpg", "27randomTD4.jpg"],
];

//const trials = trials_TD_or.concat(trials_FP_or);
const trials = trials_TD

const trialOrder = [...trials.keys()];
shuffleArray(trialOrder);
const numTrials = trials.length;
let currentTrialIndex = -1;
const pageDelay = 0;
const trialDelay = 1000;
let startTime = new Date();
let results = []

setTimeout(() => $("#continueButton").prop("disabled", false), pageDelay);
$("#welcomeHeading").hide();
startTrials()

if (window.screen.height < 600 || window.screen.width < 1000) {
    $("#consentPage").hide();
    $("#screenSizeWarning").show();
    $("#screenSize").text(`Your current screen size is ${window.screen.width}x${window.screen.height}.`);
}

function continueButtonPressed() {
    $("#consentPage").hide();
    $("#instructionPage").show();
    $("#welcomeHeading").hide();
    setTimeout(() => $("#startButton").prop("disabled", false), pageDelay);
}

function startButtonPressed() {
    $("#instructionPage").hide();
    $("#referencePage").show();
    setTimeout(() => $("#trialStartButton").prop("disabled", false), pageDelay);
}

function trialStartButtonPressed() {
    $("#referencePage").hide();
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
    let potentialCountry = $("input[name=country]").val();

    if (Number.isInteger(potentialAge) && potentialCountry) {
        let data = {
            //gender: $("select[name=gender]").find(":selected").text(),
            age: potentialAge,
            education: $("select[name=education]").find(":selected").text(),
            //country: potentialCountry,
            experience: $("select[name=experience]").find(":selected").text(),
            vision: $("select[name=vision]").find(":selected").text(),
            //comments: $("textarea[name=comments]").val(),
            duration: 0.001 * (new Date() - startTime),
            trialResults: results
        }

        const newPostRef = ref.push();
        newPostRef.set({
            data: data
        });

        $("input[name=Data]").val(JSON.stringify(data));
        //$("#dataForm").submit();
        //$("#demographicsPage").hide();
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

