var fs = require('fs');
linenumber = 0;

var output = "<pre>";
var instructions = [];
var commands = [];
var registers = [];
var stopReading = false;
var instructionLogCutoff = 3;


//  ** Run **

startDay8Part1();

// ** Done running!


//  ** Objects  and Object.prototype functions **

/**
 * 
 * @param {*} register 
 * @param {*} direction 
 * @param {*} amount 
 * @param {*} condition 
 */
function Command(register, direction, amount, condition, originalInstruction) {
    this.register = register;
    this.direction = direction;
    this.amount = amount;
    this.condition = condition;
    this.originalInstruction = originalInstruction;
}


function Condition(left, operator, right) {
    this.left = left; 
    this.right = right;
    this.operator = operator;
}


function Register(name) {
    this.name = name, 
    this.value = 0
}


// ** Other functions **

function startDay8Part1() {
    console.log("\nstartDay8Part1(): Hello, World!");
    output += "\\n\\\nstartDay8Part1(): Hello, World!\\n\\\n";
    var inputFileName = "attachments\\day8input.txt";
    var inputFile = fs.createReadStream(inputFileName);
    console.log("startDay8Part1(): About to read " + inputFileName + ".");
    output += "startDay8Part1(): About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";
    
    readInputFile(inputFile, processLine);
}


function processLine(data) {
    linenumber++;
    // console.log("processLine(" + data + "): linenumber==" + linenumber);
    try {
        var currentInstruction = data.split(" ");
        for (var i = 0; i < currentInstruction.length; i++) {
            currentInstruction[i] = currentInstruction[i].replace(/\(|\)|,/g,'');
            if (i == 2) {
                currentInstruction[i] = parseInt(currentInstruction[i]);
            }
        }
        instructions[linenumber] = currentInstruction.slice();
        if (linenumber < instructionLogCutoff) {
            console.log("processLine(): instructions[" + linenumber + "] == " + instructions[linenumber]);
        }
        else if (linenumber == instructionLogCutoff) {
            console.log("processLine(): ...");
        }
    }
    catch (e) {
        console.log(
            "** processLine(data): Epic fail at linenumber " + linenumber 
            // + " with data=='" + data + "'"
            + ". **\n" + e);
        output += "** processLine(data): Epic fail at linenumber " + linenumber + " with data==\'" + data + "\'. **\\n\\\n" + e + "\\n\\\n";
        needToStop = true;
    }
}


function afterReading() {
    console.log("\nafterReading(): Start!");
    output += "\\n\\\nafterReading(): Start!\\n\\\n";
    // console.dir(instructions);

    parseCommands();

    // writeOutputFile(output, "day8output");
}


function parseCommands() {
    console.log("parseCommands(): Start! instructions.length == " + instructions.length);
    output += "parseCommands(): Start!\\n\\\n";
    for (var c = 1; c < instructions.length; c++) {
        // console.log("parseCommands(): c == " + c);
        // console.dir(instructions[c]);
        var currentInstruction = instructions[c];
        commands[c] = new Command(
            getRegisterByName(currentInstruction[0]),   // register (Register)
            currentInstruction[1],                      // direction: inc or dec (String)
            currentInstruction[2],                      // amount (Integer)
            new Condition(
                (Number.isInteger(currentInstruction[4])) ? parseInt(currentInstruction[4]) : getRegisterByName(currentInstruction[4]), 
                currentInstruction[5],                  // operator (String)
                (Number.isInteger(currentInstruction[6])) ? parseInt(currentInstruction[6]) : getRegisterByName(currentInstruction[6])
            ),
            currentInstruction
        );
        // console.log("parseCommands(): c == " + c);
    }
    console.log("parseCommands(): Done!");
    output += "parseCommands(): Done!\\n\\\n";
    console.dir(commands[1]);
    console.dir(commands[commands.length - 1]);
}


// ** "Common" functions for reading input and writing output ** 

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
        stopReading = true;
    }   
    if (!stopReading) {
        try {
            inputFile.on('end', function() {
                if (remaining.length > 0) {
                    // console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.");
                    // output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.\\n\\\n";
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


function getRegisterByName(name) {
    for (var i = 0; i < registers.length; i++) {
        if (!(registers[i].name < name || registers[i].name < name)) {
            return registers[i]
        }
        // Not found, let's create a new one
        var register = new Register(name);
        registers[registers.length] = register;
        return register;
    }
}