class AnimationFrame extends Converter {
    constructor() {
        super("animation");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let animation = "";
        csvFrame.formsList.forEach(field => {
            if (field.key.input.toLowerCase() === "animation") {
                animation = field.value.input;
            } else {
                fields.push(field);
            }
        });

        let json = `"frame_type": "${this.frameType}","frame_settings": ` +
            `{"frame_type": "${this.frameType}","animation": "${animation}","autoplay": true}`;

        if (fields.length > 0) {
            json = this.simpleValueKeySerialization(fields) + json;
        }

        return json;
    }
}
