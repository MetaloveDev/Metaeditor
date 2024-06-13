class AutoCustomizeFrame extends Converter {
    constructor() {
        super("auto-customize");
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        let fields = [];
        let outfitBundleKey = "";
        let outfitIdKey = "";

        csvFrame.formsList.forEach(field => {
            if (field.key.input === "outfit-set") {
                outfitBundleKey = field.value.input;
            } else if (field.key.input === "outfit-id") {
                outfitIdKey = field.value.input;
            } else {
                fields.push(field);
            }
        });

        return this.simpleValueKeySerialization(fields) + `"frame_type": "customize","frame_settings": ` +
            `{"frame_type": "automatic-customization","outfit_bundle_key": "${outfitBundleKey}","outfit_id": "${outfitIdKey}"}`;
    }
}


// {
//     "frame_type": "customize",
//     "character_key": "Favn",
//     "frame_settings": {
//         "frame_type": "automatic-customization",
//         "outfit_bundle_key": "favn",
//         "outfit_id": "favn"
//     }
// },