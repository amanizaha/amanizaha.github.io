
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

animate = 2
const chart_width = 500
const chart_height = 400

// for (let i = 0; i < 7; i++) {
//     var tTest = jsQUEST.QuestMode(q).mode;
//     if (10**tTest > 0.5) {
//         tTest = Math.log10(0.45)
//     }
//     let response=jsQUEST.QuestSimulate(q,tTest,tActual)
//     q = jsQUEST.QuestUpdate(q, tTest, response); 
//     console.log(tTest, 10**tTest, response)
// }
// console.log(10**jsQUEST.QuestMode(q).mode)

// Available intensities (exc. base intensity).
const trials_T700R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T500R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T300R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T200R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];

const trials_T700C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T500C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T300C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_T200C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];

// const trials_F700R = [52, 55, 56, 60, 62, 64, 65, 70, 75, 80, 85, 90];
const trials_F500R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_F300R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_F200R = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];

// const trials_F700C = [52, 55, 56, 60, 62, 64, 65, 70, 75, 80, 85, 90];
const trials_F500C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_F300C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];
const trials_F200C = [52, 54, 55, 56, 60, 62, 64, 65, 68, 70, 75, 80, 85, 90];

// const trials_Tc280R = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc200R = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc140R = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc100R = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];

// //55 seems to be missing
// const trials_Tc280C = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc200C = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc140C = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];
// const trials_Tc100C = [55, 56, 60, 62, 65, 67, 70, 72, 75, 77, 80, 82, 85, 87, 90];

// git push --mirror git@github.com:amanizaha/amanizaha.github.io.git

// const trials = [trials_T700R, trials_T500R, trials_T300R, trials_T200R, trials_T700C, trials_T500C, trials_T300C, trials_T200C, trials_F500R, trials_F300R, trials_F200R, trials_F500C, trials_F300C, trials_F200C];
// const conditions = ["T700R", "T500R", "T300R", "T200R", "T700C", "T500C", "T300C", "T200C", "F500R", "F300R", "F200R", "F500C", "F300C", "F200C"]

const trials = [trials_T300R];
const conditions = ["T300R"];

if(trials.length != conditions.length) { throw new Error('Missing trials!'); }

//const trialOrder = [...trials.keys()];
//shuffleArray(trialOrder);
let rand = Math.floor(Math.random() * trials.length)
condition = trials[rand];
conditionStr = conditions[rand];
// console.log(conditionStr)

const trialsPerBlock = 1;
var k = trialsPerBlock;
const numTrials = trials.length * k;
let currentTrialIndex = -1;
const pageDelay = 0;
const trialDelay = 1000;
let startTime = new Date();
var results = []    // per condition
var allResults = {}
var correctAnswers = 0;

// tGuess = 20% change threshold, i.e. from 50:50 -> 70:30.
const tGuess = Math.log10(0.2); // Estimate of intensity expected to result in a response rate of pThreshold.
const tGuessSd = 1 // 
const pThreshold = 0.75
const beta = 3.5; // steepness of curve
const delta = 0.01 // fraction of blindly pressed trials
const gamma = 0.5; // The probability of a success (a response of YES) at zero intensity.
let tActual = 1;

var timer = '';
let wrongRight = ['wrong', 'right'];
var q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.001, 2);
var tTest = jsQUEST.QuestMode(q).mode;
var currentIntensity = tTest
var prev = ""
var randord = 0;
var it = 0;

// for (let i=0; i<conditions.length; i++){
//     let con = conditions[i]
//     let trialZ = trials[i]

//     for (let j=0; j<trialZ.length; j++){
//         console.log('<img style="display: none;" class="preloadImage" src="img/' + con + trialZ[j] +  '.jpg">')
//     }
//     console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50" +  '.jpg">')
//     console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50a" +  '.jpg">')
//     console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50b" +  '.jpg">')
//     console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50c" +  '.jpg">')
// }

// FOR CALCULATING THRESHOLD FROM MULTIPLE PARTICIPANTS' RESPONSE
// var thing = ""

// fetch('json/p1.json')
//     .then((response) => response.json())
//     .then((json) => hey(json))
//     .then(() => calc());

// function hey(obj){
//     thing = obj
// }

// function compare( a, b ) {
//     if ( a.threshold < b.threshold ){
//       return -1;
//     }
//     if ( a.threshold > b.threshold ){
//       return 1;
//     }
//     return 0;
//   }

// function calc() {
//     let nums = []
//     let ok = ""
//     for (const [key, value] of Object.entries(thing)) {
//         console.log(value.trialResults["T100C"])
//     }


