var input = 289326;

var directions = [];
directions[0] = {name:"right", axis:"X", positive:true, nextDirection:null};
directions[1] = {name:"up", axis:"Y", positive:true, nextDirection:null};
directions[2] = {name:"left", axis:"X", positive:false, nextDirection:null};
directions[3] = {name:"down", axis:"Y", positive:false, nextDirection:null};
directions[0].nextDirection = directions[1];
directions[1].nextDirection = directions[2];
directions[2].nextDirection = directions[3];
directions[3].nextDirection = directions[0];

var index = 1;
var direction = directions[0];
var posX = 0;
var posY = 0;
var manhattanDistance = 0;

var segmentLength = 1;
var segmentStepsTaken = 0;

var output = "<pre>";

var safetyLimit = 70;
var correctAnswer = null;

var cells = [];

// Create cells[i]
cells[1] = new function() {
    this.x = posX;
    this.y = posY;
    this.isAdjacent = function(current) {
        try {
            if ((Math.abs(this.x - current.x) <= 1) && (Math.abs(this.y - current.y) <= 1)) {
                return true;
            }
            else {
                return false
            }
        }
        catch (e) {
            console.log("Epic fail at cell[posX==" + posX + ", posY==" + posY + "]! Values x==" + this.x + ", y==" + this.y  + ", manhattanDistance==" + manhattanDistance);
            console.log(e);
        }
    }, 
    this.value = 1;
}

// Initial log
output += "\n<strong>Start!</strong> I'm at <strong>index " + index + "</strong> and created cells[1] with values: \n    x==" + cells[1].x + ", y==" + cells[1].y + ", value=="+ cells[1].value + " (manhattanDistance==" + manhattanDistance + ")\n";


function calculateCellValue(current) {
    var sum = 0;
    for (i=1; i<index; i++) {
        if(cells[i].isAdjacent(current)) {
            sum += cells[i].value;
        }
    }
    if (sum > input) {
        // inputValueExceeded = true;
        correctAnswer = sum;
    }
    return sum;
}

// Create cells[2...n]
try {
    while (!correctAnswer && index < safetyLimit) {

        // Take step.
        index++;
        segmentStepsTaken++;
    
        // Calculate relative position
        if (direction.positive) {
            if (direction.axis == "X") {
                posX++;
            }
            else {
                posY++;
            }
        }
        else {
            if (direction.axis == "X") {
                posX--;
            }
            else {
                posY--;
            }
        }
        manhattanDistance = Math.abs(posX) + Math.abs(posY);

        // Create cell
        try {
            cells[index] = new function() {
                this.x = posX;
                this.y = posY;
                this.isAdjacent = function(current) {
                    try {
                        if ((Math.abs(this.x - current.x) <= 1) && (Math.abs(this.y - current.y) <= 1)) {
                            return true;
                        }
                        else {
                            return false
                        }
                    }
                    catch (e) {
                        console.log("Epic fail at cell[posX==" + posX + ", posY==" + posY + "]! Values x==" + this.x + ", y==" + this.y  + " at manhattanDistance==" + manhattanDistance);
                        console.log(e);
                    }
                }, 
                // this.value = null;
                this.value = calculateCellValue(this);

                // Log, if needed
                if (index < 4) {
                    output += "\nI'm at <strong>index " + index + "</strong> and created cells[1] with values: \n    x==" + cells[1].x + ", y==" + cells[1].y + ", value=="+ cells[1].value + " (manhattanDistance==" + manhattanDistance + ")\n";
                }
                else if (index == 4) {
                    output += "\n...";
                }
                else if ((posX + posY > 1) && (manhattanDistance + posX + posY) % ((posX + posY + segmentStepsTaken) * 2) == 0) {
                    output += "\nI'm at <strong>index " + index + "</strong> and created cells[1] with values: \n    x==" + cells[1].x + ", y==" + cells[1].y + ", value=="+ cells[1].value + " (manhattanDistance==" + manhattanDistance + ")\n";
                    output += "\n...";
                }
            }
        }
        catch (e) {
            console.log("Epic fail at cells[" + index +"]! Values posX==" + posX + ", posY==" + posY + " at manhattanDistance==" + manhattanDistance);
            console.log(e);
        }

        // Break or turn if needed
        if (index == input) {
            break;
        }
        else if (segmentLength - segmentStepsTaken == 0) {
            direction = direction.nextDirection;
            if (direction.axis == "X") {
                segmentLength++;
            } 
            segmentStepsTaken = 0;
        }
    }
    // console.log("Done, index==" + index + ", posX==" + posX + ", posY=="+ posY + ", manhattanDistance==" + manhattanDistance);

    output += "\n<strong>Hooray! I'm at index " + index + "!</strong>\n";

    output += "\n<div class=\"result\"><strong>Part 1 completed. The correct answer is ";
    output += "<span id=\"result\">" + correctAnswer + "</span>";
    output += "<span id=\"mask\">[hover]</span>";
    output += ".</strong></div> \n";
    output += "</pre>";
    document.getElementById("day3part2").innerHTML = output;

}
catch (e) {
    console.log("Epic fail! Values index==" + index + ", posX==" + posX + ", posY=="+ posY + ", manhattanDistance==" + manhattanDistance);
    console.log(e);
}