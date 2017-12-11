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
var destabilizingProgram = null;


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
    console.log("buildPrograms(): begin!");
    for (index = 1; index < reports.length; index++) {
        var currentReport = reports[index];
        // console.log("buildPrograms(): currentReport == '" + currentReport + "'.");
        var currentChildrenNames = null;
        if (currentReport[3] !== undefined) {
            currentChildrenNames = currentReport.slice(3);
        }
        var currentProgram = null;
        var existingProgramNumber = findIndexByName(reports[index][0]);
        if (existingProgramNumber == null) {         
            currentProgram = new Program(programnumber, currentReport[0], currentReport[1], currentChildrenNames, null);
            programs[programnumber] = currentProgram;
            // console.log("buildPrograms(): Added a new independent program '" + currentProgram.name + "'.");
            // console.dir(currentProgram);
            // console.log("buildPrograms(): currentProgram == " + currentProgram.toString());
            programnumber++;
        }
        else {
            currentProgram = programs[existingProgramNumber];
            currentProgram.weight = currentReport[1];
            currentProgram.children = currentChildrenNames;
            // console.log("buildPrograms(): Found an existing program '" + currentProgram.name + "', updated weight and children.");
            // console.dir(currentProgram);
            // console.log("buildPrograms(): currentProgram == " + currentProgram.toString());
        }
    
        if (currentChildrenNames != null && currentChildrenNames.length > 0) {    
            currentProgram.children = [];
            var parentName = currentReport[0];
            // console.log("buildPrograms(): Adding new childs for parent '" + parentName + "'.");
            // console.dir(currentChildrenNames);
            for (c = 0; c < currentChildrenNames.length; c++) {
                var childName = currentChildrenNames[c];
                // console.log("buildPrograms(): c==" + c + ", the child is (or will be) called currentChildrenNames[" + c + "]=='" + childName + "'.");
                try {
                    var currentChild = null;
                    var existingChildProgramNumber = findIndexByName(childName);
                    if (existingChildProgramNumber == null) {
                        currentChild = new Program(programnumber, childName, null, null, parentName);
                        programs[programnumber] = currentChild;
                        currentProgram.children[c] = currentChild;
                        // console.log("buildPrograms(): c==" + c + ". A new child is born with name=='" + currentChild.name + "').");
                        // console.dir(currentChild);
                        // console.log("buildPrograms(): currentChild == " + currentChild);
                        programnumber++;
                    }
                    else {
                        currentChild = programs[existingChildProgramNumber];
                        currentChild.parentName = parentName; 
                        currentChild.parent = currentProgram;
                        currentProgram.children[c] = currentChild;
                        // console.log("buildPrograms(): c==" + c + ". I was pointed an existing child with number " + existingChildProgramNumber + " (name=='" + currentChild.name + "').");
                        // console.dir(currentChild);
                        // console.log("buildPrograms(): currentChild == " + currentChild);
                    } 
                    currentChild.setCombinedWeight();  
                }
                catch (e) {
                    console.log("** buildPrograms(data): Epic fail at reports[" + i + "] with currentReport=='" + currentReport + "'. **\n" + e);
                    output += "** buildPrograms(data): Epic fail at reports[" + i + "] with currentReport=='" + currentReport + "'. **\\n\\\n" + e + "\\n\\\n";
                    needToStop = true;
                }
            }
        }
        else {
            currentProgram.setCombinedWeight();
        }
    }

    console.log("buildPrograms(): completed!");
    // console.dir(programs);

}


function Program(index, name, weight, childrenNames, parentName) {
    this.index = index;
    this.name = name;
    this.weight = weight;
    this.childrenNames = childrenNames;
    this.children = null;
    this.parentName = parentName;
    this.parent = (parentName != null) ? getProgramByName(parentName) : null;
    this.combinedWeight = weight;
}


Program.prototype.toString = function() {
    var output = "'" + this.name + "' (" + this.combinedWeight + ") of '" +  this.parentName + "'";
    if (this.children != null && this.children.length > 0) {
        output += " having children ";
        for (i = 0; i < this.children.length; i++) {
            output += "['" + this.children[i].name + "' (" + this.children[i].combinedWeight + ")]";
            if (i < this.children.length - 1) {
                output += ", ";
            }
        }
    }
    return output;
}


Program.prototype.setCombinedWeight = function() {
    this.combinedWeight = 0;
    if (this.weight != null) {
        this.combinedWeight += this.weight;
    }
    if (this.children != null && this.children.length > 0) {
        for (i = 0; i < this.children.length; i++) {
            this.combinedWeight += this.children[i].combinedWeight;
        }
    } 
    if (this.parentName != null) {
        // console.log("setCombinedWeight(): this.name=='" + this.name + "', this.combinedWeight==" + this.combinedWeight + ", this.parentName=='" + this.parentName + "'");
        this.parent.setCombinedWeight();
    }
    else {
        // console.log("setCombinedWeight(): this.name=='" + this.name + "', this.combinedWeight==" + this.combinedWeight + " - I'm done!");
    }
}


