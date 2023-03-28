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
const trials_T280R = [55, 60, 65, 70, 75, 80, 85, 90];
const trials_T200R = [55, 56, 60, 62, 65, 67, 70, 72, 75, 78, 80, 90];
const trials_T140R = [52, 55, 56, 60, 62, 65, 67, 70, 72, 75, 80, 85, 90];
const trials_T100R = [52, 55, 56, 57, 60, 62, 64, 65, 70, 75, 80, 85, 90];

const trials_T280C = [55, 60, 65, 70, 75, 80, 85, 90];
const trials_T200C = [55, 60, 65, 67, 70, 72, 75, 80,85];
const trials_T140C = [52, 55, 60, 62, 65, 67, 70, 72, 75, 80, 90];
const trials_T100C = [52, 55, 56, 57, 60, 62, 64, 65, 67, 70, 80, 85];

const trials_F280R = [60, 65, 70, 75, 80, 85, 90];
const trials_F200R = [55, 60, 65, 67, 70, 72, 75, 78, 80, 90];
const trials_F140R = [55, 60, 65, 67, 70, 72, 75, 80, 85, 90];
const trials_F100R = [55, 56, 60, 62, 65, 67, 70, 75, 80, 85, 90];

const trials_F280C = [55, 60, 65, 70, 75, 80, 85, 90];
const trials_F200C = [55, 60, 62, 65, 70, 72, 75, 80, 90];
const trials_F140C = [55, 56, 60, 62, 65, 67, 70, 72, 75, 80, 90];
const trials_F100C = [52, 55, 56, 60, 62, 64, 65, 67, 70, 75, 80, 90];

// git push --mirror git@github.com:amanizaha/amanizaha.github.io.git

const trials = [trials_T280R, trials_T200R, trials_T140R, trials_T100R, trials_T280C, trials_T200C, trials_T140C, trials_T100C, trials_F280R, trials_F200R, trials_F140R, trials_F100R, trials_F280C, trials_F200C, trials_F140C, trials_F100C];
const conditions = ["T280R", "T200R", "T140R", "T100R", "T280C", "T200C", "T140C", "T100C", "F280R", "F200R", "F140R", "F100R", "F280C", "F200C", "F140C", "F100C"]

// for (let i=0; i<conditions.length; i++){
//     let con = conditions[i]
//     let trialZ = trials[i]

//         console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50a" +  '.jpg">')
//         console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50b" +  '.jpg">')
//         console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50c" +  '.jpg">')
//         console.log('<img style="display: none;" class="preloadImage" src="img/' + con + "50" +  '.jpg">')

// }


if(trials.length != conditions.length) { throw new Error('Missing trials!'); }

//const trialOrder = [...trials.keys()];
//shuffleArray(trialOrder);
let rand = Math.floor(Math.random() * trials.length)
condition = trials[rand];
conditionStr = conditions[rand];

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
const tGuess = Math.log10(0.3); // Estimate of intensity expected to result in a response rate of pThreshold.
const tGuessSd = 2 // 
const pThreshold = 0.75
const beta = 3.5; // steepness of curve
const delta = 0.01 // fraction of blindly pressed trials
const gamma = 0.5; // The probability of a success (a response of YES) at zero intensity.
let tActual = 1;

var timer = '';
let wrongRight = ['wrong', 'right'];
var q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.01, 3);
var tTest = jsQUEST.QuestMode(q).mode;
var currentIntensity = tTest
var prev = ""
var randord = 0;
var it = 0;

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
        $("#testIncorrect").text(`Incorrect. The reference has 50% of each tree, while the left image has 80% and 20% of each.`)
    }
    else {
        ans = 1
        $("#testIncorrect").hide()
        $("#testCorrect").show()
        $("#testCorrect").text(`Correct! The reference has 50% of each tree, and the image on the right has the same ratio.`)
    }

    $("#trialStartButton").show()
    $("#testButton").prop("disabled", true)
}

function realismSubmit(button) {
    setButtonEnableTimer("realismButton", trialDelay);
    clearInterval(timer); // button is clicked -> stop timer

    results.push(getTrialResult(button));
    tTest = jsQUEST.QuestMode(q).mode; // what's the next suggested intensity?
    console.log("SUGGESTED:", 10**tTest)

    if (k == 0) { // current CONDITION done
        results.push({'mode': 10**jsQUEST.QuestMode(q).mode}) // FOR PILOT TEST
        console.log("FINAL MODE:",10**jsQUEST.QuestMode(q).mode)
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
        console.log("RIGHT");
        return 1;
    }
    else { console.log("WRONG"); return 0; }
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
    console.log("closest:", closest, "log", 10**currentIntensity)
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

        timer = setInterval(() => {shuffleTrial(currentStimuli, conditionStr+"50", randord)}, 15000)
    }
}

