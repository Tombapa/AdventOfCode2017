var output = "<pre>\n\
day5part2.js: Hello, World!\n\
day5part2.js: About to read attachments\\day5input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): remaining=='-1074'.\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().\n\
afterReading(): I have now read lines 1-1090, list[1090]==-1074.\n\
cpuOnTheMove(): I'm on the move!\n\
jumpFrom(1): Step 0. I'm at list[1]==2. Outcome: list[1]==3, nextIndex==3.\n\
jumpFrom(3): Step 1. I'm at list[3]==2. Outcome: list[3]==3, nextIndex==5.\n\
jumpFrom(5): Step 2. I'm at list[5]==-2. Outcome: list[5]==-1, nextIndex==3.\n\
jumpFrom(3): Step 3. I'm at list[3]==3. Outcome: list[3]==2, nextIndex==6.\n\
jumpFrom(6): Step 4. I'm at list[6]==1. Outcome: list[6]==2, nextIndex==7.\n\
... \n\
jumpFrom(224): Step 388615. I'm at list[224]==3. Outcome: list[224]==2, nextIndex==227.\n\
... \n\
jumpFrom(549): Step 9999999. I'm at list[549]==3. Outcome: list[549]==2, nextIndex==552.\n\
... \n\
jumpFrom(833): Step 19999998. I'm at list[833]==2. Outcome: list[833]==3, nextIndex==835.\n\
... \n\
jumpFrom(1088): We're out, nextIndex==1091.\n\
cpuOnTheMove(): Whew, I finally got out!\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The correct answer is <span id=\"result\">27763113</span><span id=\"mask\">[hover]</span> steps.</strong></div></pre>";

document.getElementById("day5part2").innerHTML = output;