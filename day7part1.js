var fs = require('fs');
linenumber = 0;
var programnumber = 0;
var output = "<pre>";

var reports = [];
var programs = [];

var needToStop = false;
var levelCount = 0;
var reportLogCutoff = 7;

var bottomProgram = null;
var unbalancedProgram = null;


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


function processLine(data) {
    linenumber++;
    // console.log("processLine(" + data + "): linenumber==" + linenumber);
    try {
        var currentReport = data.split(" ");
        for (i = 0; i < currentReport.length; i++) {
            currentReport[i] = currentReport[i].replace(/\(|\)|,/g,'');
            if (i == 1) {
                currentReport[i] = parseInt(currentReport[i]);
            }
        }
        reports[linenumber] = currentReport.slice();
        if(linenumber < reportLogCutoff) {
            console.log("processLine(): reports[" + linenumber + "] == " + reports[linenumber]);
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


function buildPrograms() {
    for (index = 1; index < reports.length; index++) {
        var currentReport = reports[index];
        // console.log("buildPrograms(): currentReport == '" + currentReport + "'.");
        var currentChildren = null;
        if (currentReport[3] !== undefined) {
            currentChildren = currentReport.slice(3);
        }
        var currentProgram = null;
        var existingProgramNumber = findIndexByName(reports[index][0]);
        if (existingProgramNumber == null) {         
            currentProgram = new Program(programnumber, currentReport[0], currentReport[1], currentChildren, null);
            programs[programnumber] = currentProgram;
            // console.log("buildPrograms(): Added a new independent program '" + currentProgram.name + "'.");
            // console.dir(currentProgram);
            // console.log("buildPrograms(): currentProgram == " + currentProgram.toString());
            programnumber++;
        }
        else {
            currentProgram = programs[existingProgramNumber];
            currentProgram.weight = currentReport[1];
            currentProgram.children = currentChildren;
            // console.log("buildPrograms(): Found an existing program '" + currentProgram.name + "', updated weight and children.");
            // console.dir(currentProgram);
            // console.log("buildPrograms(): currentProgram == " + currentProgram.toString());
        }
    
        if (currentChildren != null && currentChildren.length > 0) {    // '->'
            var parentName = currentReport[0];
            // console.log("buildPrograms(): Adding new childs for parent '" + parentName + "'.");
            // console.dir(currentChildren);
            for (c = 0; c < currentChildren.length; c++) {
                var childName = currentChildren[c];
                // console.log("buildPrograms(): c==" + c + ", the child is (or will be) called currentChildren[" + c + "]=='" + childName + "'.");
                try {
                    var currentChild = null;
                    var existingChildProgramNumber = findIndexByName(childName);
                    if (existingChildProgramNumber == null) {
                        currentChild = new Program(programnumber, childName, null, null, parentName);
                        programs[programnumber] = currentChild;
                        // console.log("buildPrograms(): c==" + c + ". A new child is born with name=='" + currentChild.name + "').");
                        // console.dir(currentChild);
                        // console.log("buildPrograms(): currentChild == " + currentChild);
                        programnumber++;
                    }
                    else {
                        currentChild = programs[existingChildProgramNumber];
                        currentChild.parentName = parentName; 
                        // console.log("buildPrograms(): c==" + c + ". I was pointed an existing child with number " + existingChildProgramNumber + " (name=='" + currentChild.name + "').");
                        // console.dir(currentChild);
                        // console.log("buildPrograms(): currentChild == " + currentChild);
                    }   
                }
                catch (e) {
                    console.log("** buildPrograms(data): Epic fail at reports[" + i + "] with currentReport=='" + currentReport + "'. **\n" + e);
                    output += "** buildPrograms(data): Epic fail at reports[" + i + "] with currentReport=='" + currentReport + "'. **\\n\\\n" + e + "\\n\\\n";
                    needToStop = true;
                }
            }
        }
    }

    console.log("buildPrograms(): completed!");
    // console.dir(programs);

}


function Program(index, name, weight, children, parentName) {
    this.index = index;
    this.name = name;
    this.weight = weight;
    this.children = children;
    this.parentName = parentName;
}


Program.prototype.toString = function() {
    return 
    " [ " + this.number + ", '" + this.name + "'"   
    + ", weight==" + this.weight
    + ", parentName=='" + this.parentName + "'"
    + ", chilrden==" + this.children
    + " ] ";
}


function getProgramByName(name) {
    for (i = 0; i < programs.length; i++) {
        if (!((programs[i].name < name) || (programs[i].name > name))) {
            // console.log("getProgramByName(" + name + "): Program found at programs[" + i + "]. Dir:"); //, requested by linenumber==" + linenumber + ".");
            // console.dir
            return programs[i];
        }
        // else {}
    }
    console.log("getProgramByName(" + name + "): Didn't find a thing!");
    return null;
}


function findIndexByName(name) {
    for (i = 0; i < programs.length; i++) {
        if (!((programs[i].name < name) || (programs[i].name > name))) {
            // console.log("findIndexByName(" + name + "): Program found at programs[" + i + "]. Dir:"); //, requested by linenumber==" + linenumber + ".");
            // console.dir
            return i;
        }
        // else {}
    }
    // console.log("findIndexByName(" + name + "): Didn't find a thing!");
    return null;
}


function afterReading() {
    console.log("afterReading(): I have now read lines 1-" + linenumber + ", reports[(reports.length - 1)] == '" + reports[reports.length - 1] + "'.");
    output += "afterReading(): I have now read lines 1-" + linenumber + ", reports[(reports.length - 1)] == '" + reports[programs.length - 1] + "'.\\n\\\n";  

    buildPrograms();
    findBottom();

    console.log("\nafterReading(): Whew, I think I'm done here.");
}


function findBottom() {
    console.log("\nfindBottom()");
    var currentBottom = programs[0];    // Any will do.
    console.log("findBottom(): currentBottom.parentName=='" + currentBottom.parentName + "', levelCount==" + levelCount);
    console.dir(currentBottom);

    while (currentBottom.parentName != null) {
        currentBottom = programs[findIndexByName(currentBottom.parentName)];
        levelCount++;
        console.log("findBottom(): currentBottom.parentName=='" + currentBottom.parentName + "', levelCount==" + levelCount);
        console.dir(currentBottom);
    }

    // console.log("findBottom(): currentBottom.parentName=='" + currentBottom.parentName + "', levelCount==" + levelCount);

    bottomProgram = currentBottom;
    console.log("\nfindParent(program): Found the bottom!");
    console.log("findBottom(): bottomProgram.name == '" + bottomProgram.name + "', bottomProgram.index == " + bottomProgram.index+ ".");

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

console.log("\nday7part1.js: Hello, World!");
output += "\\n\\\nday7part1.js: Hello, World!\\n\\\n";
var inputFileName = "attachments\\day7input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day7part1.js: About to read " + inputFileName + ".");
output += "day7part1.js: About to read " + inputFileName.replace("\\", "\\\\") + ".\\n\\\n";

readInputFile(inputFile, processLine);