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

const trials_TD_or = [
    ["100rand50_alike.png", "100rand60_alike.png"],
    ["100rand50a_alike2.png", "100rand60_alike2.png"],
    ["100rand50a_alike.png", "100rand50_alike.png"], // same
    ["100cluster50a_alike.jpg", "100cluster60_alike.jpg"],
    ["rand35_alike.jpg", "rand40_alike.jpg"],
    ["rand50_alike.png", "rand60_alike.png"],
    ["rand50_alike.png", "rand50a_alike.png"], // same
    //["cluster35_alike.jpg", "cluster40_alike.jpg"],
    ["cluster50a_alike.jpg", "cluster60_alike.jpg"],
    ["cluster50a_alike.jpg", "cluster50_alike.jpg"], // same
];

const trials_FP_or = [
    // ["40rand35fp_alike.jpg", "40rand40fp_alike.jpg"],
    // ["40rand50fp_alike.jpg", "40rand60fp_alike.jpg"],
    // ["60cluster50fp_alike.jpg", "60cluster60fp_alike.jpg"],
    // ["40cluster50fp_alike.jpg", "40cluster60fp_alike.jpg"],
    // ["40cluster50fp_alike.jpg", "40cluster50afp_alike.jpg"], // same
    //
    // ["30cluster50fp_alike.jpg", "30cluster60fp_alike.jpg"],
    // ["30cluster30fp_alike.jpg", "30cluster40fp_alike.jpg"],
    // ["30cluster50fp_alike.jpg", "30cluster50afp_alike.jpg"], // same
    ["30rand50fp_alike.jpg", "30rand60fp_alike.jpg"],
    ["30rand30fp_alike.jpg", "30rand40fp_alike.jpg"],
    ["30rand50fp_alike.jpg", "30rand50afp_alike.jpg"], // same
    //
    // ["20cluster50fp_alike.jpg", "20cluster60fp_alike.jpg"],
    // ["20cluster30fp_alike.jpg", "20cluster40fp_alike.jpg"],
    // ["20cluster50fp_alike.jpg", "20cluster50afp_alike.jpg"], // same
    ["20rand50fp_alike.jpg", "20rand60fp_alike.jpg"],
    ["20rand35fp_alike.jpg", "20rand40fp_alike.jpg"],
    ["20rand50fp_alike.jpg", "20rand50afp_alike.jpg"], // same
    ["20rand50_dense.jpg", "20rand50a_dense.jpg", "20rand60_dense.jpg"],
    ["20rand50_dense_color.jpg", "20rand50a_dense_color.jpg", "20rand60_dense_color.jpg"]
];

const trials_FP_density = [
    ["200cluster50fp_alike.jpg", "170cluster50fp_alike.jpg"],
    ["100cluster50fp_alike.jpg", "80cluster50fp_alike.jpg"],
    ["60cluster50fp_alike.jpg", "40cluster50fp_alike.jpg"],
    ["40cluster50afp_alike.jpg", "30cluster50fp_alike.jpg"],
    ["200rand50fp_alike.jpg", "170rand50fp_alike.jpg"],
    ["100rand50fp_alike.jpg", "80rand50fp_alike.jpg"],
    ["60rand50fp_alike.jpg", "40rand50fp_alike.jpg"],
    ["40rand50fp_alike.jpg", "30rand50fp_alike.jpg"],
];

//const trials = trials_TD_or.concat(trials_FP_or);
const trials = trials_FP_density

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

