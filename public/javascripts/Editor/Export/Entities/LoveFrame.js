class LoveFrame extends Converter {
    constructor() {
        super("love");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let love = "";
        csvFrame.formsList.forEach(field => {
            if (field.key.input.toLowerCase() === "add") {
                love = field.value.input;
            } else {
                fields.push(field);
            }
        });

        return this.simpleValueKeySerialization(fields) + `"frame_type": "relationship","frame_settings": ` +
            `{"love_level_change": ${love}}`;
    }
}
