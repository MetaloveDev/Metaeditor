class LuckyFrame extends Converter {
    constructor() {
        super("lucky");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let lucky = "";
        csvFrame.formsList.forEach(field => {
            if (field.key.input.toLowerCase() === "add") {
                lucky = field.value.input;
            } else {
                fields.push(field);
            }
        });

        return `"frame_type": "lucky","frame_settings": {"lucky_level_change": ${lucky}}`;
    }
}
