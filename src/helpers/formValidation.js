import { validate } from 'validate.js';

// Validate.js to validate user inputs.  Check for decimals, strings, numbers.
function answerValidator(user_input) {
    validate.validators.decimalAbsence = function (
        value,
        attributes,
        attributeName,
        options,
        constraints
    ) {
        if (!value.includes('.')) return undefined;
        return 'Answer cannot contain decimals!';
    };

    validate.validators.emptyString = function (
        value,
        attributes,
        attributeName,
        options,
        constraints
    ) {
        if (value === '') {
            return undefined;
        }
    };

    validate.validators.numericality = function (
        value,
        options,
        key,
        attributes
    ) {
        if (Number.isInteger(Number(value))) {
            return undefined;
        } else {
            return 'You must enter a number greater than or equal to 0!';
        }
    };

    let constraints = {
        mathGameinput: {
            length: {
                minimum: 0,
                maximum: 3,
                message:
                    'You are only allowed to enter an answer length between 0 and 3!',
            },
            decimalAbsence: {},
            emptyString: {},
            numericality: {},
            presence: {
                allowEmpty: false,
                message: 'Answer field cannot be blank!',
            },
        },
    };

    let validationErrors = validate(
        { mathGameinput: user_input },
        constraints,
        { format: 'detailed', fullMessages: false, presence: true }
    );

    if (validationErrors !== undefined) {
        return validationErrors;
    } else {
        return null;
    }
}

export default answerValidator;
