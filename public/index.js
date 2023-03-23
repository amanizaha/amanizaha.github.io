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

const trials_TD = [
    ["TD200random35.jpg", "TD200random35.jpg", "TD200random45.jpg"],
    ["TD200random50.jpg", "TD200random50.jpg", "TD200random60.jpg"],
    // ["TD200random65.jpg", "TD200random75.jpg"],
    ["TD100random35.jpg", "TD100random35.jpg", "TD100random45.jpg"],
    ["TD100random50.jpg", "TD100random50.jpg", "TD100random60.jpg"],
    ["TD100random65.jpg", "TD100random65.jpg", "TD100random75.jpg"],
    // ["TD60random35.jpg", "TD60random45.jpg"],
    // ["TD60random50.jpg", "TD60random60.jpg"],
    // ["TD60random65.jpg", "TD60random75.jpg"],
    // ["TD30random33.jpg", "TD30random43.jpg"],
    // ["TD30random50.jpg", "TD30random60.jpg"],
    // // ["TD30random65.jpg", "TD30random75.jpg"],
    // //
    ["TD200cluster35.jpg","TD200cluster35.jpg", "TD200cluster45.jpg"],
    ["TD200cluster50.jpg", "TD200cluster50.jpg", "TD200cluster60.jpg"],
    ["TD200cluster65.jpg", "TD200cluster65.jpg","TD200cluster75.jpg"],
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

animate = 2
const chart_width = 500
const chart_height = 400

let tGuess = Math.log10(0.2); // Estimate of intensity expected to result in a response rate of pThreshold.
let tGuessSd = 2 // 
let pThreshold = 0.75
let beta = 3.5; // steepness of curve
let delta = 0.01 // fraction of blindly pressed trials
let gamma = 0.5; // The probability of a success (a response of YES) at zero intensity.
let tActual = 1;

let wrongRight = ['wrong', 'right'];
var q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma, 0.01, 1);
var tTest = jsQUEST.QuestMode(q).mode;
var k = 7;


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
    tTest = jsQUEST.QuestMode(q).mode; // what's the next suggested intensity?
    console.log(tTest, 10**tTest)
    nextTrial();
}

// Checks if chosen stimuli depicts same ratio as reference.
function correctAnswer(chosen, ref) {   
    // let view = chosen[0];
    // let n = chosen.substring(2,5);
    // let arrangement = chosen[5];
    let ratio = chosen.substring().slice(-2);

    if(ratio == ref.slice(-2)) { return 1 }
    else { return 0 }
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
    q = jsQUEST.QuestUpdate(q, tTest, response); // update q with response. Used same intensity as suggested.
    
    return {
        trialNum: trialOrder[currentTrialIndex],
        trialLeft: $("#leftImage").attr("src"),
        trialRight: $("#rightImage").attr("src"),
        answer: imageString
    }
}

function nextTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= numTrials) {
        console.log(0.001 * (new Date() - startTime))
        finishTrials();
    } else {
        $("#refImage").attr("src", `img/${trials[trialOrder[currentTrialIndex]][0]}`);
        $("#trialNumber").text(`Trial ${currentTrialIndex + 1}/${numTrials}`)
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
    const t = jsQUEST.QuestMean(q);
    const sd = jsQUEST.QuestSd(q);

    console.log(`Final threshold estimate (mean+-sd) is ${10**t} +- ${sd}`)
    console.log(`Mode threshold estimate is ${10**jsQUEST.QuestMode(q).mode}, and the pdf is ${jsQUEST.QuestMode(q).pdf}`)
    console.log(`You set the true threshold to ${tActual}`)
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

// const plotIt = 2
// let ctx, myChart, mydata
//     if (animate && document.getElementById('posterior_chart') === null) {
//         const canvas_element = document.createElement('canvas');
//         canvas_element.id = 'posterior_chart';
//         canvas_element.width = chart_width
//         canvas_element.height = chart_height
//         document.body.appendChild(canvas_element)
//         ctx = document.getElementById('posterior_chart').getContext('2d');
//     } 


// function yoink() {
//     console.log("now???")
//     const weibull = [];
//     for (let i = 0; i < q.x2.length; i++){
//         weibull.push({
//             x: q.x2[i] + tActual,
//             y: q.p2[i]
//         });
//     }
//     const graph_data = [];
//     graph_data.push({
//         label: 'Psychometric function',
//         data: weibull,
//         backgroundColor: 'RGBA(225,95,150, 1)',
//     });

//     graph_data.push({
//         label: 'tActual',
//         data: [{
//             x: tActual, 
//             // y: numeric.spline(numeric.add(q.x2, tActual) , q.p2).at(tActual)
//             y: 0.82
//         }],
//         backgroundColor: 'RGBA(255, 0, 255, 1)',
//         pointBorderColor: 'RGBA(255, 0, 255, 1)',
//         pointStyle: 'circle',
//         pointBorderWidth: 2,
//         pointRadius: 10,
//         pointRotation: 45,
//     });

//     simulate_chart = new Chart(ctx, {
//         type: 'scatter',
//         data: {
//             datasets: graph_data
//         },
//         options: {
//             title: {
//                 display: true,
//                 text: 'Psychometric function by QuestSimulate.'
//             },
//             scales: {
//                 xAxes: [
//                     {
//                         scaleLabel: {
//                             display: true,
//                             labelString: 'Stimulus intensity (Log scale)'
//                         }
//                     }
//                 ],
//                 yAxes: [
//                     {
//                         scaleLabel: {
//                             display: true,
//                             labelString: 'Probability'
//                         }
//                     }
//                 ]
//             },
//             responsive: false
//         }
//     });
// }