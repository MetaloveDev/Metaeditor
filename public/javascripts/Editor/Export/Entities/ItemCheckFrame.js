class ItemCheckFrame extends Converter {
    constructor() {
        super("item-check");
        this.checkCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "prop-check",` +
            this.checkValueKeySerialization(index, jsonGenerator.BannedIndexes, jsonGenerator, csvFrame);
    }

    checkValueKeySerialization(index, bannedIndexes, jsonGenerator, csvFrame) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_item_check" + this.checkCount + "_";
        let json = "\"frame_id_part\": \"" + idPart + "\",\"frame_settings\":{\"frame_type\": \"" + csvFrame.formsList[0].value.input + "\"}";

        bannedIndexes.add(index);

        const duplicates = getDuplicateSourceToSource(jsonGenerator.Arrows, [index, 0]);

        if (duplicates.length !== 2) { }

        for (let i = 0; i < duplicates.length; i++) {
            let jsonFrame;

            if (duplicates[i].to in jsonGenerator.JSONFrames) {
                jsonFrame = jsonGenerator.JSONFrames[duplicates[i].to];
            } else {
                jsonFrame = new JSONFrame(duplicates[i].to);
                jsonGenerator.JSONFrames[duplicates[i].to] = jsonFrame;
            }

            jsonFrame.frameID = idPart + duplicates[i].value.input;
        }

        this.checkCount++;
        return json;
    }
}