Program.prototype.findDestabilizingDescendant = function() {
    console.log("findDestabilizingDescendant(): this == [ " + this.toString() + " ]");
    if (this.children != null && this.children.length > 0) {
        // Choose the child which doesn't match
        // TODO: two childs, which one is incorrect?
        var currentMedianCombinedWeight = this.getMedianChildCombinedWeight();
        for (i = 0; i < this.children.length; i++) {
            if (
                destabilizingProgram == null 
                && this.children[i].combinedWeight != this.currentMedianCombinedWeight
            ) {
                this.children[i].findDestabilizingDescendant();
            }
        }
        if (destabilizingProgram == null) {
            // No destabilizing descendants were found
            console.log("findDestabilizingDescendant(): No destabilizing descendants were found. The destabilizing descendant is " + this.toString() + ".");
            console.dir(this);
            destabilizingProgram = this;
            return;
        }
        
    }
    else {
        // No children
        console.log("findDestabilizingDescendant(): No children. The destabilizing descendant is " + this.toString() + ".");
        console.dir(this);
        destabilizingProgram = this;
        return;
    }
}


Program.prototype.getMedianChildCombinedWeight = function() {
    // console.log("getMedianChildCombinedWeight(): this == [ " + this.toString() + " ]");
    var m = this.children.map(function(v) {
        return v.combinedWeight;
    }).sort(function(a, b) {
        return a - b;
    });
    var middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
    if (m.length % 2) {
        return m[middle];
    } else {
        return (m[middle] + m[middle + 1]) / 2.0;
    }
}


Program.prototype.getDestabilizingChild = function() {
    if (this.children == null || this.children.length == 0) {
        return null;
    }
    var currentMedianCombinedWeight = this.getMedianChildCombinedWeight();
    for (i = 0; i < this.children.length; i++) {
        if (this.children[i].combinedWeight != currentMedianCombinedWeight) {
            return this.children[i];
        }
    }
    return null;
}

// Program.prototype.getCombinedWeight = function() {
//     return this.weight + this.getChilrdensWeight();
// }

// Program.prototype.getChilrdensCombinedWeight = function() {
//     if (this.children != null) {
//         var sum = 0;
//         for (j = 0; j <this.children.length; j++) {
//             sum += this.children[j].combinedWeight;
//         }
//         return sum;
//     }
//     else {
//         // No childs
//         return 0;
//     } 
// }


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

// Program.prototype.getChildWithWrongSize = function() {
//     for (i = 0; i < this.children.length - 1; i++) {
//         for (j = i + 1; j < this.children.length; j++) {
//             if (getCombinedWeightByName(this.children[i]) == getCombinedWeightByName(this.children[j])) {
//                 // both are ok, especially j;
//             }

//         }
//     }
// }

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

    console.log("afterReading(): bottomProgram == " + bottomProgram.toString());
    console.log("afterReading(): bottomProgram.combinedWeight == " + bottomProgram.combinedWeight);
    // console.dir(programs);

    // bottomProgram.findDestabilizingDescendant();
    // console.log("afterReading(): destabilizingProgram == " + destabilizingProgram.toString());
    // console.log(destabilizingProgram.parent.toString());
    // console.log(destabilizingProgram.parent.parent.toString());
    
    // findDestabilizingProgram();
    findDestabilizingDescendant();
}


function findBottom() {
    console.log("\nfindBottom()");
    var currentBottom = programs[0];    // Any will do.
    console.log("findBottom(): currentBottom == [ " + currentBottom.toString() + " ], levelCount == " + levelCount);
    // console.dir(currentBottom);

    while (currentBottom.parentName != null) {
        currentBottom = programs[findIndexByName(currentBottom.parentName)];
        levelCount++;
        console.log("findBottom(): currentBottom == [ " + currentBottom.toString() + " ], levelCount == " + levelCount);
        // console.dir(currentBottom);
    }

    bottomProgram = currentBottom;
    console.log("\findBottom(): Found the bottom!");
    console.log("findBottom(): bottomProgram.name == '" + bottomProgram.name + "', bottomProgram.index == " + bottomProgram.index+ ".");

}


function findDestabilizingProgram() {
    for (i = 0; i < programs.length; i++) {
        console.log("findDestabilizingProgram(): i == " + i + ", " + programs[i].toString());
        if (programs[i].parent != null && programs[i].parentName != null) {
            if (
                programs[i].combinedWeight != programs[i].parent.getMedianChildCombinedWeight()
                && programs[i].cantBlambeChildren()
            ) {
                destabilizingProgram = programs[i];
                console.log("findDestabilizingProgram(): Match found! \n" + destabilizingProgram.toString() + "\n" + destabilizingProgram.parent.toString());
            }
        }
    }
}


function findDestabilizingDescendant() {
    console.log("findDestabilizingDescendant(): bottomProgram is " + bottomProgram.toString());
    var current = bottomProgram;
    var next = bottomProgram.getDestabilizingChild();
    while (next != null) {
        current = next;
        next = current.getDestabilizingChild()
    }
    console.log("findDestabilizingDescendant(): The closest-to-bottom program without destabilizing child is " + current.toString());
    console.log("findDestabilizingDescendant(): Its parent is " + current.parent.toString() + " with median combined weigth " + current.parent.getMedianChildCombinedWeight()); // 1777 is too high

    // Calculate target weight
    var result = current.parent.getMedianChildCombinedWeight() - (current.getMedianChildCombinedWeight() * current.children.length);
    // console.log(
    //     "findDestabilizingDescendant(): result == " + result 
    //     + ", current.getMedianChildCombinedWeight() == " + current.getMedianChildCombinedWeight()
    //     + ", current.children.length == " + current.children.length
    // );
    console.log("findDestabilizingDescendant(): I'm done! The correct solution is to decrease 'current' weight from " + current.weight + " to " + result + ".");
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