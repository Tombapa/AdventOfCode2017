var fs = require('fs');
var list = [];
var linenumber = 0;
var stepsTaken = 0;
var currentIndex = null;
var nextIndex = 1;
var foundMyWayOut = false;

var stepLogLimit = 4;

function readInputFile(inputFile, processLine) {
    console.log("readInputFile(inputFile, processLine): start.");
    var remaining = '';
    try {
        inputFile.on('data', function(data) {
            console.log("readInputFile(inputFile, processLine).inputFile.on('data', function(data)).");
            remaining += data;
            var index = remaining.indexOf('\n');
            var last  = 0;
            while (index > -1) {
                var line = remaining.substring(last, index - 1);
                last = index + 1;
                processLine(line);
                index = remaining.indexOf('\n', last);
            }
            remaining = remaining.substring(last);
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, processLine): Epic fail at inputFile.on('data', function(data)). **\n" + e);
    }
    
    try {
        inputFile.on('end', function() {
            if (remaining.length > 0) {
                console.log("readInputFile(inputFile, processLine).inputFile.on('end, function()): remaining=='" + remaining + "'.");
                processLine(remaining);
            }
            console.log("readInputFile(inputFile, processLine).inputFile.on('end, function()): moving to afterReading().");
            afterReading();
        });
    }
    catch (e) {
        console.log("** readInputFile(inputFile, processLine): Epic fail at inputFile.on('end, function()). **\n" + e);
    }
    
    // console.log("readInputFile(inputFile, processLine): the very end, there's nothing to see here.");
}



function processLine(data) {
    linenumber++;
    // console.log("processLine(data): start, linenumber==" + linenumber + ".");
    try {
        list[linenumber] = parseInt(data);
        // console.log(input[linenumber]);
    }
    catch (e) {
        console.log("** processLine(data): Epic fail at processLine(data) with data==" + data + " at linenumber==" + linenumber + ". **\n" + e);
    }
    // console.log("processLine(data): end, linenumber==" + linenumber + ".");
}


function afterReading() {
    console.log(
        "afterReading(): I have now read " + inputFileName + ", " + linenumber + " lines to be exact "
        + "(list[" + linenumber + "] == " + list[linenumber] + ")."
    );
    cpuOnTheMove();
}


function cpuOnTheMove() {
    currentIndex = 1;
    // console.log("cpuOnTheMove(): I'm on the move, currently at " + currentIndex + " having list[" + currentIndex + "]==" + list[currentIndex] + "!");
    
    while (stepsTaken < 50000000 && !foundMyWayOut) {
        // console.log("cpuOnTheMove(): I'm taking step " + stepsTaken + " to at " + currentIndex + " having list[" + currentIndex + "]==" + list[currentIndex] + "!");
        currentIndex = nextIndex;
        nextIndex = null;
        jumpFrom(currentIndex);
    }
    // Finally

    if (foundMyWayOut) {
        console.log("cpuOnTheMove(): Whew, I finally got out! I took " + stepsTaken + " steps."); 
    }
    else {
        console.log("cpuOnTheMove(): I was interrupted after " + stepsTaken + " steps."); 
    }
}


function jumpFrom(index) {
    
    // console.log("jumpFrom(" + index + "): Step " + stepsTaken + ". I'm at list[" + index + "]==" + list[index] + ".");

    // var images = [];
    // images[0] = {type: "pre", name:"index", value: index};
    // images[1] = {type: "pre", name:"value", value: list[index]};
    // images[2] = {type: "post", name:"index", value: (index + list[index])};
    // images[3] = {type: "post", name:"value", value: (list[index] + 1)};
    // console.dir(images);

    nextIndex = index + list[index];
    if(list[index] >= 3) {
        list[index]--;
    }
    else {
        list[index]++;
    }

    // Log
    if (
        stepsTaken <= stepLogLimit 
        || stepsTaken % 999 == 0
        || stepsTaken > 388615

    ) {
        if (stepsTaken != stepLogLimit) {
            // console.log("jumpFrom(" + index + "): Outcome: list[" + index + "]==" + list[index] + ", nextIndex==" + nextIndex + ".");
        }
        else if (stepsTaken == stepLogLimit) {
            console.log("jumpFrom(" + index + "): ... ");
        }
    }

    stepsTaken++;

    // Are we there yet?
    if (!nextIndex || nextIndex < 1 || nextIndex > linenumber) {
        // Log and commit exit routine.
        console.log("jump(" + index + "): I got out because nextIndex==" + nextIndex + ", and I only had to take " + stepsTaken + " steps."); 
        foundMyWayOut = true;
    }
}

// function jump(index) {
//     // Are we there yet?
//     if (!index || index < 1 || index > linenumber) {
//         // Log and commit exit routine.
//         console.log("jump(" + index + "): I won't take a step now as I'm already outside the list! index==" + index); 
//         foundMyWayOut = true;
//     } else {
//         stepsTaken++;
//         console.log("jump(" + index + "): Step " + stepsTaken + ". I'm at list[" + index + "]==" + list[index] + ".");
//         // Take the step

//         var images = [];
//         images[0] = {type: "pre", name:"index", value: index};
//         images[1] = {type: "pre", name:"value", value: list[index]};
//         images[2] = {type: "post", name:"index", value: (index + list[index])};
//         images[3] = {type: "post", name:"value", value: (list[index] + 1)};

//         console.dir(images);

//         // var preIndex = index;
//         // var preValue = list[index];
//         // var postIndex = preIndex + preValue;
//         // var postValue = preValue++;




//         nextIndex = index + list[index];
//         list[index]++;
        
//         // Log
//         if (
//             stepsTaken <= stepLogLimit 
//             || stepsTaken % 999 == 0
//             || stepsTaken > 388615

//         ) {
//             if (stepsTaken != stepLogLimit) {
//                 console.log("jump(" + index + "): Step " + stepsTaken + ". I increased list[" + index + "] value to " + list[index] + " and have also set a new value for nextIndex==" + nextIndex + ".");
//             }
//             else if (stepsTaken == stepLogLimit) {
//                 console.log("jump(" + index + "): ... ");
//             }
//         }
//     }
// }


console.log("\nday5part2.js: Hello, World!");
var inputFileName = "attachments\\day5input.txt";
var inputFile = fs.createReadStream(inputFileName);
console.log("day5part2.js: About to read " + inputFileName + ".");

readInputFile(inputFile, processLine);