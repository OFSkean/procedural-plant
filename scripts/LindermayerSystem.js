/*
    Implementation of a Lindermayer system. This pretty much defines a deterministic finite automata
    that takes a formal grammar and produces an output based on rulesets. The output is repeatedly used
    as the input until you've reached the desired number of iterations.
*/
export class LindermayerSystem {
    constructor(_rules, _axiom, _iterations) {
        this.rules = _rules;
        this.axiom = _axiom;
        this.iterations = _iterations;

        this.currentState = _axiom;
    }

    /*
        Given a list of weighted rules, randomly select one and return it.
    */
    pickFromWeightedDistribution(rules) {
        var cumulativeWeights = [];
        for (let i = 0; i < rules.length; i++) {
            cumulativeWeights.push(rules[i].probability + (cumulativeWeights[i - 1] || 0));
        }

        var rand = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (cumulativeWeights[i] >= rand) {
                return rules[i];
            }
        }

        throw 'Bad Weighted Distribution';
    }

    /*
        Finds a matching rule based on a symbol and returns the rule body.
        If multiple rules are found, pick one stochastically.
        If no rule is found, return the symbol itself.
    */
    findMatchingRuleBody(symbol) {
        var matchingRules = [];
        for (let i = 0; i < this.rules.length; i++) {
            if (symbol == this.rules[i].head) {
                matchingRules.push(this.rules[i]);
            }
        }

        if (matchingRules.length > 1) {
            return this.pickFromWeightedDistribution(matchingRules).body;
        } else if (matchingRules.length == 1) {
            return matchingRules[0].body;
        } else {
            return symbol;
        }
    }

    /*
        Performs one iteration of the l-system over the current state.
    */
    iterateOnCurrentState() {
        let newState = "";
        for (let i = 0; i < this.currentState.length; i++) {
            let currentSymbol = this.currentState[i];
            let matchingRuleBody = this.findMatchingRuleBody(currentSymbol);
            newState = newState.concat(matchingRuleBody);
        }

        this.currentState = newState;
    }

    /*
        Performs n iterations of the l-system over the axiom.
    */
    generateString() {
        this.currentState = this.axiom;

        for (let i = 0; i < this.iterations; i++) {
            this.iterateOnCurrentState();
        }

        return this.currentState;
    }
}

/*
    A production rule for formal grammars. Takes a head (string to be replaced) and 
    a body (string that replaces the head).
*/
export class ProductionRule {
    constructor(_head, _body, _probability = 1) {
        this.head = _head;
        this.body = _body;
        this.probability = _probability;
    }
}