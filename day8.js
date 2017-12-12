var fs = require('fs');
linenumber = 0;

var output = "<pre>";
var instructions = [];
var commands = [];
var registers = [];
var stopReading = false;
var instructionLogCutoff = 3;
var commandsExecuted = 0;
var execCommandsCutoff = 4;
// var largestRegisterValue = null;
var biggestRegister = null;
var peakHighestValue = null;
var peakHighestValueNotes = "";

var commitedCommands = "register.name \tregister (pre) \tcommand \tcondition \tevaluation \t--> \tregister (post) \n";

//  ** Run **

day8();

// ** Done running!


//  ** Objects  and Object.prototype functions **


function Command(register, direction, amount, condition, originalInstruction, linenumber) {
    this.register = register;
    this.direction = direction;
    this.amount = amount;
    this.condition = condition;
    this.originalInstruction = originalInstruction;
    this.linenumber = linenumber;
    this.toString = function () {
        return "" + this.linenumber + ": '" + this.register.toString() + " " + this.direction + " " + this.amount + " if " + this.condition.toString() + "' (evaluated " + this.condition.evaluate() + ")";
    }
    this.execute = function() {

        return operators[this.direction](this.register.value, this.amount);
    }
}


function Condition(left, operator, right) {
    this.left = left; 
    this.right = right;
    this.operator = operator;
    this.toString = function () {
        return "(" + this.left + " " + this.operator + " " + this.right + ")";
    }
    this.evaluate = function () {
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("Condition.evaluate(): " + this.toString());
        }
        var leftVar = (Number.isInteger(parseInt(this.left))) ? parseInt(this.left) : parseInt(this.left.value); 
        var rightVar = (Number.isInteger(parseInt(this.right))) ? parseInt(this.right) : parseInt(this.right.value); 
        // if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
        //     console.log("Condition.evaluate(): operators[" + this.operator + "](" + leftVar + ", " + rightVar +")");
        // }
        return operators[this.operator](leftVar, rightVar);
    }
}


function Register(name) {
    this.name = name, 
    this.value = 0,
    this.toString = function () {
        return "[" + this.name + " == " + this.value + "]";
    }
}


// ** Other functions **

function day8() {
    console.log("\nday8(): Hello, World!");
    output += "\\n\\\nday8(): Hello, World!\\n\\\n";
    var inputFileName = "attachments\\day8input.txt";
    var inputFile = fs.createReadStream(inputFileName);
    console.log("day8(): About to read " + inputFileName + ".");
    output += "day8(): About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";
    
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
    console.log("\nafterReading(): Start! \n\tUp next: createRegisters(), parseCommands(), execCommands(), findBiggestRegister().");
    output += "\\n\\\nafterReading(): Start! \\n\\\n\\tUp next: createRegisters(), parseCommands(), execCommands(), findBiggestRegister().\\n\\\n";
    // console.dir(instructions);

    createRegisters();

    parseCommands();

    // console.log("\nafterReading(): parseCommands() completed! Up next: execCommands().");
    // output += "\\nafterReading(): parseCommands() completed! Up next: execCommands().\\n\\\n";

    execCommands();

    // console.log("\nafterReading(): execCommands() completed! Up next: findBiggestRegister().");  
    // output += "\\nafterReading(): execCommands() completed! Up next: findBiggestRegister().\\n\\\n";

    findBiggestRegister();
    // 5039 is too high
    // 4145 is too low 
    // 1298 is too low

    console.log("\nafterReading(): findBiggestRegister() completed! Correct puzzle answer is " + biggestRegister.toString() + ". Peak highest value was " + peakHighestValue + " (" + peakHighestValueNotes + ")." );
    output += "\\n\\\nafterReading(): findBiggestRegister() completed!\\n\\\n";

    output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 1 completed. The bottom program is ";
    output += "<span id=\\\"result\\\">" + biggestRegister.value + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += " at register \'"+ biggestRegister.name + "\'.</strong></div>\\n\\\n";

    output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 2 completed. The peak highest value was ";
    output += "<span id=\\\"result\\\">" + peakHighestValue + "</span>";
    output += "<span id=\\\"mask\\\">[hover]</span>";
    output += ".</strong></div>";
    output += "</pre>\";\n";

    // console.dir(registers);
    exportRegisters();
    exportCommands();
    
    writeOutputFile(output, "day8");
}


