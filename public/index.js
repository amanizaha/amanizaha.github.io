function interp1(xs, vs, xqs, method) {
    if (method === void 0) { method = 'linear'; }
    /*
     * Throws an error if number of independent sample points is not equal to
     * the number of dependent values.
     */
    if (xs.length !== vs.length) {
        throw new Error("Arrays of sample points xs and corresponding values vs have to have\n      equal length.");
    }
    /* Combine x and v arrays. */
    var zipped = xs.map(function (x, index) { return [x, vs[index]]; });
    /* Sort points by independent variabel in ascending order. */
    zipped.sort(function (a, b) {
        var diff = a[0] - b[0];
        /* Check if some x value occurs twice. */
        if (diff === 0) {
            throw new Error('Two sample points have equal value ' + a[0] + '. This is not allowed.');
        }
        return diff;
    });
    /* Extract sorted x and v arrays */
    var sortedX = [];
    var sortedV = [];
    for (var i = 0; i < zipped.length; i++) {
        var point = zipped[i];
        sortedX.push(point[0]);
        sortedV.push(point[1]);
    }
    /* Interpolate values */
    var yqs = xqs.map(function (xq) {
        /* Determine index of range of query value. */
        var index = binaryFindIndex(sortedX, xq);
        /* Check if value lies in interpolation range. */
        if (index === -1) {
            throw new Error("Query value " + xq + " lies outside of range. Extrapolation is not\n        supported.");
        }
        /* Interpolate value. */
        return interpolate(sortedV, index, method);
    });
    /* Return result. */
    return yqs.slice();
}

animate = 2
const chart_width = 500
const chart_height = 400

// For each trial: ref50, stim50 + stimX
// Need to ensure same stim50 is not seen in a row.
// Ref can be kept the same.

// 7 trials / condition.
// Ref is always same (in a condition).
// For stimuli: list with tGuess for each condition.
// Pick condition to test (e.g. T200R or F100C)
    // Pick tGuess for condition (from list).
    // Create q from tGuess. -> qT200R.
    // Get tTest value.
    // Perform 7 trials, decrement k for each.
        // With tTest: check available stimuli for condition,
            // e.g. 0.6 (not log) -> check if T200R60.jpg exists.
            // if e.g. 0.63 -> find nearest value in available values.
        // Display ref, stim50 and stimTEST
            // stim50 - maybe remember previously shown and pick another out of 3?
        // Store trial condition, stimuli, choice, right/wrong.
        // Update q with 
    // Once k=0, store threshold estimates in a result list?


// Available intensities (exc. base intensity).
const trials_T200R = [55, 60, 65, 70, 75, 80, 85, 90];
const trials_T100R = [55, 60, 63, 72, 74, 85, 83, 87];
const trials_T140R = [52, 60, 63, 72, 74, 85, 83, 87];

const trials = [trials_T200R, trials_T100R]
const conditions = ["T200R", "T100R"]

if(trials.length != conditions.length) { throw new Error('Missing trials!'); }

//const trialOrder = [...trials.keys()];
//shuffleArray(trialOrder);
let rand = Math.floor(Math.random() * trials.length)
condition = trials[rand];
conditionStr = conditions[rand];

var k = 1;
const numTrials = trials.length * k;
let currentTrialIndex = -1;
const pageDelay = 0;
const trialDelay = 1000;
let startTime = new Date();
var results = []
var allResults = {}

// tGuess = 20% change threshold, i.e. from 50:50 -> 70:30.
let tGuess = Math.log10(0.3); // Estimate of intensity expected to result in a response rate of pThreshold.
let tGuessSd = 2 // 
let pThreshold = 0.75
let beta = 3.5; // steepness of curve
let delta = 0.01 // fraction of blindly pressed trials
let gamma = 0.5; // The probability of a success (a response of YES) at zero intensity.
let tActual = 1;

let wrongRight = ['wrong', 'right'];
var q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.01, 2);
var tTest = jsQUEST.QuestMode(q).mode;
var currentIntensity = tTest
var prev = ""

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
    tTest = jsQUEST.QuestMode(q).mode; // what's the next suggested intensity?
    //console.log("SUGGESTED: ", tTest, 10**tTest)

    if (k == 0) { // current CONDITION done
        allResults[conditionStr] = results; // add all results for 'completed' condition
        results = []

        k = 7;
        let ind = trials.indexOf(condition); // removes previous condition from trials.
        trials.splice(ind, 1);
        ind = conditions.indexOf(conditionStr); // removes previous condition from trials.
        conditions.splice(ind, 1);

        let rand = Math.floor(Math.random() * trials.length)
        condition = trials[rand];
        conditionStr = conditions[rand];
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
    // console.log("RES is", response, 10**currentIntensity)
    q = jsQUEST.QuestUpdate(q, currentIntensity, response); //  used intensity may not be same as tTest.
    k = k-1;

    return {
        trialNum: currentTrialIndex,
        trialLeft: $("#leftImage").attr("src"),
        trialRight: $("#rightImage").attr("src"),
        choice: imageString,
        answer: wrongRight[response]
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
    console.log("closest:", closest, "log", currentIntensity)
    return nextIntensity
}

function nextTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= numTrials) {
        console.log(0.001 * (new Date() - startTime))
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
        if (Math.random() < 0.5) {
            $("#leftImage").attr("src", `img/${same}.jpg`);
            $("#rightImage").attr("src", `img/${currentStimuli}.jpg`);
        } else {
            $("#leftImage").attr("src", `img/${currentStimuli}.jpg`);
            $("#rightImage").attr("src", `img/${same}.jpg`);
        }
    }
}

function finishTrials() {
    $("#trialPage").hide();
    $("#demographicsPage").show();
    const t = jsQUEST.QuestMean(q);
    const sd = jsQUEST.QuestSd(q);
    console.log(q)

    console.log(`Final threshold estimate (mean+-sd) is ${10**t} +- ${sd}`)
    console.log(`Mode threshold estimate is ${10**jsQUEST.QuestMode(q).mode}, and the pdf is ${jsQUEST.QuestMode(q).pdf}`)
    console.log(`You set the true threshold to ${tActual}`)
}

function verifyAndGatherData() {
    let potentialAge = parseInt($("input[name=age]").val(), 10);

    if (Number.isInteger(potentialAge)) {
        let data = {
            gender: $("select[name=gender]").find(":selected").text(),
            age: potentialAge,
            device: $("select[name=device]").find(":selected").text(),
            education: $("select[name=education]").find(":selected").text(),
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