//     for (let i=0; i<conditions.length; i++){ // e.g. T100R
//         var x = jsQUEST.QuestCreate(Math.log10(0.2), tGuessSd, pThreshold, beta, delta, gamma, 0.01, 3);
//         let con = conditions[i]
//         let allsubj = []
//         for (const [key, value] of Object.entries(thing)) {  //gather all responses
//             let subj = value.trialResults[con];
//             ok = subj
//             allsubj.push(subj)
  
//             if(subj){
//                 for (let j = 0; j < 7; j++) {   // iter through all responses
//                     let response = subj[j].answer == "right" ? 1 : 0;
//                     let test = Math.log10( parseFloat(subj[j].intensity) ) 
//                     x = jsQUEST.QuestUpdate(x, test, response); 
//                 }
//             }
//         }
//         nums.push({con: con, threshold:10**jsQUEST.QuestMode(x).mode, sd: jsQUEST.QuestSd(x), trials: ok})
//     }
    
//     nums.sort( compare );
//     console.log(nums)
// }

setTimeout(() => $("#continueButton").prop("disabled", false), pageDelay);
$("#welcomeHeading").show();
$("#consentPage").show();

if (window.screen.height < 600 || window.screen.width < 1000) {
    $("#consentPage").hide();
    $("#screenSizeWarning").show();
    $("#screenSize").text(`Your current screen size is ${window.screen.width}x${window.screen.height}.`);
}

function continueButtonPressed() {
    $("#consentPage").hide();
    $("#instructionPage").show();
    $("#welcomeHeading").hide();
    setTimeout(() => $("#refStartButton").prop("disabled", false), pageDelay);
}

function startButtonPressed() {
    $("#instructionPage").hide();
    $("#referencePage").show();
    $("#trialStartButton").hide()
    //setTimeout(() => $("#trialStartButton").prop("disabled", false), pageDelay);
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

function shuffleTrial(currentStimuli, same, order){
    let suffixes = ["a", "b", "c"]
    let suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    while (suffix == prev) {
        suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    }
    prev = suffix
    let newSame = same + suffix

    if (order<0.5) {
        $("#leftImage").attr("src", `img/${currentStimuli}.jpg`);
        $("#rightImage").attr("src", `img/${newSame}.jpg`);
        it = 1;
    } else {
        $("#leftImage").attr("src", `img/${newSame}.jpg`);
        $("#rightImage").attr("src", `img/${currentStimuli}.jpg`);
        it = 0;
    }
}


function testSubmit(button) {
    let ans = ""
    $("#testHeading").hide()
    
    if (button === "Left") {
        ans = 0
        $("#testCorrect").hide()
        $("#testIncorrect").show()
        $("#leftImageContainer").css({"background-color": "red"})
        $("#testIncorrect").text(`Incorrect. The left image has a different ratio of each tree, compared to the reference image.`)
    }
    else {
        ans = 1
        $("#testIncorrect").hide()
        $("#testCorrect").show()
        $("#rightImageContainer").css({"background-color": "green"})
        $("#testCorrect").text(`Correct! The right image has the same ratio of each tree as the reference image.`)
    }

    $("#trialStartButton").show()
    $("#testButton").prop("disabled", true)
}

function realismSubmit(button) {
    setButtonEnableTimer("realismButton", trialDelay);
    clearInterval(timer); // button is clicked -> stop timer

    results.push(getTrialResult(button));
    tTest = jsQUEST.QuestMode(q).mode; // what's the next suggested intensity?
    // console.log("SUGGESTED:", 10**tTest)

    if (k == 0) { // current CONDITION done
        results.push({'mode': 10**jsQUEST.QuestMode(q).mode}) // FOR PILOT TEST
        let time = 0.001 * (new Date() - startTime)
        results.push({'block_duration': time})
        // console.log("FINAL MODE:",10**jsQUEST.QuestMode(q).mode)
        allResults[conditionStr] = results; // add all results for 'completed' condition
        results = []
        k = trialsPerBlock;

        let ind = trials.indexOf(condition); // removes previous condition from trials.
        trials.splice(ind, 1);
        ind = conditions.indexOf(conditionStr); // removes previous condition NAME from trials.
        conditions.splice(ind, 1);

        let rand = Math.floor(Math.random() * trials.length)
        condition = trials[rand];                   // picks next block of trials to run
        conditionStr = conditions[rand];
        // console.log(conditionStr)    

        // Need to reset all values for the next 7 Quest trials
        q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.01, 3);
        tTest = jsQUEST.QuestMode(q).mode;
        currentIntensity = tTest
        prev = ""
        nextTrial();
    }
    else { nextTrial() }
}

