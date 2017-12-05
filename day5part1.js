var fs = require('fs');
var list = [];
var linenumber = 0;
var stepsTaken = 0;
var foundMyWayOut = false;

function readInputFile(inputFile, lineProcessFunction) {
    console.log("readInputFile(inputFile, " + lineProcessFunction + "): start.");
    var remaining = '';
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, lineProcessFunction).inputFile.on('data', function(data)).");
            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1) {
                var line = remaining.substring(last, index - 1);
                last = index + 1;
                lineProcessFunction(line);
                index = remaining.indexOf('\n', last);
            }
            remaining = remaining.substring(last);
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, lineProcessFunction): Epic fail at inputFile.on('data', function(data)). **\n" + e);
    }
    
    try {
        inputFile.on('end', function() {
            if (remaining.length > 0) {
                console.log("readInputFile(inputFile, lineProcessFunction).inputFile.on('end, function()): remaining=='" + remaining + "'.");
                lineProcessFunction(remaining);
            }
            console.log("readInputFile(inputFile, lineProcessFunction).inputFile.on('end, function()): moving to afterReading().");
            afterReading();
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, lineProcessFunction): Epic fail at inputFile.on('end, function()). **\n" + e);
    }
    
    // console.log("readInputFile(inputFile, lineProcessFunction): the very end, there's nothing to see here.");
}



function processLine(data) {
    linenumber++;
    // console.log("processLine(data): start, linenumber==" + linenumber + ".");
    try {
        list[linenumber] = parseInt(data);
        // console.log(input[linenumber]);
    }
    catch (e) {
        console.log("** pocessLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\n" + e);
    }
    // console.log("processLine(data): end, linenumber==" + linenumber + ".");
}


function afterReading() {
    console.log(
        "afterReading(): I have now read " + inputFileName + ", " + linenumber + " lines to be exact "
        + "(list[" + linenumber + "] == " + list[linenumber] + ")."
    );
    // console.dir(input);
    // remember: input[0] is empty, as we started from line 1.

    // determine the first step
    jump(0); // TODO
}


function jump(index) {
    // Take the step
    stepsTaken++;
    // Are we there yet?
    if (!index || index < 1 || index > linenumber) {
        console.log("jump(" + index + "): I'm outside the list!"); // TODO: values
        if (!index) {
            foundMyWayOut = true;
        }
        gotOut();
    } else {
        console.log("jump(" + index + "): I'm still on the list!");
        // do the magic
        // then
        jump(null); // TODO
    }
}


function gotOut() {
    console.log("gotOut(): Whew, finally! I took " + stepsTaken + " steps.");
}

console.log("\nday5part1.js: Hello, World!");
var inputFileName = "attachments\\day5input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day5part1.js: About to read " + inputFileName + ".");

readInputFile(inputFile, processLine);