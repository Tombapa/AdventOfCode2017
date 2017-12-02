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

var checksum = 0;
var cutoff = 5;


for (i = 0; i < input.length; i++) {
    var entry = "";
    var row = input[i].split('\t');
    var min = 0;
    var max = 0;
    for (j = 0; j < row.length; j++) {
        var cell = parseInt(row[j]);
        if (min == 0 && max == 0) {
            if (i < cutoff) {
                entry += "\nRow " + i + ": set initial min anx max value " + cell + " at column " + j;
            }
            min = cell;
            max = cell;
        }
        else if (cell < min) {
            if (i < cutoff) {
                entry += "\nRow " + i + ": new min value " + cell + " at column " + j;
            }
            min = cell;
        }
        else if (cell > max) {
            if (i < cutoff) {
                "\nRow " + i + ": new max value " + cell + " at column " + j;
            }
            max = cell;
        }
    }
    checksum += max - min;
    if (i < cutoff) {
        entry += "\nRow " + i + ": min == " + min + ", max == " + max + ", diff == " + (max - min) + ", checksum == " + checksum;
    }
    else if (i == cutoff) {
        entry += "\n...";
    }
    if (i <= cutoff) {
        console.log(entry);
    }
}
console.log("Checksum == " + checksum);