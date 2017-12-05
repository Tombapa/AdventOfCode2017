var fs = require('fs');
var input = [];
var linenumber = 0;
var uniquePassphrases = 0;


function readLines(input, func) {
    // var linenumber = 0;
    var remaining = '';
    
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;
        while (index > -1) {
            var line = remaining.substring(last, index - 1);
            last = index + 1;
            // linenumber++;
            func(line);
            index = remaining.indexOf('\n', last);
        }
        remaining = remaining.substring(last);
    });
  
    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
        console.log("\nWhew, I think I'm done! I've validated " + linenumber + " passphrases. \n\n" + uniquePassphrases + " of them were ok.\n");
    });
}


function func(data) {
    //   console.log('Line: ' + data);
    // input[linenumber] == data.split('\t');
    linenumber++;
    input[linenumber] = data.split(' ');
    // if (linenumber < 20) {
        // console.log("I'm func(data) at line " + linenumber);
        // console.dir(input[linenumber]);
    // }
    if (validatePassphrase(input[linenumber])) {
        uniquePassphrases++;
    }
    
}


function validatePassphrase(line) {
    // console.log("\tvalidatePassphrase(" + linenumber + ")");
    var duplicateFound = false;
    
    // Sort word-based char arrays to easy palindrome recognition
    for (i = 0; i < line.length; i++) {
        line[i] = line[i].split('').sort();
    }
    

    // console.dir(line);
    for (j = 0; j < (line.length - 1); j++) {
        // console.log("  I'm comparing column " + j + "...");
        var strA = line[j].join('');
        for (k = (j + 1); k < line.length; k++) {
            // console.log("    ... to column " + k);
            var strB = line[k].join('');
            // console.log("      [" + j + "][" + k + "]: " + strA + ", " + strB);
            if (!(strA < strB || strA > strB)) {
                console.log("\t\t** I've found a match at indexes [" + j + "] and [" + k + "]" + "! **");
                if (linenumber == 3 || linenumber == 8) {
                    console.log("\t\t** strA==" + strA + ", strB==" + strB + " **");
                }
                duplicateFound = true;
                break;
            }
        }
        if (duplicateFound) {
            break;
        }
    }
    console.log("\tvalidatePassphrase(" + linenumber + "): It's "+ !duplicateFound +" to say this one is valid.");
    return !duplicateFound;
}


var inputfile = fs.createReadStream('attachments\\day4input.txt');
readLines(inputfile, func);