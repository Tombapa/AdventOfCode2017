var fs = require('fs');
var input = [];
var linenumber = 0;

function readInputFile(input, lineProcessFunction) {
    console.log("readInputFile(input, lineProcessFunction): start.");
    var remaining = '';
    try {
        input.on('data', function(data) {
            console.log("readInputFile(input, lineProcessFunction).input.on('data', function(data)).");
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
        console.log("** readInputFile(input, lineProcessFunction): Epic fail at input.on('data', function(data)). **\n" + e);
    }
    
    try {
        input.on('end', function() {
            if (remaining.length > 0) {
                lineProcessFunction(remaining);
            }
            console.log("readInputFile(input, lineProcessFunction).input.on('end, function()): moving to afterReading().");
            afterReading();
        });
    }
    catch (e) {
        console.log("** readInputFile(input, lineProcessFunction): Epic fail at input.on('end, function()). **\n" + e);
    }
    
    // console.log("readInputFile(input, lineProcessFunction): the very end, there's nothing to see here.");
}


function processLine(data) {
    linenumber++;
    // console.log("processLine(data): start, linenumber==" + linenumber + ".");
    try {
        input[linenumber] = parseInt(data);
        // console.log(input[linenumber]);
    }
    catch (e) {
        console.log("** pocessLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\n" + e);
    }
    // console.log("processLine(data): end, linenumber==" + linenumber + ".");
}


function afterReading() {
    console.log("afterReading(): I have now read " + inputFileName + ", " + linenumber + " lines to be exact.");
    // console.dir(input);
    // remember: input[0] is empty, as we started from line 1.
}


console.log("\nday5part1.js: Hello, World!\n");
var inputFileName = "attachments\\day5input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day5part1.js: About to read " + inputFileName + ".");

readInputFile(inputFile, processLine);