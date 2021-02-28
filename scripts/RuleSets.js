import { ProductionRule } from "./LindermayerSystem.js"

class GentreeRuleSet {
    constructor(_axiom, _rules, _name, _canvasWidthModifier = 0.5, _canvasIntitalRotation = 0, _defaultBranchAngle = 25) {
        this.axiom = _axiom;
        this.rules = _rules;
        this.name = _name;
        this.canvasWidthModifier = _canvasWidthModifier;
        this.canvasInitialRotation = _canvasIntitalRotation;
        this.defaultBranchAngle = _defaultBranchAngle;
    }
}

/*
    Exports a list of GentreeRuleSet. The first entry is assumed to be the default.
*/
export const ruleSets = [
    //Stochastic Fractal Plant
    new GentreeRuleSet(
        "A", [
            new ProductionRule("A", "A[+A]A[-A]A", 1 / 3),
            new ProductionRule("A", "A[+A]A", 1 / 3),
            new ProductionRule("A", "A[-A]A", 1 / 3),
        ],
        "Stochastic Fractal Plant"
    ),

    // fractal plant
    new GentreeRuleSet(
        "X", [
            new ProductionRule("X", "B+[[X]-X]-B[-BX]+X"),
            new ProductionRule("B", "BB")
        ],
        "Fractal Plant"
    ),

    //binary tree
    new GentreeRuleSet(
        "A", [
            new ProductionRule("A", "B[-A]+A[]"),
            new ProductionRule("B", "BB")
        ],
        "Binary Tree"
    ),

    //Sierpinski triangle
    new GentreeRuleSet(
        "A-B-B", [
            new ProductionRule("A", "A-B+A+B-A"),
            new ProductionRule("B", "BB")
        ],
        "Sierpinski Triangle",
        1, -90, 120
    ),

    //Sierpinski Arrowhead
    new GentreeRuleSet(
        "A", [
            new ProductionRule("A", "B-A-B"),
            new ProductionRule("B", "A+B+A")
        ],
        "Sierpinski Arrowhead",
        0, 30, 60
    ),
]