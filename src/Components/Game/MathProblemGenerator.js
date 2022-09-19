export const randomFunc = [multiplication, division, addition, subtraction];

export function randomProblemGenerator() {
    // Select a random function from above by randomly picking a position in the array.  The parenthesis following the ranomly
    // chosen function make it a regular function.
    return randomFunc[Math.floor(Math.random() * randomFunc.length)]();
}

export function multiplication() {
    let num1 = Math.floor(Math.random() * 13);
    let num2 = Math.floor(Math.random() * 13);
    let problemResult = num1 * num2;
    let problem = `${num1} x ${num2}`;
    return { problem_string: problem, problem_answer: problemResult };
}

export function division() {
    let num1 = Math.floor(Math.random() * 13);
    let num2 = Math.floor(Math.random() * 12) + 1;
    let problemResult = (num1 * num2) / num2;
    let problem = `${num1 * num2} ÷ ${num2}`;
    return { problem_string: problem, problem_answer: problemResult };
}

export function addition() {
    let num1 = Math.floor(Math.random() * 13);
    let num2 = Math.floor(Math.random() * 13);
    let problemResult = num1 + num2;
    let problem = `${num1} + ${num2}`;
    return { problem_string: problem, problem_answer: problemResult };
}

export function subtraction() {
    let num1 = Math.floor(Math.random() * 13);
    let num2 = Math.floor(Math.random() * 13);
    let numList = [num1, num2];
    numList.sort(function (a, b) {
        return a - b;
    });
    let problemResult = numList[1] - numList[0];
    let problem = `${numList[1]} - ${numList[0]}`;
    return { problem_string: problem, problem_answer: problemResult };
}
