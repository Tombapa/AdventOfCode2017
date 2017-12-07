var input = "4	10	4	1	8	4	9	14	5	1	14	15	0	15	3	5";

var area = input.split("\t");
for (i = 0; i < area.length; i++) {
    area[i] = parseInt(area[i]);
}

var areaHistory = [];
var reallocationCount = 0;
var matchCount = 0;
var matchingConfigurationIndex = null;
var matchingConfiguration = null;
var loopCycleCount = 0;
var loopCycleIndex = null;
var loopConfiguration = null;
var safetyLimit = 7000000;  // This is confirmed to be too high

var output = "<pre>";

// Init history
areaHistory[0] = area.slice();

output += "Continue.";
// report();

while (
        matchCount == 0 
        && reallocationCount < safetyLimit
        // && reallocationCount < 101
    ) {
    reallocate();
}

if (matchCount == 0) {
    // console.log("I was interrupted after " + reallocationCount + " reallocations!"); 
    output += "\nI was interrupted after " + reallocationCount + " reallocations!";  
    report();
}
else if (matchCount == 1) {
    // report();
    console.log("I found the 1st match! You'd probably want to know how I did?");
    // output += "\nI found the 1st match! You'd probably want to know how I did?";
    console.log("I reallocated " + reallocationCount + " times. The matching configuration was found at areaHistory[" + matchingConfigurationIndex + "].");
}

while (
        matchCount < 2
        && reallocationCount < safetyLimit
    ) {
    reallocate();
    loopCycleCount++;
}

if (matchCount == 2) {
    // report();
    console.log("I found the 2nd match! You'd probably want to know how I did?");
    console.log("I've now reallocated " + reallocationCount + " times in total. The 2nd matching configuration was found at areaHistory[" + loopCycleIndex + "]. Loop cycle count is " + loopCycleCount + ".");
    output += "\n<strong>I'm so totally done again! You'd probably want to know how I did?</strong>";
    
    output += "\n\n<div class=\"result\"><strong>Part 2 completed. The correct answer is ";
    output += "<span id=\"result\">" + loopCycleCount + "</span>";
    output += "<span id=\"mask\">[hover]</span>";
    output += " cycles.</strong></div> \n";
    
    output += "</pre>";
    document.getElementById("day6part2").innerHTML = output;
}


// Functions

function bankWithMostBlocks() {
    var max = 0;
    var indexHavingMaxValue = 0;
    for (i=0; i < area.length; i++) {
        if (area[i] > max) {
            max = area[i];
            indexHavingMaxValue = i;
        }
    }
    // console.log("bankWithMostBlocks(): area[" + indexHavingMaxValue + "]==" + max);
    return indexHavingMaxValue;
}


function reallocate() {
    reallocationCount++;
    // console.log("reallocate(): I'm about to begin iteration number " + reallocationCount + ".");
    var mostOccupiedArea = bankWithMostBlocks();
    var remaining = area[mostOccupiedArea];
    // console.log("reallocate(): I've been told the most occupied bank is " + mostOccupiedArea + " with remaining value " + remaining +".");

    // Do the magic.
    var index = mostOccupiedArea;
    area[mostOccupiedArea] = 0;
    var counter = 0;
    while (remaining > 0) {
        counter++;
        // Move to next bank. Wrap around if needed. Increase valuse while on it.
        index++;
        index = (index == area.length) ? 0 : index;
        area[index]++;
        // console.log("Step " + counter + ": New value has been set: area[" + index + "]==" + area[index] + ".");
        remaining--;
    }
    areaHistory[reallocationCount] = area.slice();

    // The magic is now done.
    if (matchCount == 0 && areaIsDuplicated(reallocationCount)) {
        console.log("reallocate(): I've been told I'm in loop.");
        // report();
        matchCount++;
    }
    else if (matchCount == 1 && areaIsDuplicatedAgain(reallocationCount)) {
        console.log("reallocate(): I've been told I've now completed the loop.");
        output += "\nreallocate(): I've been told I've now completed the loop.";
        report();
        matchCount++;
    }
}


function areaIsDuplicated(currentIndex) {
    var currentArea = areaHistory[currentIndex];
    // var matchingConfigurationFound = false;
    // console.dir(currentArea);
    for (i = 0; i < areaHistory.length - 1; i++) {
        var controlArea = areaHistory[i];
        var controlDoesNotMatch = false;
        // console.log("areaIsDuplicated(" + currentIndex + "): comparing currentArea to areaHistory[" + i + "] i.e. controlArea.");
        for (j = 0; j < controlArea.length; j++) {
            // console.log("i==" + i + ", j==" + j);
            // console.log(currentArea[j]);
            if (currentArea[j] !== controlArea[j]) {
                controlDoesNotMatch = true;
                // console.log("areaIsDuplicated(" + currentIndex + "): I found a mismatch while comparing currentArea[" + j + "]==" + currentArea[j] + " to controlArea[" + j + "]==" + controlArea[j] + ".");
                break;
            }
        }
        if (!controlDoesNotMatch) {
            console.log("areaIsDuplicated(" + currentIndex + "): I didn't find any mismatches while comparing redistribution " + currentIndex + " to other configurations in areaHistory[].");
            // output += "\nareaIsDuplicated(" + currentIndex + "): I didn't find any mismatches while comparing redistribution " + currentIndex + " to other configurations in areaHistory[].";
            matchingConfigurationIndex = i;
            matchingConfiguration = currentArea.slice();
            return true;
        }
    }
    return false;
}


function areaIsDuplicatedAgain(currentIndex) {
    var currentArea = areaHistory[currentIndex];
    var controlDoesNotMatch = false;
    for (j = 0; j < currentArea.length; j++) {
        if (currentArea[j] !== matchingConfiguration[j]) {
            controlDoesNotMatch = true;
            break;
        }
    }
    if (!controlDoesNotMatch) {
        console.log("areaIsDuplicatedAgain(" + currentIndex + "): I didn't find any mismatches while comparing redistribution " + currentIndex + " to matchingConfiguration.");
        output += "\nareaIsDuplicatedAgain(" + currentIndex + "): Match found!";
        loopCycleIndex = currentIndex;
        loopConfiguration = currentArea.slice();
        return true;
    }
}


function report() {
    console.log("report(): Report! Sum of current area blocks: " + area.reduce((a, b) => a + b, 0)) + ". \nUp next: console.dir(area).";
    console.dir(area);
    output += "\n<strong>Report!</strong> Sum of current area blocks: " + area.reduce((a, b) => a + b, 0) + ".";
    output += "\nCurrent area == " + area + ".";
}