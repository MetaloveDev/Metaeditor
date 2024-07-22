class TextFrame extends Converter {
    constructor() {
        super("text");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let animationKey = null;

        csvFrame.formsList.forEach(field => {
            if (field.key.input === "animation") {
                animationKey = field.value.input;
            } else {
                fields.push(field);
            }
        });
        const values = this.simpleValueKeySerialization(fields);
        return `"frame_type": "${this.frameType}",` + (values.length != 0 ? `${values.substring(0, values.length - 1)}` : '') + (animationKey !== null ? `,"frame_settings": {"animation": "${animationKey}"}` : '');
    }
}