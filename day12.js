var fs = require('fs');
var linenumber = 0;
var programnumber = 0;
var output = "<pre>";
var inputLines = [];
var inputLogCutoff = 3;
var needToStop = false;
var loggedSteps = [0, 3, 9];
var programs = [];
var connectedPrograms = [];
var amountOfGroups = 0;
var groupStartingPoint = null;


// ** Run ** //

day12();

// ** Functions ** //


function Program(index) {
    if (loggedSteps.includes(index)) {
        console.log("\nnew Program(" + index + ")");
        output += "\\n\\\nnew Program(" + index + ")\\n\\\n";
        // console.dir(myVectors);
    }
    this.index = parseInt(index);
    this.connectedPrograms = [];
    this.groupLeader = null;
    this.distanceFromGroupLeader = null;
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
            // console.dir(programs[i]);
            output += "\\n\\\n" + programs[i].toString() + ")\\n\\\n";
        }
    }   

    console.log("parsePrograms(): almost done! Proceeding to the next function.");
    output += "parsePrograms(): almost done! Proceeding to the next function.\\n\\\n";
    getConnectedPrograms(programs[0]);
}





function getConnectedPrograms(groupLeader) {
    if (groupLeader == null) {
        console.log("getConnectedPrograms(): all " + amountOfGroups + " groups have been documented.");
    }
    else {
        amountOfGroups++;
        console.log("getConnectedPrograms(" + groupLeader.index + "): start, amountOfGroups == " + amountOfGroups + ".");
        output += "getConnectedPrograms(" + groupLeader.index + "): start, amountOfGroups == " + amountOfGroups + ".\\n\\\n";
    
        groupStartingPoint = connectedPrograms.length;
        connectedPrograms[groupStartingPoint] = groupLeader;
        connectedPrograms[groupStartingPoint].distanceFromGroupLeader = 0;
        
    
        var newLevelFound = true;
        var currentLevel = 0;
    
        while (newLevelFound && currentLevel < 200) {
            // console.log("getConnectedPrograms(" + groupLeader.index + "): currentLevel == " + currentLevel + ".");
            // output += "getConnectedPrograms(" + groupLeader.index + "): currentLevel == " + currentLevel + ".\\n\\\n";
            newLevelFound = false;
    
            for (var i = groupStartingPoint; i < connectedPrograms.length; i++) {
                var currentParent = connectedPrograms[i];
        
                if (currentParent.distanceFromGroupLeader == currentLevel) {
                    for (var j = 0; j < currentParent.connectedPrograms.length; j++) {
                        var currentProrgram = currentParent.connectedPrograms[j];
                        // console.log("getConnectedPrograms(): currentProgram == " + currentProrgram.toString());
                        
                        if (!isInGroup(currentProrgram)) {
                            currentProrgram.distanceFromGroupLeader = currentLevel + 1;
                            connectedPrograms[connectedPrograms.length] = currentProrgram;
                            
                            if (!newLevelFound) {
                                newLevelFound = true;
                            }
                        }
                    }
                }
            }
    
            // connectedPrograms.sort();
            // console.dir(connectedPrograms);
    
            if (newLevelFound) {
                // console.log("getConnectedPrograms(" + groupLeader.index + "): a new level has been found! Currently " + connectedPrograms.length + " programs connected to " + groupLeader.index + ".");
                // output += "getConnectedPrograms(" + groupLeader.index + "): a new level has been found!\\n\\\n";
                currentLevel++;
            }
            else {
                console.log("getConnectedPrograms(" + groupLeader.index + "): " + currentLevel + " is the furthest level. Currently " + connectedPrograms.length + " programs connected to " + groupLeader.index + ".");
                output += "getConnectedPrograms(" + groupLeader.index + "): " + currentLevel + " is the last level.\\n\\\n";
            }
        }
        // console.dir(connectedPrograms);

        getConnectedPrograms(getNewLeader());
    }
    
}


function isInGroup(program) {
    // console.log("isInGroup(): program == " + program.toString());
    // console.dir(program);
    // console.dir(connectedPrograms);
    for (var i = 0; i < connectedPrograms.length; i++) {
        if (program.index == connectedPrograms[i].index) {
            // console.log("isInGroup(): program " + program.index + " is in a group.");
            return true;
        }
    }
    // console.log("isInGroup(): program " + program.index + " is not in any group.");
    return false;
}


function getNewLeader() {
    for (var i = 0; i < programs.length; i++) {
        var searchTerm = programs[i];
        if (!isInGroup(searchTerm)) {
            console.log("getNewLeader(): found prorgam " + searchTerm.toString());
            return searchTerm;
        }
    }
    return null;
}