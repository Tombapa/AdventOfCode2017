var fs = require('fs');
var list = [];
var linenumber = 0;
var stepsTaken = 0;
var currentIndex = null;
var nextIndex = 1;
var foundMyWayOut = false;

var stepLogLimit = 4;

var output = "<pre>";

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    output += "readInputFile(inputFile, processLine): start.\\n\\\n"
    var remaining = '';
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            output += "readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\\n\\\n"

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
        console.log("\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('data', function(data)). **\n" + e);
        output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('data', function(data)). **\\n\\\n" + e + "\\n\\\n";
    }
    
    try {
        inputFile.on('end', function() {
            if (remaining.length > 0) {
                console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.");
                output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.\\n\\\n";
                processLine(remaining);
            }
            console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().");
            output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().\\n\\\n";
            afterReading();
        });
    }
    catch (e) {
        console.log("\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\n" + e);
        output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\\n\\\n" + e + "\\n\\\n";
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
        console.log("** processLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\\n\\\n" + e);
        output += "** processLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\\n\\\n" + e + "\\n\\\n";
    }
    // console.log("processLine(data): end, linenumber==" + linenumber + ".");
}


function afterReading() {
    console.log("afterReading(): I have now read lines 1-" + linenumber + ", list[" + linenumber + "]==" + list[linenumber] + ".");
    output += "afterReading(): I have now read lines 1-" + linenumber + ", list[" + linenumber + "]==" + list[linenumber] + ".\\n\\\n";
    cpuOnTheMove();
}


function cpuOnTheMove() {
    currentIndex = 1;
    console.log("cpuOnTheMove(): I'm on the move!");
    output += "cpuOnTheMove(): I'm on the move!\\n\\\n";
    
    while (stepsTaken < 500000 && !foundMyWayOut) {
        // console.log("cpuOnTheMove(): I'm taking step " + stepsTaken + " to at " + currentIndex + " having list[" + currentIndex + "]==" + list[currentIndex] + "!");
        currentIndex = nextIndex;
        nextIndex = null;
        jumpFrom(currentIndex);
    }
    // Finally

    if (foundMyWayOut) {
        console.log("cpuOnTheMove(): Whew, I finally got out! I took " + stepsTaken + " steps."); 
        output += "cpuOnTheMove(): Whew, I finally got out!\\n\\\n";
        output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 1 completed. The correct answer is ";
        output += "<span id=\\\"result\\\">" + stepsTaken + "</span>";
        output += "<span id=\\\"mask\\\">[hover]</span>";
        output += " steps.</strong></div>";
        output += "</pre>\";\n";
    }
    else {
        console.log("cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps."); 
        output += "cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps.</pre>\";\\n\\\n";
    }
    // document.getElementById("day5part1").innerHTML = output;
    writeOutputFile(output, "day5part1");
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
            entry += "\\n\\\n... ";
        }
        console.log(entry);
        output += entry + "\\n\\\n";
    }

    stepsTaken++;

    // Are we there yet?
    if (!nextIndex || nextIndex < 1 || nextIndex > linenumber) {
        // Log and commit exit routine.
        console.log("jumpFrom(" + index + "): We're out, nextIndex==" + nextIndex + ".");
        output += "jumpFrom(" + index + "): We're out, nextIndex==" + nextIndex + ".\\n\\\n";
        // console.log("And I only had to take " + stepsTaken + " steps."); 
        foundMyWayOut = true;
    }
}


function writeOutputFile(outputTxt, elementId) {
    var outputJS = "var output = \""; 
    outputJS += outputTxt;
    // outputJS += "\\n\\\n";
    outputJS += "\ndocument.getElementById(\"" + elementId + "\").innerHTML = output;";

    fs.writeFile("attachments\\" + elementId + "output.js", outputJS, function (err) {
        if (err) throw err;
        console.log("writeOutputFile(): Saved!");
    });
}

console.log("\nday5part1.js: Hello, World!");
output += "\\n\\\nday5part1.js: Hello, World!\\n\\\n";
var inputFileName = "attachments\\day5input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day5part1.js: About to read " + inputFileName + ".");
output += "day5part1.js: About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";

readInputFile(inputFile, processLine);