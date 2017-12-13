var fs = require('fs');
var steps = null;
var stepsReduced = 0;
var output = "<pre>";


var smallestStepCount = null;


// RUN

day11();


// OBJECTS AND OBJECT.PROTOTYPE FUNCTIONS

var vectors = { "n":0, "ne":0, "se":0, "s":0, "sw":0, "nw":0 };

var distances = { "southToNorth":0, "southwestToNortheast":0, "northwestToSoutheast":0 };


// FUNCTIONS

function day11() {
    console.log("\nday11(): Hello, World!");
    output += "\\n\\\nday11(): Hello, World!\\n\\\n";
    var inputFileName = "attachments\\day11input.txt";
    var inputFile = fs.createReadStream(inputFileName);
    console.log("\nday11(): Hello, World! About to read " + inputFileName + ".");
    output += "\\n\\\nday11(): Hello, World! About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";
    
    readInputFile(inputFile, processLine);


}


function processLine(data) {
    try {
        steps = data.split(",");
        // console.dir(steps);
    }
    catch (e) {
        console.log("\n** processLine(data): Epic fail! \n" + e); 
        output += "\\n\\\n** processLine(data): Epic fail! \\n\\\ne == '" + e + "'\\n\\\ndata == \'" + data + "\'. **\\n\\\n";
    }
}


function afterReading() {
    console.log("\nafterReading(): Start!");
    output += "\\n\\\nafterReading(): Start!\\n\\\n";
    // console.dir(instructions);

    takeTheSteps();

    console.log("\nafterReading(): Completed! Correct puzzle answer is " + null + ". Peak highest value was " + null + " (" + null + ")." );
    // output += "\\n\\\nafterReading(): findBiggestRegister() completed!\\n\\\n";

    output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 1 completed. The result is ";
    output += "<span id=\\\"result\\\">" + null + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += " at somewhere \'"+ null + "\'.</strong></div>\\n\\\n";

    output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 2 completed. The correct answer is ";
    output += "<span id=\\\"result\\\">" + null + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += ".</strong></div>";
    output += "</pre>\";\n";
 
    writeOutputFile(output, "day11");
}


function reduceVectors () {
    console.log("\nreduceVectors(): Start!");
    output += "\\n\\\ntakeTheSteps(): Start!\\n\\\n";

    // Eliminate opposite directions
    while (vectors.s > 0 && vectors.n > 0) {
        vectors.s--;
        vectors.n--;
        stepsReduced += 2;
    }
    while (vectors.sw > 0 && vectors.ne > 0) {
        vectors.sw--;
        vectors.ne--;
        stepsReduced += 2;
    }
    while (vectors.nw > 0 && vectors.se > 0) {
        vectors.nw--;
        vectors.se--;
        stepsReduced += 2;
    }

    // Enable triangle shortcuts via hypothenuses
    while (vectors.ne > 0 && vectors.nw > 0) {
        vectors.ne--;
        vectors.nw--;
        vectors.n++;
        stepsReduced++;
    }
    while (vectors.se > 0 && vectors.sw > 0) {
        vectors.se--;
        vectors.sw--;
        vectors.s++;
        stepsReduced++;
    }

    // Enable shortcut through roundabouts
    while (vectors.s > 0 && vectors.se > 0 && vectors.ne > 0) {
        vectors.s--;
        vectors.ne--;
        vectors.se++;
        stepsReduced++;
    }
    while (vectors.s > 0 && vectors.sw > 0 && vectors.nw > 0) {
        vectors.s--;
        vectors.nw--;
        vectors.sw++;
        stepsReduced--;
    }

    while (vectors.n > 0 && vectors.ne > 0 && vectors.se > 0) {
        vectors.n--;
        vectors.se--;
        vectors.ne++;
        stepsReduced++;
    }
    while (vectors.n > 0 && vectors.nw > 0 && vectors.sw > 0) {
        vectors.n--;
        vectors.sw--;
        vectors.nw++;
        stepsReduced--;
    }




    console.log("\nreduceVectors(): Completed! Reduced " + stepsReduced + " steps.");
    output += "\\n\\\ntakeTheSteps(): Completed! Reduced " + stepsReduced + " steps.\\n\\\n";

}


function takeTheSteps() {
    console.log("\ntakeTheSteps(): Start! For the record, steps.length == " + steps.length);
    output += "\\n\\\ntakeTheSteps(): Start!\\n\\\n";

    for (var i = 0; i < steps.length; i++) {
        vectors[steps[i]]++;
    }
    console.dir(vectors);

    distances.southToNorth = vectors.n - vectors.s;
    distances.southwestToNortheast = vectors.ne - vectors.sw;
    distances.northwestToSoutheast = vectors.se - vectors.nw;
    console.dir(distances);

    smallestStepCount = (
        Math.abs(distances.southToNorth) + 
        Math.abs(distances.southwestToNortheast) + 
        Math.abs(distances.northwestToSoutheast)
    );
    console.log("takeTheSteps(): smallestStepCount == " + smallestStepCount);
    output += "\\n\\\ntakeTheSteps(): smallestStepCount == " + smallestStepCount + "\\n\\\n";


    // TODO: reduce. 
    // [ne,ne,s,s] is 2 steps away (se,se).
    // [se,sw,se,sw,sw] is 3 steps away (s,s,sw).

    reduceVectors();

    distances.southToNorth = vectors.n - vectors.s;
    distances.southwestToNortheast = vectors.ne - vectors.sw;
    distances.northwestToSoutheast = vectors.se - vectors.nw;
    console.dir(distances);
    console.dir(vectors);

    smallestStepCount = vectors.s + vectors.n + vectors.sw + vectors.ne + vectors.nw + vectors.se;
    console.log("takeTheSteps(): smallestStepCount == " + smallestStepCount);
    output += "\\n\\\ntakeTheSteps(): smallestStepCount == " + smallestStepCount + "\\n\\\n";



    // 781 is too high.
}


// ** "Common" functions for reading input and writing output ** 

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    output += "readInputFile(inputFile, processLine): start.\\n\\\n"
    var remaining = ''; 
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            output += "\\t ... inputFile.on('data', function(data)).\\n\\\n"

            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1 && !stopReading) {
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
                // console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.");
                // output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.\\n\\\n";
                processLine(remaining);
            }
            console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().");
            output += "\\t... inputFile.on('end', function()): moving to afterReading().\\n\\\n";
            afterReading();
        });
    }
    catch (e) {
        console.log("\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\n" + e);
        output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\\n\\\n" + e + "\\n\\\n";
    }
    // console.log("readInputFile(inputFile, processLine): the very end, there's nothing to see here.");
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