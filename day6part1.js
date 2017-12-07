var input = "4	10	4	1	8	4	9	14	5	1	14	15	0	15	3	5";

var area = input.split("\t");
for (i = 0; i < area.length; i++) {
    area[i] = parseInt(area[i]);
}

var notInLoop = true;

// Init history
var areaHistory = [];
var redistributions = 0;
var matchingConfigurationIndex = null;
areaHistory[0] = area.slice();

console.dir(area);
console.log(area.reduce((a, b) => a + b, 0));

while (
        notInLoop 
        && redistributions < 7000000 // This is confirmed to be too high
        // && redistributions < 101
    ) {
    redistribute();
}

if (notInLoop) {
    console.log("I'm was interrupted after " + redistributions + " redistributions!");    
}
else {
    console.log("I'm so totally done! You'd probably want to know how I did?");
    console.log("I reallocated " + redistributions + " times. The matching configuration was found at areaHistory[" + matchingConfigurationIndex + "].");
    console.dir(area);
}


console.dir(area);
console.log(area.reduce((a, b) => a + b, 0));


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


function redistribute() {
    redistributions++;
    // console.log("redistribute(): I'm about to begin iteration number " + redistributions + ".");
    var mostOccupiedArea = bankWithMostBlocks();
    var remaining = area[mostOccupiedArea];
    // console.log("redistribute(): I've been told the most occupied bank is " + mostOccupiedArea + " with remaining value " + remaining +".");

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
    areaHistory[redistributions] = area.slice();

    // The magic is now done.
    if (areaIsDuplicated(redistributions)) {
        console.log("redistribute(): I've been told I'm in loop.");
        notInLoop = false;
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
            matchingConfigurationIndex = i;
            return true;
        }
    }
    return false;
    
}