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


Program.prototype.getCombinedWeightByName(name) = function() {
    for (i = 0; i < programs.length; i++) {
        if (!((programs[i].name < name) || (programs[i].name > name))) {            
            var chilrdensWeight = function () {
                var sum = 0;
                for (j = 0; j < programs[i].children.length; j++) {
                    sum += getCombinedWeightByName(programs[i].children[j]);
                }
                return sum;
            };
            return programs[i].weight + chilrdensWeight();
        }
        // else {}
    }
    // console.log("findIndexByName(" + name + "): Didn't find a thing!");
    return null;
}

Program.prototype.getChildWithWrongSize = function() {
    for (i = 0; i < this.children.length - 1; i++) {
        for (j = i + 1; j < this.children.length; j++) {
            if (getCombinedWeightByName(this.children[i]) == getCombinedWeightByName(this.children[j])) {
                // both are ok, especially j;
            }

        }
    }
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

// function dirProgramByIndex(index) {
//     console.log("\ndirProgramByIndex(" + index + ")");
//     console.dir(programs[index]);
// }




function afterReading() {
    console.log("afterReading(): I have now read lines 1-" + programnumber + ", programs[(programs.length - 1)] ==" + programs[programs.length - 1] + ".");
    output += "afterReading(): I have now read lines 1-" + programnumber + ", programs[(programs.length - 1)] ==" + programs[programs.length - 1] + ".\\n\\\n";  

    buildPrograms();
    findBottom();
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




// function cpuOnTheMove() {
//     currentIndex = 1;
//     console.log("cpuOnTheMove(): I'm on the move!");
//     output += "cpuOnTheMove(): I'm on the move!\\n\\\n";
    
//     while (stepsTaken < 500000 && !foundMyWayOut) {
//         // console.log("cpuOnTheMove(): I'm taking step " + stepsTaken + " to at " + currentIndex + " having list[" + currentIndex + "]==" + list[currentIndex] + "!");
//         currentIndex = nextIndex;
//         nextIndex = null;
//         jumpFrom(currentIndex);
//     }
//     // Finally

//     if (foundMyWayOut) {
//         console.log("cpuOnTheMove(): Whew, I finally got out! I took " + stepsTaken + " steps."); 
//         output += "cpuOnTheMove(): Whew, I finally got out!\\n\\\n";
//         output += "\\n\\\n<div class=\\\"result\\\"><strong>Part 1 completed. The correct answer is ";
//         output += "<span id=\\\"result\\\">" + stepsTaken + "</span>";
//         output += "<span id=\\\"mask\\\">[hover]</span>";
//         output += " steps.</strong></div>";
//         output += "</pre>\";\n";
//     }
//     else {
//         console.log("cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps."); 
//         output += "cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps.</pre>\";\n";
//     }
//     // document.getElementById("day5part1").innerHTML = output;
//     writeOutputFile(output, "day5part1");
// }


// function jumpFrom(index) {
    
//     var entry = "jumpFrom(" + index + "): Step " + stepsTaken + ". I'm at list[" + index + "]==" + list[index] + ". ";

//     nextIndex = index + list[index];
//     list[index]++;

//     // Log
//     if (
//         stepsTaken <= stepLogLimit 
//         || stepsTaken % 99999 == 0
//         || stepsTaken == 388615

//     ) {
//         entry += "Outcome: list[" + index + "]==" + list[index] + ", nextIndex==" + nextIndex + ".";
//         if (stepsTaken >= stepLogLimit) {
//             entry += "\\n\\\n... ";
//         }
//         console.log(entry);
//         output += entry + "\\n\\\n";
//     }

//     stepsTaken++;

//     // Are we there yet?
//     if (!nextIndex || nextIndex < 1 || nextIndex > linenumber) {
//         // Log and commit exit routine.
//         console.log("jumpFrom(" + index + "): We're out, nextIndex==" + nextIndex + ".");
//         output += "jumpFrom(" + index + "): We're out, nextIndex==" + nextIndex + ".\\n\\\n";
//         // console.log("And I only had to take " + stepsTaken + " steps."); 
//         foundMyWayOut = true;
//     }
// }


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