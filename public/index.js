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

const trials = [
    // // TD 200 RANDOM
    // ["rand35.png", "rand35a.png", "rand40.png"],
    // ["rand50.png", "rand50a.png", "rand60.png"],
    // // TD 100 RANDOM
    // ["100rand35.png", "100rand35a.png", "100rand40.png"],
    // ["100rand50.png", "100rand50a.png", "100rand60.png"],
    // ["100rand60.png", "100rand60a.png", "100rand70.png"],
    //     // spaced
    // ["100rand35_spaced.png", "100rand35a_spaced.png", "100rand40_spaced.png"],
    // ["100rand50_spaced.png", "100rand50a_spaced.png", "100rand60_spaced.png"],
    // ["100rand60_spaced.png", "100rand60a_spaced.png", "100rand70_spaced.png"],
    // // TD 200 CLUSTERED
    // ["cluster35.png", "cluster35a.png", "cluster40.png"],
    // ["cluster50.png", "cluster50a.png", "cluster60.png"],
    // // TD 100 CLUSTERED
    // ["100cluster35.png", "100cluster35a.png", "100cluster40.png"],
    // ["100cluster50.png", "100cluster50a.png", "100cluster60.png"],
    // // FP RANDOM
    // //["100rand50fp.png", "100rand50cfp.png", "90rand50fp.png"],
    // ["60rand50fp.png", "60rand50afp.png", "60rand60fp.png"],
    // // FP CLUSTERED
    // //["100cluster50fp", "100cluster50afp", "90cluster50fp"],
    // ["60cluster35fp.png", "60cluster35afp.png", "60cluster40fp.png"],
    // ["40cluster35fp.png", "40cluster35afp.png", "40cluster40fp.png"],
    // ALIKE
    ["100rand50_alike.png", "100rand50a_alike.png", "100rand60_alike.png"],
    ["100rand50_alike2.png", "100rand50a_alike2.png", "100rand60_alike2.png"],
    ["100rand50_spaced_alike.png", "100rand50a_spaced_alike.png", "100rand60_spaced_alike.png"],
    ["rand50_alike.png", "rand50a_alike.png", "rand60_alike.png"],
        //
    ["cluster50_alike.jpg", "cluster50a_alike.jpg", "cluster60_alike.jpg"],
    ["100cluster50_alike.jpg", "100cluster50a_alike.jpg", "100cluster60_alike.jpg"],
        // FP
    ["60cluster50fp_alike.jpg", "60cluster50afp_alike.jpg", "60cluster60fp_alike.jpg"],
    ["40cluster50fp_alike.jpg", "40cluster50afp_alike.jpg", "40cluster60fp_alike.jpg"],
    ["60cluster50fp_alike.jpg", "60cluster50afp_alike.jpg", "40cluster50fp_alike.jpg"],
];
const trialOrder = [...trials.keys()];
//shuffleArray(trialOrder);
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
    let trialLevel = $("#refImage").attr("src");
    if (button === "Left") {
        imageString = $("#leftImage").attr("src");
    } else if (button === "Unsure") {
        imageString = "None";
    }
    else {
        imageString = $("#rightImage").attr("src");
    }
    console.log(imageString, "- ref:", $("#refImage").attr("src"))
    return {
        trialNum: trialOrder[currentTrialIndex],
        trialLevel: trialLevel,
        selectedImage: imageString.substring(4, imageString.length - 4),
        selectedButton: button
    }
}

function nextTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= numTrials) {
        finishTrials();
    } else {
        $("#trialNumber").text(`Trial ${currentTrialIndex + 1}`)
        $("#refImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][0]}`);
        if (Math.random() < 0.5) {
            $("#leftImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][1]}`);
            $("#rightImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][2]}`);
        } else {
            $("#leftImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][2]}`);
            $("#rightImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][1]}`);
        }
    }
}

function finishTrials() {
    $("#trialPage").hide();
    $("#demographicsPage").show();
}

function verifyAndGatherData() {
    let potentialAge  = parseInt($("input[name=age]").val(), 10);
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

