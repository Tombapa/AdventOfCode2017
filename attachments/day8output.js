var output = "<pre>\n\
startday8(): Hello, World!\n\
startday8(): About to read attachments\\day8input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().\n\
\n\
afterReading(): Start! Up next: createRegisters(), parseCommands(), execCommands(), findBiggestRegister().\n\
parseCommands(): Start!\n\
parseCommands(): Done, registers.length == 25.\n\
parseCommands(): Start!\n\
parseCommands(): Done! For reference:\n\
\t1: '[g == 0] dec 231 if ([bfx == 0] > -10)' (evaluated true)\n\
\t1000: '[afu == 0] dec 990 if ([wfk == 0] < -1202)' (evaluated false)\n\
\tregisters[0]: [a == 0]\n\
\tregisters[24]: [yo == 0]\n\
execCommands(): Start!\n\
execCommands(): 1: '[g == 0] dec 231 if ([bfx == 0] > -10)' (evaluated true)\n\
execCommands(): 2: '[k == 0] dec -567 if ([wfk == 0] == 0)' (evaluated true)\n\
execCommands(): 3: '[jq == 0] inc 880 if ([a == 0] < 2)' (evaluated true)\n\
execCommands(): 4: '[sh == 0] inc -828 if ([nkr == 0] < -5)' (evaluated false)\n\
execCommands(): ...\n\
execCommands(): 1000: '[afu == 600] dec 990 if ([wfk == -1203] < -1202)' (evaluated true)\n\
execCommands(): Done!\n\
afterReading(): findBiggestRegister() completed!\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The bottom program is <span id=\"result\">4163</span><span id=\"mask\">[hover]</span> at register 'm'.</strong></div>\n\
\n\
<div class=\"result\"><strong>Part 2 completed. The peak highest value was <span id=\"result\">5347</span><span id=\"mask\">[hover]</span>.</strong></div></pre>";

document.getElementById("day8").innerHTML = output;