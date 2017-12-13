var output = "<pre>\n\
day11(): Hello, World!\n\
\n\
day11(): Hello, World! About to read attachments\\day11input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
\t ... inputFile.on('data', function(data)).\n\
\t... inputFile.on('end', function()): moving to afterReading().\n\
\n\
afterReading(): Start!\n\
\n\
takeTheSteps(): Start!\n\
\n\
takeTheSteps(): smallestStepCount == 781\n\
\n\
takeTheSteps(): Start!\n\
\n\
takeTheSteps(): Completed! Reduced 7536 steps.\n\
\n\
takeTheSteps(): smallestStepCount == 687\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The result is <span id=\"result\">null</span><span id=\"mask\">[hover]</span> at somewhere 'null'.</strong></div>\n\
\n\
<div class=\"result\"><strong>Part 2 completed. The correct answer is <span id=\"result\">null</span><span id=\"mask\">[hover]</span>.</strong></div></pre>";

document.getElementById("day11").innerHTML = output;