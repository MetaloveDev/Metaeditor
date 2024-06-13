class PropsFrame extends Converter {
    constructor() {
        super("item");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        const values = this.simpleValueKeySerialization(csvFrame.formsList);
        return `"frame_type": "prop","frame_settings": {` + (values.length != 0 ? values.substring(0, values.length - 1) : "") + `}`;
    }
}