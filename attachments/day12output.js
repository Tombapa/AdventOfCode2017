var output = "<pre>\n\
day12(): Hello, World! About to read attachments\\day12input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): almost done! Proceeding to the next function.\n\
\n\
parsePrograms(): start, populate programs[].\n\
\n\
new Program(0)\n\
Program 0\n\
\n\
new Program(3)\n\
Program 3\n\
\n\
new Program(9)\n\
Program 9\n\
\n\
parsePrograms(): connect programs.\n\
Program 0 <-> 1352, 1864\n\
Program 3 <-> 303, 363, 635\n\
Program 9 <-> 577, 1274, 1347\n\
\n\
parsePrograms(): done!\n\
\n\
getConnectedPrograms(0): start, amountOfGroups == 1.\n\
getConnectedPrograms(0): 37 is the last level.\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The correct answer is <span id=\"result\">169</span><span id=\"mask\">[hover]</span> programs connected to 0.</strong></div>\n\
getConnectedPrograms(9): start, amountOfGroups == 9.\n\
getConnectedPrograms(9): 6 is the last level.\n\
...\n\
\n\
<div class=\"result\"><strong>Part 2 completed. The correct answer is <span id=\"result\">179</span><span id=\"mask\">[hover]</span> groups.</strong></div>\n\
</pre>";

document.getElementById("day12").innerHTML = output;