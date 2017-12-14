var fs = require('fs');
var steps = null;
var output = "<pre>";
var takenSteps = [];
var loggedSteps = [6, 60, 600, 6000];
var furthermostStep = null;


// RUN
day11();


// OBJECTS AND OBJECT.PROTOTYPE FUNCTIONS

var vectors = { "n":0, "ne":0, "se":0, "s":0, "sw":0, "nw":0, "stepsReduced":0 };

var distances = { "southToNorth":0, "southwestToNortheast":0, "northwestToSoutheast":0 };

function Step(index, command, myVectors) {
    if (loggedSteps.includes(index)) {
        console.log("\nnew Step(" + index + ", ..., ...)");
        output += "\\n\\\nnew Step(" + index + ", ..., ...)\\n\\\n";
        // console.dir(myVectors);
    }
    this.index = index;
    this.command = command;
    this.vectors = myVectors;
    reduceVectors(this);
    if (loggedSteps.includes(index)) {
        console.dir(this.vectors);
        output += "...\\n\\\n";
    }
    this.distances = {
        "southToNorth": this.vectors.n - this.vectors.s,
        "southwestToNortheast": this.vectors.ne - this.vectors.sw,
        "northwestToSoutheast": this.vectors.se - this.vectors.nw
    };
    this.smallestStepCount = (
        Math.abs(this.distances.southToNorth) + 
        Math.abs(this.distances.southwestToNortheast) + 
        Math.abs(this.distances.northwestToSoutheast)
    )
}

function copyVectors(source) {
    return {"n":source.n, "ne":source.ne, "se":source.se, "s":source.s, "sw":source.sw, "nw":source.nw, "stepsReduced":source.stepsReduced };
}


// FUNCTIONS

function day11() {
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


function reduceVectors(step) {
    // console.log(step.vectors);
    if (loggedSteps.includes(step.index)) {
        console.log("reduceVectors(" + step.index + "): Start!");
        output += "reduceVectors(" + step.index + "): Start!\\n\\\n";
    }

    // Eliminate opposite directions
    while (step.vectors.s > 0 && step.vectors.n > 0) {
        step.vectors.s--;
        step.vectors.n--;
        step.vectors.stepsReduced += 2;
    }
    while (step.vectors.sw > 0 && step.vectors.ne > 0) {
        step.vectors.sw--;
        step.vectors.ne--;
        step.vectors.stepsReduced += 2;
    }
    while (step.vectors.nw > 0 && step.vectors.se > 0) {
        step.vectors.nw--;
        step.vectors.se--;
        step.vectors.stepsReduced += 2;
    }

    // Enable shortcuts via triangle hypothenuses
    while (step.vectors.ne > 0 && step.vectors.nw > 0) {
        step.vectors.ne--;
        step.vectors.nw--;
        step.vectors.n++;
        step.vectors.stepsReduced++;
    }
    while (step.vectors.se > 0 && step.vectors.sw > 0) {
        step.vectors.se--;
        step.vectors.sw--;
        step.vectors.s++;
        step.vectors.stepsReduced++;
    }

    // Enable shortcuts through roundabouts
    while (step.vectors.s > 0 && step.vectors.se > 0 && step.vectors.ne > 0) {
        step.vectors.s--;
        step.vectors.ne--;
        step.vectors.se++;
        step.vectors.stepsReduced++;
    }
    while (step.vectors.s > 0 && step.vectors.sw > 0 && step.vectors.nw > 0) {
        step.vectors.s--;
        step.vectors.nw--;
        step.vectors.sw++;
        step.vectors.stepsReduced--;
    }
    while (step.vectors.n > 0 && step.vectors.ne > 0 && step.vectors.se > 0) {
        step.vectors.n--;
        step.vectors.se--;
        step.vectors.ne++;
        step.vectors.stepsReduced++;
    }
    while (step.vectors.n > 0 && step.vectors.nw > 0 && step.vectors.sw > 0) {
        step.vectors.n--;
        step.vectors.sw--;
        step.vectors.nw++;
        step.vectors.stepsReduced++;
    }

    if (loggedSteps.includes(step.index)) {
        console.log("reduceVectors(" + step.index + "): Completed! Reduced " + step.vectors.stepsReduced + " steps.");
        output += "reduceVectors(" + step.index + "): Completed! Reduced " + step.vectors.stepsReduced + " steps.\\n\\\n";
    }
}


function takeTheSteps() {
    console.log("\ntakeTheSteps(): Start! For the record, steps.length == " + steps.length);
    output += "\\n\\\ntakeTheSteps(): Start!\\n\\\n";

    for (var i = 0; i < steps.length; i++) {
        vectors[steps[i]]++;
        var step = new Step(i, steps[i], copyVectors(vectors));
        // reduceVectors(step);
        takenSteps[i] = step;
        
        if (furthermostStep == null) {
            furthermostStep = takenSteps[i];
        }
        else if (furthermostStep.smallestStepCount < takenSteps[i].smallestStepCount) {
            furthermostStep = takenSteps[i];
        }
    }
    // console.dir(vectors);  

    // console.log("\nafterReading(): Completed! Correct puzzle answer is " + null + ". Peak highest value was " + null + " (" + null + ")." );
    // output += "\\n\\\nafterReading(): findBiggestRegister() completed!\\n\\\n";

    output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 1 completed. The correct answer is ";
    output += "<span id=\\\"result\\\">" + takenSteps[takenSteps.length - 1].smallestStepCount + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += " steps to reach him.</strong></div>\\n\\\n";

    output += "\\n<div class=\\\"result\\\"><strong>Part 2 completed. The correct answer is ";
    output += "<span id=\\\"result\\\">" + furthermostStep.smallestStepCount + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += " steps at the furthermost point.</strong></div>";
    output += "</pre>\";\n";
 
    writeOutputFile(output, "day11");

    console.log("\ntakeTheSteps(): The path ends having smallestStepCount == " + takenSteps[takenSteps.length - 1].smallestStepCount);
    console.log("takeTheSteps(): The furthermost step was at index " + furthermostStep.index + " having smallestStepCount == " + furthermostStep.smallestStepCount);
    console.log("takeTheSteps(): Completed!");
}


// ** READ INPUT AND WRITE OUTPUT ** 

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    // output += "readInputFile(inputFile, processLine): start.\\n\\\n"
    var remaining = ''; 
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            // output += "\\t ... inputFile.on('data', function(data)).\\n\\\n"

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
        // output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('data', function(data)). **\\n\\\n" + e + "\\n\\\n";
    }   
    try {
        inputFile.on('end', function() {
            if (remaining.length > 0) {
                // console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.");
                // output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.\\n\\\n";
                processLine(remaining);
            }
            console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().");
            // output += "\\t... inputFile.on('end', function()): moving to afterReading().\\n\\\n";
            
            takeTheSteps();

        });
    }
    catch (e) {
        console.log("\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\n" + e);
        // output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\\n\\\n" + e + "\\n\\\n";
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