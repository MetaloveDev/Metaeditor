class BubbleFrame extends Converter {
    constructor() {
        super("bubble");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let bubble = "";
        csvFrame.formsList.forEach(field => {
            if (field.key.input.toLowerCase() === "bubble-type") {
                bubble = field.value.input;
            } else {
                fields.push(field);
            }
        });

        return this.simpleValueKeySerialization(fields) + `"frame_type": "bubble","frame_settings": ` +
            `{"frame_type": "${bubble === 'small' ? 'small-bubble' : 'big-bubble'}"}`;
    }
}
