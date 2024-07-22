class PropShowFrame extends Converter {
    constructor() {
        super("prop-show");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        const values = this.simpleValueKeySerialization(csvFrame.formsList);
        return `"frame_type": "animation","frame_settings": {"frame_type": "prop_show",` + values + `"autoplay": true}`;
    }
}