function createRegisters() {
    console.log("\ncreateRegisters(): Start!");
    output += "\\n\\\ncreateRegisters(): Start!\\n\\\n";
    var tempRegistry = [];
    var currentInstruction = instructions[1]; 
    tempRegistry[0] = currentInstruction[0];
    // console.dir(tempRegistry);
    for (var i = 2; i < instructions.length; i++) {
        currentInstruction = instructions[i];
        var matchFound = false;
        for (var j = 0; j < tempRegistry.length; j++) {
            if (currentInstruction[0].valueOf() == tempRegistry[j].valueOf()) {
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            tempRegistry[tempRegistry.length] = currentInstruction[0];
            tempRegistry.sort();
        }
    }
    for (var k = 0; k < tempRegistry.length; k++) {
        registers[k] = new Register(tempRegistry[k]);
    }
    console.log("createRegisters(): Done, registers.length == " + registers.length + ".");
    console.log("\tregisters[0]: " + registers[0].toString());
    console.log("\tregisters[" + (registers.length - 1) + "]: " + registers[registers.length - 1].toString());

    output += "createRegisters(): Done, registers.length == " + registers.length + ".\\n\\\n";
    output += "\\tregisters[0]: " + registers[0].toString() + "\\n\\\n";
    output += "\\tregisters[" + (registers.length - 1) + "]: " + registers[registers.length - 1].toString() + "\\n\\\n";
    // console.dir(registers);
}


function parseCommands() {
    console.log("\nparseCommands(): Start! instructions.length == " + instructions.length);
    output += "\\n\\\nparseCommands(): Start!\\n\\\n";
    for (var c = 1; c < instructions.length; c++) {
        // console.log("parseCommands(): c == " + c);
        // console.dir(instructions[c]);
        var currentInstruction = instructions[c];
        commands[c] = new Command(
            getRegisterByName(currentInstruction[0], currentInstruction),   // register (Register)
            currentInstruction[1],                      // direction: inc or dec (String)
            currentInstruction[2],                      // amount (Integer)
            new Condition(
                (Number.isInteger(parseInt(currentInstruction[4]))) ? parseInt(currentInstruction[4]) : getRegisterByName(currentInstruction[4], currentInstruction), 
                currentInstruction[5],                  // operator (String)
                (Number.isInteger(parseInt(currentInstruction[6]))) ? parseInt(currentInstruction[6]) : getRegisterByName(currentInstruction[6], currentInstruction)
            ),
            currentInstruction,
            c
        );
        // console.log("parseCommands(): c == " + c);
    }
    console.log("parseCommands(): Done! For reference:");
    console.log("\t" + commands[1].toString());
    console.log("\t" + commands[commands.length - 1].toString());

    output += "parseCommands(): Done! For reference:\\n\\\n";
    output += "\\t" + commands[1].toString() + "\\n\\\n";
    output += "\\t" + commands[commands.length - 1].toString() + "\\n\\\n";

    // console.dir(registers);
}


var operators = {
    "inc": function(registerValue, commandAmount) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[inc]: " + registerValue + " + " + commandAmount + " == " + (registerValue + commandAmount));
        }
        return parseInt(registerValue + commandAmount); 
    },
    "dec": function(registerValue, commandAmount) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[inc]: " + registerValue + " - " + commandAmount + " == " + (registerValue - commandAmount));
        }
        return parseInt(registerValue - commandAmount); 
    }, 
    ">": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[>]: (" + left + " > " + right + ") == " + (left > right));
        }
        return (left > right); 
    }, 
    "<": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[<]: (" + left + " < " + right + ") == " + (left < right));
        }
        return (left < right); 
    }, 
    ">=": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[>=]: (" + left + " >= " + right + ") == " + (left >= right));
        }
        return (left >= right); 
    }, 
    "<=": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[<=]: (" + left + " <= " + right + ") == " + (left <= right));
        }
        return (left <= right); 
    }, 
    "==": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[==]: (" + left + " == " + right + ") == " + (left == right));
        }
        return (left == right); 
    }, 
    "!=": function(left, right) { 
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("operators[!=]: (" + left + " != " + right + ") == " + (left != right));
        }
        return (left != right); 
    }, 
};


function execCommands() {
    output += "\\n\\\nexecCommands(): Start!\\n\\\n";
    for (var i = 1; i < commands.length; i++) {
        // Log
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("\nexecCommands(): " + commands[i].toString());
            // console.log("execCommands(): current register is " + commands[i].register.toString());
            output += "\\t" + commands[i].toString() + "\\n\\\n";
        }
        else if (commandsExecuted == execCommandsCutoff) {
            console.log("\nexecCommands(): ...");
            output += "\\t...\\n\\\n";
        }
        
        // Commit  & log to commands output txt file
        commitedCommands += commands[i].register.name + "\t" + commands[i].register.toString() + "\t" + commands[i].toString() + "\t" + commands[i].condition.toString() + "\t" + commands[i].condition.evaluate() + "\t-->\t";
        if (commands[i].condition.evaluate()) {
            commands[i].register.value = commands[i].execute();
            if (peakHighestValue == null || commands[i].register.value > peakHighestValue) {
                peakHighestValue = commands[i].register.value;
                peakHighestValueNotes = commands[i].toString();
            }
        }
        commitedCommands += commands[i].register.toString() + "\n";
        
        // Log
        if (commandsExecuted < execCommandsCutoff || commandsExecuted > (commands.length - 3)) {
            console.log("execCommands(): current register is " + commands[i].register.toString());
        }
        commandsExecuted++;
    }
    output += "execCommands(): Done!\\n\\\n";
}



function findBiggestRegister() {
    for (var i = 0; i < registers.length; i++) {
        if (biggestRegister == null || registers[i].value > biggestRegister.value) {
            // largestRegisterValue = commands[i].register.value;
            biggestRegister = registers[i];
        } 
    }
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


function exportRegisters() {
    var registry = "";
    for (var i = 0; i < registers.length; i++) {
        registry += registers[i].name + "\t" + registers[i].value + "\t" + registers[i].originalInstruction + "\n";

    }
    fs.writeFile(
        "attachments\\day8registry.txt", 
        registry, 
        function (err) {
            if (err) {
                throw err;
            }
        }  
    );
    console.log("exportRegisters(): Saved!");
}


function exportCommands() {
    // var commandsOutput = "";
    // for (var i = 1; i < commands.length; i++) {
    //     commandsOutput += commands[i].toString() + "\n";

    // }
    fs.writeFile(
        "attachments\\day8commandsOutput.txt", 
        commitedCommands, 
        function (err) {
            if (err) {
                throw err;
            }
        }  
    );
    console.log("exportCommands(): Saved!");
}


function getRegisterByName(name, originalInstruction) {
    for (var i = 0; i < registers.length; i++) {
        if (registers[i].name.valueOf() == name.valueOf()) {
            return registers[i];
        }
    }
}