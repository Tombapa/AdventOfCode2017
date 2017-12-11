var output = "<pre>\n\
day7part2.js: Hello, World!\n\
day7part2.js: About to read attachments\\day7input.txt.\n\
readInputFile(inputFile, processLine): start.\n\
readInputFile(inputFile, processLine).inputFile.on('data', function(data)).\n\
readInputFile(inputFile, processLine).inputFile.on('end', function()): moving to afterReading().\n\
afterReading(): I have now read lines 1-1337, reports[(reports.length - 1)] == 'undefined'.\n\
buildPrograms(): begin!\n\
buildProgram(): completed! The program at the largest index is 'ohsvn' (19, 19) of 'gibdxij'\n\
findBottom(): currentBottom == 'emuwzd' (102, 130) of 'iitbuxz' \n\
\thaving children [\n\
\t  'ifyzcgi' (14, 14), \n\
\t  'edotax' (14, 14)\n\
\t], levelCount == 1\n\
findBottom(): currentBottom == 'iitbuxz' (1186, 1576) of 'hjmtrw' \n\
\thaving children [\n\
\t  'eexmf' (130, 130), \n\
\t  'emuwzd' (102, 130), \n\
\t  'zzbad' (30, 130)\n\
\t], levelCount == 2\n\
findBottom(): ... \n\
findBottom(): Found the bottom! bottomProgram.name == 'wiapj', bottomProgram.index == 1333.\n\
findBottom(): Found the bottom!\n\
\n\
<div class=\"result\"><strong>Part 1 completed. The bottom program is <span id=\"result\">wiapj</span><span id=\"mask\">[hover]</span>.</strong></div>\n\
findDestabilizingDescendant(): ...\n\
findDestabilizingDescendant(): current program is 'lsire' (61685, 88563) of 'wiapj' \n\
\thaving children [\n\
\t  'locrtxl' (2681, 8957), \n\
\t  'shlfz' (3932, 8957), \n\
\t  'ycpcv' (72, 8964)\n\
\t].\n\
findDestabilizingDescendant(): current program is 'ycpcv' (72, 8964) of 'lsire' \n\
\thaving children [\n\
\t  'izdhn' (1183, 1777), \n\
\t  'yzhvrx' (90, 1777), \n\
\t  'eionkb' (1079, 1784), \n\
\t  'eadvs' (797, 1777), \n\
\t  'jkkqxfr' (1135, 1777)\n\
\t].\n\
findDestabilizingDescendant(): ...\n\
findDestabilizingDescendant(): The closest-to-bottom program without destabilizing child \n\
is <strong>'eionkb' (1079, 1784) of 'ycpcv' \n\
\thaving children [\n\
\t  'hxmcaoy' (235, 235), \n\
\t  'sybpg' (49, 235), \n\
\t  'jfhqrla' (155, 235)\n\
\t]</strong>.\n\
findDestabilizingDescendant(): Its parent is 'ycpcv' (72, 8964) of 'lsire' \n\
\thaving children [\n\
\t  'izdhn' (1183, 1777), \n\
\t  'yzhvrx' (90, 1777), \n\
\t  'eionkb' (1079, 1784), \n\
\t  'eadvs' (797, 1777), \n\
\t  'jkkqxfr' (1135, 1777)\n\
\t] <strong>with median combined weigth 1777</strong>.\n\
findDestabilizingDescendant(): Whew, I'm done, finally!\n\
\n\
<div class=\"result\"><strong>Part 2 completed. The correct weight would be <span id=\"result\">1072</span><span id=\"mask\">[hover]</span>.</strong></div></pre>";

document.getElementById("day7part2").innerHTML = output;