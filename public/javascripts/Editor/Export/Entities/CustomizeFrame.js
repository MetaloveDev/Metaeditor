class CustomizeFrame extends Converter {
    constructor() {
        super("customize");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let outfitBundleKey = "";

        csvFrame.formsList.forEach(field => {
            if (field.key.input === "outfit-set") {
                outfitBundleKey = field.value.input;
            } else {
                fields.push(field);
            }
        });

        return this.simpleValueKeySerialization(fields) + `"frame_type": "customize","frame_settings": ` +
            `{"frame_type": "${this.frameType}","outfit_bundle_key": "${outfitBundleKey}"}`;
    }
}
