var output = "<pre>\n\
day5part1.js: Hello, World!\n\
day5part1.js: About to read attachments\\day5input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='-1074'.\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().\n\
afterReading(): I have now read lines 1-1090, list[1090]==-1074.\n\
cpuOnTheMove(): I'm on the move!\n\
jumpFrom(1): Step 0. I'm at list[1]==2. Outcome: list[1]==3, nextIndex==3.\n\
jumpFrom(3): Step 1. I'm at list[3]==2. Outcome: list[3]==3, nextIndex==5.\n\
jumpFrom(5): Step 2. I'm at list[5]==-2. Outcome: list[5]==-1, nextIndex==3.\n\
jumpFrom(3): Step 3. I'm at list[3]==3. Outcome: list[3]==4, nextIndex==6.\n\
jumpFrom(6): Step 4. I'm at list[6]==1. Outcome: list[6]==2, nextIndex==7.\n\
... \n\
jumpFrom(364): Step 99999. I'm at list[364]==-68. Outcome: list[364]==-67, nextIndex==296.\n\
... \n\
jumpFrom(616): Step 199998. I'm at list[616]==-472. Outcome: list[616]==-471, nextIndex==144.\n\
... \n\
jumpFrom(675): Step 299997. I'm at list[675]==66. Outcome: list[675]==67, nextIndex==741.\n\
... \n\
jumpFrom(614): We're out, nextIndex==1091.\n\
cpuOnTheMove(): Whew, I finally got out!\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The correct answer is <span id=\"result\">388611</span><span id=\"mask\">[hover]</span> steps.</strong></div></pre>";

document.getElementById("day5part1").innerHTML = output;