var output = "<pre>\n\
day8(): Hello, World!\n\
day8(): About to read attachments\\day8input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
\t ... inputFile.on('data', function(data)).\n\
\t... inputFile.on('end', function()): moving to afterReading().\n\
\n\
afterReading(): Start! \n\
\tUp next: createRegisters(), parseCommands(), execCommands(), findBiggestRegister().\n\
\n\
createRegisters(): Start!\n\
createRegisters(): Done, registers.length == 25.\n\
\tregisters[0]: [a == 0]\n\
\tregisters[24]: [yo == 0]\n\
\n\
parseCommands(): Start!\n\
parseCommands(): Done! For reference:\n\
\t1: '[g == 0] dec 231 if ([bfx == 0] > -10)' (evaluated true)\n\
\t1000: '[afu == 0] dec 990 if ([wfk == 0] < -1202)' (evaluated false)\n\
\n\
execCommands(): Start!\n\
\t1: '[g == 0] dec 231 if ([bfx == 0] > -10)' (evaluated true)\n\
\t2: '[k == 0] dec -567 if ([wfk == 0] == 0)' (evaluated true)\n\
\t3: '[jq == 0] inc 880 if ([a == 0] < 2)' (evaluated true)\n\
\t4: '[sh == 0] inc -828 if ([nkr == 0] < -5)' (evaluated false)\n\
\t...\n\
\t1000: '[afu == 600] dec 990 if ([wfk == -1203] < -1202)' (evaluated true)\n\
execCommands(): Done!\n\
\n\
afterReading(): findBiggestRegister() completed!\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The bottom program is <span id=\"result\">4163</span><span id=\"mask\">[hover]</span> at register 'm'.</strong></div>\n\
\n\
<div class=\"result\"><strong>Part 2 completed. The peak highest value is <span id=\"result\">5347</span><span id=\"mask\">[hover]</span>.</strong></div></pre>";

document.getElementById("day8").innerHTML = output;