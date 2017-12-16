var fs = require('fs');
var linenumber = 0;
var programnumber = 0;
var output = "<pre>";
var inputLines = [];
var inputLogCutoff = 3;
var needToStop = false;
var loggedSteps = [0, 3, 9];
var programs = [];
var groupContaining0 = [];


// ** Run ** //

day12();

// ** Functions ** //


function Program(index) {
    if (loggedSteps.includes(index)) {
        console.log("\nnew Program(" + index + ")");
        output += "\\n\\\nnew Program(" + index + ")\\n\\\n";
        // console.dir(myVectors);
    }
    this.index = index;
    this.connectedPrograms = [];
    this.distanceFrom0 = null;
    this.addConnectedProgram = function(program) {
        this.connectedPrograms[this.connectedPrograms.length] = program;
    }
    this.toString = function() {
        var output = "Program " + this.index;
        if (this.connectedPrograms.length > 0) {
            output += " <-> ";
            for (var i = 0; i < this.connectedPrograms.length; i++) {
                output += this.connectedPrograms[i].index;
                if (i != (this.connectedPrograms.length - 1)) {
                    output += ", ";
                }
            }
        }
        return output;
    }
}


function day12() {
    var inputFileName = "attachments\\day12input.txt";
    var inputFile = fs.createReadStream(inputFileName);
    console.log("\nday12(): Hello, World! About to read " + inputFileName + ".");
    output += "\\n\\\nday12(): Hello, World! About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";
    
    readInputFile(inputFile, processLine);
}


// ** Read and write ** //

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    output += "readInputFile(inputFile, processLine): start.\\n\\\n";
    var remaining = '';
    
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            output += "readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\\n\\\n"

            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1 && !needToStop) {
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
    
    if (!needToStop) {
        try {
            inputFile.on('end', function() {
                if (remaining.length > 0) {
                    // console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.");
                    // output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='" + remaining + "'.\\n\\\n";
                    processLine(remaining);
                }
                console.log("readInputFile(inputFile, processLine).inputFile.on('end', function()): almost done! Proceeding to the next function.");
                output += "readInputFile(inputFile, processLine).inputFile.on('end', function()): almost done! Proceeding to the next function.\\n\\\n";

                parsePrograms();
            });
        }
        catch (e) {
            console.log("\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\n" + e);
            output += "\\n\\\n** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end', function()). **\\n\\\n" + e + "\\n\\\n";
        }

        // console.log("readInputFile(inputFile, processLine): the very end, there's nothing to see here.");
    }
}


function processLine(data) {
    // console.log("processLine(" + data + "): linenumber==" + linenumber);
    try {
        var currentLine = data.split(" ");
        for (i = 0; i < currentLine.length; i++) {
            currentLine[i] = currentLine[i].replace(/\(|\)|,/g,'');
            if (i != 1) {
                currentLine[i] = parseInt(currentLine[i]);
            }
        }
        inputLines[linenumber] = currentLine.slice();
        if(linenumber < inputLogCutoff) {
            console.log("processLine(): inputLines[" + linenumber + "] == " + inputLines[linenumber]);
        }
        linenumber++;
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


function parsePrograms() {
    console.log("parsePrograms(): start.");
    output += "parsePrograms(): start.\\n\\\n";

    // console.dir(inputLines);

    for (var i = 0; i < inputLines.length; i++) {
        programs[i] = new Program(i);
        if (loggedSteps.includes(i)) {
            console.log(programs[i].toString());
            output += "\\n\\\n" + programs[i].toString() + ")\\n\\\n";
        }
    }
    // console.dir(programs);

    for (var i = 0; i < programs.length; i++) {
        // add connected programs

        for (var j = 2; j < inputLines[i].length; j++) {
            programs[i].addConnectedProgram(programs[inputLines[i][j]]);        
        }

        if (loggedSteps.includes(i)) {
            console.log(programs[i].toString());
            console.dir(programs[i]);
            output += "\\n\\\n" + programs[i].toString() + ")\\n\\\n";
        }
    }   

    console.log("parsePrograms(): almost done! Proceeding to the next function.");
    output += "parsePrograms(): almost done! Proceeding to the next function.\\n\\\n";
    getConnectedPrograms();
}


function getConnectedPrograms() {
    console.log("getConnectedPrograms(): start.");
    output += "getConnectedPrograms(): start.\\n\\\n";

    groupContaining0[0] = programs[0];
    programs[0].distanceFrom0 = 0;

    var newLevelFound = true;
    var currentLevel = 0;

    while (newLevelFound && currentLevel < 2) {
        console.log("getConnectedPrograms(): currentLevel == " + currentLevel + ".");
        output += "getConnectedPrograms(): currentLevel == " + currentLevel + ".\\n\\\n";
        newLevelFound = false;

        for (var i = 0; i < groupContaining0.length; i++) {
            
            if (groupContaining0[i].distanceFrom0 == currentLevel) {
                var currentParent = groupContaining0[i];
                
                
                for (var j = 0; j < currentParent.connectedPrograms.length; j++) {
                    var currentProrgram = currentParent.connectedPrograms[j];
                    console.log("getConnectedPrograms(): currentProgram == " + currentProrgram.toString());
                    if (!isConnectedTo0(currentProrgram)) {
                        currentProrgram.distanceFrom0 = currentLevel + 1;
                        groupContaining0[groupContaining0.length] = currentProrgram;
                        
                        if (!newLevelFound) {
                            newLevelFound = true;
                        }
                    }
                }
            }
        }

        groupContaining0.sort();
        console.dir(groupContaining0);

        if (newLevelFound) {
            console.log("getConnectedPrograms(): a new level has been found! Currently " + groupContaining0.length + " programs connected to 0.");
            output += "getConnectedPrograms(): a new level has been found!\\n\\\n";
            currentLevel++;
        }
        else {
            console.log("getConnectedPrograms(): " + currentLevel + " is the last level.");
            output += "getConnectedPrograms(): " + currentLevel + " is the last level.\\n\\\n";
        }
    }
    


}


function isConnectedTo0(program) {
    console.dir(groupContaining0);
    for (var i = 0; i < groupContaining0.length; i++) {
        if (program.index = groupContaining0[i].index) {
            console.log("isConnectedTo0(): program " + program.index + " is connected to 0.");
            return true;
        }
    }
    console.log("isConnectedTo0(): program " + program.index + " is not connected to 0.");
    return false;
}