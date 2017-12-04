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

// var segmentNumber = 1;
var segmentLength = 1;
var segmentStepsTaken = 0;

// var logIndex = 2;

var output = "<pre>";


try {
    while (index <= input) {
        // Log, if needed
        if (index < 8) {
            output += "\nI'm at <strong>index " + index + "</strong> with these values:";
            output += "\n    direction==" + direction.name + ", posX==" + posX + ", posY=="+ posY + ", manhattanDistance==" + manhattanDistance;
        }
        else if (index == 8) {
            output += "\n...";
        }
        else if ((posX + posY > 1) && (manhattanDistance + posX + posY) % ((posX + posY + segmentStepsTaken) * 50) == 0) {
            output += "\nI'm at <strong>index " + index + "</strong> with these values:";
            output += "\n    direction==" + direction.name + ", posX==" + posX + ", posY=="+ posY + ", manhattanDistance==" + manhattanDistance;
            output += "\n...";
        }

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
    output += "<span id=\"result\">" + manhattanDistance + "</span>";
    output += "<span id=\"mask\">[hover]</span>";
    output += ".</strong></div> \n";
    output += "</pre>";
    document.getElementById("day3part1").innerHTML = output;

}
catch (e) {
    console.log(e);
    console.log("Epic fail! Values index==" + index + ", posX==" + posX + ", posY=="+ posY + ", manhattanDistance==" + manhattanDistance);
}