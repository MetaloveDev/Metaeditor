class Converter {
    constructor(frameType) {
        this._frameType = frameType;
        this.additionInformation = null;
    }

    get frameType() {
        return this._frameType;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        throw new Error("Method 'convertToJSON' must be implemented.");
    }

    simpleValueKeySerialization(fields) {
        let json = "";
        for (let field of fields) {
            let [key, type, isFounded] = tryGetParameterPair(field.key.input, field.value.input);
            if (isFounded) {
                if (key === "dialog_text") {
                    if (type[1] !== '\\')
                        type = type[0] + type[1].toUpperCase() + type.slice(2);
                    else
                        type = type[0] + type[1] + type[2] + type[3].toUpperCase() + type.slice(4);
                }

                json += `"${key}":${type},`;
            }
        }
        return json;
    }
}