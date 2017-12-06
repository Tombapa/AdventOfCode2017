var fs = require('fs');
var list = [];
var linenumber = 0;
var stepsTaken = 0;
var currentIndex = null;
var nextIndex = 1;
var foundMyWayOut = false;

var stepLogLimit = 4;

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    var remaining = '';
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1) {
                var line = remaining.substring(last, index - 1);
                last = index + 1;
                processLine(line);
                index = remaining.indexOf('\n', last);
            }
            remaining = remaining.substring(last);
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, processLine): Epic fail at inputFile.on('data', function(data)). **\n" + e);
    }
    
    try {
        inputFile.on('end', function() {
            if (remaining.length > 0) {
                console.log("readInputFile(inputFile, processLine).inputFile.on('end, function()): remaining=='" + remaining + "'.");
                processLine(remaining);
            }
            console.log("readInputFile(inputFile, processLine).inputFile.on('end, function()): moving to afterReading().");
            afterReading();
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end, function()). **\n" + e);
    }
    
    // console.log("readInputFile(inputFile, processLine): the very end, there's nothing to see here.");
}



function processLine(data) {
    linenumber++;
    // console.log("processLine(data): start, linenumber==" + linenumber + ".");
    try {
        list[linenumber] = parseInt(data);
        // console.log(input[linenumber]);
    }
    catch (e) {
        console.log("** processLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\n" + e);
    }
    // console.log("processLine(data): end, linenumber==" + linenumber + ".");
}


function afterReading() {
    console.log(
        "afterReading(): I have now read " + inputFileName + ", " + linenumber + " lines to be exact "
        + "(list[" + linenumber + "] == " + list[linenumber] + ")."
    );
    cpuOnTheMove();
}


function cpuOnTheMove() {
    currentIndex = 1;
    console.log("cpuOnTheMove(): I'm on the move!");
    
    while (stepsTaken < 500000 && !foundMyWayOut) {
        // console.log("cpuOnTheMove(): I'm taking step " + stepsTaken + " to at " + currentIndex + " having list[" + currentIndex + "]==" + list[currentIndex] + "!");
        currentIndex = nextIndex;
        nextIndex = null;
        jumpFrom(currentIndex);
    }
    // Finally

    if (foundMyWayOut) {
        console.log("cpuOnTheMove(): Whew, I finally got out! I took " + stepsTaken + " steps."); 
    }
    else {
        console.log("cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps."); 
    }
}


function jumpFrom(index) {
    
    var entry = "jumpFrom(" + index + "): Step " + stepsTaken + ". I'm at list[" + index + "]==" + list[index] + ". ";

    nextIndex = index + list[index];
    list[index]++;

    // Log
    if (
        stepsTaken <= stepLogLimit 
        || stepsTaken % 99999 == 0
        || stepsTaken == 388615

    ) {
        entry += "Outcome: list[" + index + "]==" + list[index] + ", nextIndex==" + nextIndex + ".";
        if (stepsTaken >= stepLogLimit) {
            entry += "\n... ";
        }
        console.log(entry);
    }

    stepsTaken++;

    // Are we there yet?
    if (!nextIndex || nextIndex < 1 || nextIndex > linenumber) {
        // Log and commit exit routine.
        console.log("jumpFrom(" + index + "): We're out, nextIndex==" + nextIndex + ".");
        // console.log("And I only had to take " + stepsTaken + " steps."); 
        foundMyWayOut = true;
    }
}


console.log("\nday5part1.js: Hello, World!");
var inputFileName = "attachments\\day5input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day5part1.js: About to read " + inputFileName + ".");

readInputFile(inputFile, processLine);