function getTime(){
    let time = 0.001 * (new Date() - startTime)
    console.log(time)
    setTimeout(() => console.log("hey"), 10);
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

// FOR CALCULATING THRESHOLD FROM MULTIPLE PARTICIPANTS' RESPONSE
// let thing = {"gender":"Male","age":1,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":95.968,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R80.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity":"0.29999"},{"trialNum":1,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R65.jpg","choice":"img/T200R65.jpg","answer":"wrong", "intensity": "0.15"},{"trialNum":2,"trialLeft":"img/T200R75.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity": "0.25"},{"trialNum":3,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R70.jpg","choice":"img/T200R70.jpg","answer":"wrong", "intensity": "0.2"},{"trialNum":4,"trialLeft":"img/T200R50a.jpg","trialRight":"img/T200R85.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity": "0.35"},{"trialNum":5,"trialLeft":"img/T200R60.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R60.jpg","answer":"wrong", "intensity": "0.1"},{"trialNum":6,"trialLeft":"img/T200R50a.jpg","trialRight":"img/T200R90.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity": "0.4"}],"undefined":[]}}
// thing = thing.trialResults.T200R

// let thing2 = {"gender":"Male","age":2,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":33.999,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R80.jpg","choice":"img/T200R80.jpg","answer":"wrong", "intensity": "0.29999"},{"trialNum":1,"trialLeft":"img/T200R90.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity": "0.4"},{"trialNum":2,"trialLeft":"img/T200R85.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R50b.jpg","answer":"right", "intensity": "0.35"},{"trialNum":3,"trialLeft":"img/T200R75.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right", "intensity": "0.25"},{"trialNum":4,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R70.jpg","choice":"img/T200R70.jpg","answer":"wrong", "intensity": "0.2"},{"trialNum":5,"trialLeft":"img/T200R50a.jpg","trialRight":"img/T200R65.jpg","choice":"img/T200R65.jpg","answer":"wrong", "intensity": "0.15"},{"trialNum":6,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R60.jpg","choice":"img/T200R60.jpg","answer":"wrong", "intensity": "0.1"}],"undefined":[]}}
// thing2 = thing2.trialResults.T200R

// let thing3 = {"gender":"Male","age":8,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":55.531,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R80.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.29999999999999993},{"trialNum":1,"trialLeft":"img/T200R65.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R65.jpg","answer":"wrong","intensity":0.15},{"trialNum":2,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R75.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.25},{"trialNum":3,"trialLeft":"img/T200R70.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R70.jpg","answer":"wrong","intensity":0.2},{"trialNum":4,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R85.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.35},{"trialNum":5,"trialLeft":"img/T200R50a.jpg","trialRight":"img/T200R60.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.1},{"trialNum":6,"trialLeft":"img/T200R90.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.4}],"undefined":[]}}
// thing3 = thing3.trialResults.T200R

// let thing4 = {"gender":"Male","age":66,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":19.989,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R80.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.29999999999999993},{"trialNum":1,"trialLeft":"img/T200R65.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.15},{"trialNum":2,"trialLeft":"img/T200R60.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R60.jpg","answer":"wrong","intensity":0.1},{"trialNum":3,"trialLeft":"img/T200R70.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R70.jpg","answer":"wrong","intensity":0.2},{"trialNum":4,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R75.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.25},{"trialNum":5,"trialLeft":"img/T200R50a.jpg","trialRight":"img/T200R85.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.35},{"trialNum":6,"trialLeft":"img/T200R55.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R55.jpg","answer":"wrong","intensity":0.04999999999999999}],"undefined":[]}}
// thing4 = thing4.trialResults.T200R

// let thing5 = {"gender":"Male","age":19,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":22.244,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R80.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.29999999999999993},{"trialNum":1,"trialLeft":"img/T200R65.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.15},{"trialNum":2,"trialLeft":"img/T200R60.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R60.jpg","answer":"wrong","intensity":0.1},{"trialNum":3,"trialLeft":"img/T200R70.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R70.jpg","answer":"wrong","intensity":0.2},{"trialNum":4,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R75.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.25},{"trialNum":5,"trialLeft":"img/T200R85.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.35},{"trialNum":6,"trialLeft":"img/T200R55.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R55.jpg","answer":"wrong","intensity":0.04999999999999999}],"undefined":[]}}
// thing5 = thing5.trialResults.T200R

// let thing6 = {"gender":"Male","age":27,"device":"Desktop computer","education":"Less than high school degree","experience":"I have never interacted with computer graphics","vision":"normal vision","comments":"","duration":15.322000000000001,"trialResults":{"T200R":[{"trialNum":0,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R80.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.29999999999999993},{"trialNum":1,"trialLeft":"img/T200R65.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R65.jpg","answer":"wrong","intensity":0.15},{"trialNum":2,"trialLeft":"img/T200R75.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R75.jpg","answer":"wrong","intensity":0.25},{"trialNum":3,"trialLeft":"img/T200R90.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.4},{"trialNum":4,"trialLeft":"img/T200R85.jpg","trialRight":"img/T200R50b.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.35},{"trialNum":5,"trialLeft":"img/T200R70.jpg","trialRight":"img/T200R50a.jpg","choice":"img/T200R50a.jpg","answer":"right","intensity":0.2},{"trialNum":6,"trialLeft":"img/T200R50b.jpg","trialRight":"img/T200R60.jpg","choice":"img/T200R50b.jpg","answer":"right","intensity":0.1}],"undefined":[]}}
// thing6 = thing6.trialResults.T200R

// var x = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.01, 2);
// var things = [thing, thing2, thing3, thing4, thing5, thing6]

// for (let j = 0; j < 6; j++) {
//     let curr = things[j]
//     for (let i = 0; i < 7; i++) {
//         console.log(curr[i])

//         let response = curr[i].answer=="right" ? 1 : 0;
//         console.log(response)
//         let test = Math.log10( parseFloat(curr[i].intensity) )
//         x = jsQUEST.QuestUpdate(x, test, response); 
//     }
// }

// console.log("answer is", 10**jsQUEST.QuestMode(x).mode)
// console.log("sd:", jsQUEST.QuestSd(x))