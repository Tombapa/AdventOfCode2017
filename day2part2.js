var input = []; 
input[0] = "1224	926	1380	688	845	109	118	88	1275	1306	91	796	102	1361	27	995";
input[1] = "1928	2097	138	1824	198	117	1532	2000	1478	539	1982	125	1856	139	475	1338";
input[2] = "848	202	1116	791	1114	236	183	186	150	1016	1258	84	952	1202	988	866";
input[3] = "946	155	210	980	896	875	925	613	209	746	147	170	577	942	475	850";
input[4] =  "1500	322	43	95	74	210	1817	1631	1762	128	181	716	171	1740	145	1123";
input[5] =  "3074	827	117	2509	161	206	2739	253	2884	248	3307	2760	2239	1676	1137	3055";
input[6] =  "183	85	143	197	243	72	291	279	99	189	30	101	211	209	77	198";
input[7] =  "175	149	259	372	140	250	168	142	146	284	273	74	162	112	78	29";
input[8] =  "169	578	97	589	473	317	123	102	445	217	144	398	510	464	247	109";
input[9] =  "3291	216	185	1214	167	495	1859	194	1030	3456	2021	1622	3511	222	3534	1580";
input[10] =  "2066	2418	2324	93	1073	82	102	538	1552	962	91	836	1628	2154	2144	1378";
input[11] =  "149	963	1242	849	726	1158	164	1134	658	161	1148	336	826	1303	811	178";
input[12] =  "3421	1404	2360	2643	3186	3352	1112	171	168	177	146	1945	319	185	2927	2289";
input[13] =  "543	462	111	459	107	353	2006	116	2528	56	2436	1539	1770	125	2697	2432";
input[14] =  "1356	208	5013	4231	193	169	3152	2543	4430	4070	4031	145	4433	4187	4394	1754";
input[15] =  "5278	113	4427	569	5167	175	192	3903	155	1051	4121	5140	2328	203	5653	3233";
// console.dir(input);

var sum = 0;
var cutoffRow = 4;
var rowmatch = false;

var output = "<pre>";
output += "\nEnter row loop - " + input.length + " rounds.";
for (i = 0; i < input.length; i++) {
    var entry = "";
    var row = input[i].split('\t');
    var col1 = 0;
    var col2 = 0;
    rowmatch = false;
    // console.log("i==" + i + ", rowmatch==" + rowmatch);

    for (j = 0; j < row.length; j++) {
        // console.log("i==" + i + ", j==" + j + ", rowmatch==" + rowmatch);
        col1 = parseInt(row[j]);
        for (k = (j + 1); k < row.length; k++) {
            // console.log("i==" + i + ", j==" + j + ", k==" + k + ", rowmatch==" + rowmatch);
            col2 = parseInt(row[k]);
            if (col1 % col2 == 0) {
                // console.log("Match A! j==" + j + ", k==" + k + ", col1==" + col1 + ", col2==" + col2 + ".");
                var div = col1 / col2;
                sum += div;
                rowmatch = true;
                entry += "\n    Row " + i + ": match A found! \n\t(j==" + j + ", k==" + k + ", col1==" + col1 + ", col2==" + col2 + ", div==" + div + ", sum==" + sum + ")";
                // console.log("A");
            }
            else if (col2 % col1 == 0) {
                // console.log("Match B! j==" + j + ", k==" + k + ", col1==" + col1 + ", col2==" + col2 + ".");
                var div = col2 / col1;
                sum += div;
                rowmatch = true;
                entry += "\n    Row " + i + ": match B found! \n\t(k==" + k + ", j==" + j + ", col2==" + col2 + ", col1==" + col1 + ", div==" + div + ", sum==" + sum + ")";
                // console.log("B");
            }
            if (rowmatch) {
                break;
            }
        }
        if (rowmatch) {          
            break;
        }
    }
    if (i < cutoffRow) {
        output += entry;
    }
    else if (i == cutoffRow) {
        output += "\n\t...";
    }
}

output += "\nRow loop completed. \n";
output += "\n<div class=\"result\"><strong>Part 2 completed. The correct answer is ";
output += "<span id=\"result\">" + sum + "</span>";
output += "<span id=\"mask\">[hover]</span>";
output += ".</strong></div> \n";
output += "</pre>";
document.getElementById("day2part2").innerHTML = output;