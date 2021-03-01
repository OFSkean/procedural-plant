import { LindermayerSystem, ProductionRule } from "./LindermayerSystem.js"
import { ruleSets } from "./RuleSets.js"

const leafTypeToFunction = {
    'Regular': drawRegularLeaf,
    'Snowball': drawSnowballLeaf
}

var lSystem;
var plantString;
var parameters = {};

document.addEventListener("DOMContentLoaded", function() {
    addRulesetTypesToSelect();
    addLeafTypesToSelect();
    setSeedToCurrentTime();
    randomizeRenderValues();
    updateParameters();

    let defaultRuleSet = ruleSets[0];
    lSystem = new LindermayerSystem(defaultRuleSet.rules, defaultRuleSet.axiom, parameters.iterations);
    plantString = lSystem.generateString();
    renderPlant();
});

document.getElementById("settingsForm").addEventListener("input", function(e) {
    const changedParameterName = e.target.id;
    const newValue = e.target.value;

    // only recalculate the grammar if we have to
    if (changedParameterName == "seed") {
        Math.seedrandom(newValue);
        randomizeRenderValues();
        plantString = lSystem.generateString();
    } else if (changedParameterName == "iterations") {
        Math.seedrandom(newValue);
        lSystem[changedParameterName] = newValue;
        plantString = lSystem.generateString();
    } else if (changedParameterName == "type") {
        //update screen with default parameters of the new type
        updateFieldsWithTypeDefaults[ruleSets[newValue]];

        //update lsystem with new axiom/rules
        lSystem.rules = ruleSets[newValue].rules;
        lSystem.axiom = ruleSets[newValue].axiom;
        plantString = lSystem.generateString();
    }

    updateParameters();
    renderPlant();
});

document.getElementById("newPlantButton").onclick = function() {
    setSeedToCurrentTime();
    randomizeRenderValues();
    updateParameters();
    plantString = lSystem.generateString();
    renderPlant();

};

// creates a valid hexadecimal color code
function randomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');;
}

// creates a bunch of random values like branch length, color, etc
function randomizeRenderValues() {
    document.getElementById("branch.color").value = randomColor();
    document.getElementById("leaf.color").value = randomColor();

    let randomLeafIndex = Math.floor(Math.random() * Object.keys(leafTypeToFunction).length);
    document.getElementById("leaf.type").value = Object.keys(leafTypeToFunction)[randomLeafIndex];
    document.getElementById("leaf.size").value = Math.random() * (7 - 1) + 1;
}

// sets the seed to the hex value of current time, and seeds the prng
function setSeedToCurrentTime() {
    var selectBox = document.getElementById("seed");
    selectBox.value = Date.now().toString(16); //sets it to hex value of current time

    parameters.seed = selectBox.value;
    Math.seedrandom(parameters.seed);
}

// adds the ruleSets from RuleSets.js to the select box and set their defaults
function addRulesetTypesToSelect() {
    var selectBox = document.getElementById("type");
    for (let i = 0; i < ruleSets.length; i++) {
        selectBox.add(new Option(ruleSets[i].name, i));
    }

    updateFieldsWithTypeDefaults(ruleSets[0]);
}

// adds the leaf types to the select box
function addLeafTypesToSelect() {
    var selectBox = document.getElementById("leaf.type");
    for (let leafType in leafTypeToFunction) {
        selectBox.add(new Option(leafType));
    }
}

function updateFieldsWithTypeDefaults(ruleset) {
    document.getElementById("branch.angle").value = ruleset.defaultBranchAngle;
}

function updateParameters() {
    parameters.iterations = document.getElementById("iterations").value;
    //parameters.seed = document.getElementById("seed").value;

    parameters.type = document.getElementById("type").value;
    parameters.canvasWidthModifier = ruleSets[parameters.type].canvasWidthModifier;
    parameters.canvasIntitalRotation = ruleSets[parameters.type].canvasInitialRotation;

    parameters.branchColor = document.getElementById("branch.color").value;
    parameters.branchWidth = document.getElementById("branch.width").value;
    parameters.branchLength = document.getElementById("branch.length").value;
    parameters.branchAngle = document.getElementById("branch.angle").value;

    parameters.leafColor = document.getElementById("leaf.color").value;
    parameters.leafEnabled = document.getElementById("leaf.enabled").checked;
    parameters.leafType = document.getElementById("leaf.type").value;
    parameters.leafSize = document.getElementById("leaf.size").value;
}

async function renderPlant() {
    const canvas = document.getElementById("treeCanvas");
    const ctx = canvas.getContext("2d");

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.transform(1, 0, 0, 1, canvas.width * parameters.canvasWidthModifier, canvas.height);

    // some rulesets look better with an initial rotation
    ctx.rotate(parameters.canvasIntitalRotation * Math.PI / 180)

    for (let i = 0; i < plantString.length; i++) {
        let currentSymbol = plantString[i];

        switch (currentSymbol) {
            case "A":
            case 'B':
                drawBranch(ctx);
                ctx.transform(1, 0, 0, 1, 0, -parameters.branchLength);
                break;
            case "-":
                ctx.rotate(parameters.branchAngle * Math.PI / 180);
                break;
            case "+":
                ctx.rotate(-parameters.branchAngle * Math.PI / 180);
                break;
            case "[":
                //push the current context state
                ctx.save();
                break;
            case "]":
                //draw leaf and pop context state
                if (parameters.leafEnabled) {
                    leafTypeToFunction[parameters.leafType](ctx);
                }

                ctx.restore();
                break;
        }
    }
}

/*
    Below are functions to draw different plant components
*/
function drawBranch(ctx) {
    ctx.fillStyle = parameters.branchColor;
    ctx.beginPath();
    ctx.moveTo(-parameters.branchWidth / 2, -parameters.branchLength - 1);
    ctx.lineTo(-parameters.branchWidth / 2, 1);
    ctx.lineTo(parameters.branchWidth / 2, 1);
    ctx.lineTo(parameters.branchWidth / 2, -parameters.branchLength - 1);
    ctx.lineTo(-parameters.branchWidth / 2, -parameters.branchLength - 1);
    ctx.closePath();
    ctx.fill();
}

function drawRegularLeaf(ctx) {
    ctx.fillStyle = parameters.leafColor;
    ctx.scale(2, 5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(parameters.leafSize, -parameters.leafSize);
    ctx.lineTo(0, -parameters.leafSize * 2);
    ctx.lineTo(-parameters.leafSize, -parameters.leafSize);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
}

function drawSnowballLeaf(ctx) {
    ctx.fillStyle = parameters.leafColor;
    ctx.beginPath()
    ctx.arc(0, 0, parameters.leafSize, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
}