// Checks if chosen stimuli is correct or not.
function correctAnswer(chosen, ref) {
    let char = chosen.slice(-1)
    if(char.toLowerCase() !== char.toUpperCase()) { // last char is a letter -> CORRECT answer.
        // console.log("RIGHT");
        return 1;
    }
    else { return 0; }
}

function getTrialResult(button) {
    let imageString = "";
    let trialLevel = $("#refImage").attr("src");
    if (button === "Left") {
        imageString = $("#leftImage").attr("src");
    }
    else {
        imageString = $("#rightImage").attr("src");
    }

    let response = correctAnswer(imageString.substring(0, imageString.length - 4), trialLevel.substring(0, trialLevel.length - 4))
    q = jsQUEST.QuestUpdate(q, currentIntensity, response); //  used intensity may not be same as tTest.
    k = k-1;
    correctAnswers += response;

    return {
        trialNum: currentTrialIndex,
        trialLeft: $("#leftImage").attr("src"),
        trialRight: $("#rightImage").attr("src"),
        choice: imageString,
        answer: wrongRight[response],
        intensity: 10**currentIntensity // NOT in log!
    }
}

function getClosestIntensity(suggested){
    let goal = 50 + Math.round((10**suggested)*100); // e.g. 61
    const closest = condition.reduce((prev, curr) => {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    // remove found value
    const ind = condition.indexOf(closest);
    condition.splice(ind, 1);

    // returns e.g. 60
    let nextIntensity = conditionStr + closest.toString(); // "T200R60"
    currentIntensity = Math.log10((closest - 50)/100)
    // console.log("closest:", closest, "log", 10**currentIntensity)
    return nextIntensity
}

function nextTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= numTrials) {
        if(conditions.length != allResults.length)
            results.push({'mode': 10**jsQUEST.QuestMode(q).mode}) // FOR PILOT TEST
            allResults[conditionStr] = results; // make sure results for last condition added
        finishTrials();
    }
    else {
        let suffixes = ["a", "b"]
        let suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        while (suffix == prev) {
            suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        }
        prev = suffix

        let same = conditionStr + "50" + suffix
        let currentStimuli = getClosestIntensity(tTest);

        $("#refImage").attr("src", `img/${conditionStr + "50"}.jpg`);
        $("#trialNumber").text(`Trial ${currentTrialIndex + 1}/${numTrials}`)
        $("#trialsCorrect").text(`Correct ${correctAnswers}`)

        randord = Math.random()
        if (randord < 0.5) {
            $("#leftImage").attr("src", `img/${same}.jpg`);
            $("#rightImage").attr("src", `img/${currentStimuli}.jpg`);
        } else {
            $("#leftImage").attr("src", `img/${currentStimuli}.jpg`);
            $("#rightImage").attr("src", `img/${same}.jpg`);
        }

        timer = setInterval(() => {shuffleTrial(currentStimuli, conditionStr+"50", randord)}, 20000)
    }
}

function finishTrials() {
    $("#trialPage").hide();
    $("#demographicsPage").show();
    const t = jsQUEST.QuestMean(q);
    const sd = jsQUEST.QuestSd(q);

    // console.log(`Final threshold estimate (mean+-sd) is ${10**t} +- ${sd}`)
    // console.log(`Mode threshold estimate is ${10**jsQUEST.QuestMode(q).mode}, and the pdf is ${jsQUEST.QuestMode(q).pdf}`)
    // console.log(`You set the true threshold to ${tActual}`)
}

function verifyAndGatherData() {
    let potentialAge = parseInt($("input[name=age]").val(), 10);

    if (Number.isInteger(potentialAge)) {
        let data = {
            gender: $("select[name=gender]").find(":selected").text(),
            age: potentialAge,
            criteria: $("select[name=criteria]").find(":selected").text(),
            location: $("select[name=location]").find(":selected").text(),
            device: $("select[name=device]").find(":selected").text(),
            education: $("select[name=education]").find(":selected").text(),
            education: $("select[name=program]").find(":selected").text(),
            experience: $("select[name=experience]").find(":selected").text(),
            vision: $("select[name=vision]").find(":selected").text(),
            comments: $("textarea[name=comments]").val(),
            duration: 0.001 * (new Date() - startTime),
            trialResults: allResults
        }
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




