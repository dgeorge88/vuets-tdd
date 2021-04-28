interface Rule {
    type: "required" | "length"
}

interface Require extends Rule {
    type: "required"
}

interface MixMaxOptions {
    min: number
    max: number
}

interface Length extends Rule {
    type: "length",
    options: MixMaxOptions
}


export function required(): Require {
    return {
        type: "required"
    }
}

export function length(options: MixMaxOptions): Length {
    return {
        type: "length",
        options
    }
}

// sets Validator type
type Validator = Require | Length


// sets validator status inferface
export interface Status {
    valid: boolean,
    message?: string
}

// validator function
export function validate(value: string, validators: Validator[]): Status {

    // check if validtor type is REQUIRED and if VALUE exists
    for (const validator of validators) {
        if (validator.type === "required" && (!value || !value.length)) {
            return {
                valid: false,
                message: "This field is required."
            }
        }
    }

    // check validator type is LENGTH and get both MIN and MAX value length
    for (const validator of validators) {
        if (validator.type === "length" && (value.length < validator.options.min || value.length > validator.options.max)) {
            return {
                valid: false,
                message: `This field a minimum length of ${validator.options.min} and a maximum length of ${validator.options.max}.`
            }
        }
    }

    // if both valid execute
    return {
        valid: true
    }
}

