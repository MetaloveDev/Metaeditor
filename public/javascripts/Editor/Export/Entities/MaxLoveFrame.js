class MaxLoveFrame extends Converter {
    constructor() {
        super("max-love")
        this.choiceCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return this.maxLoveValueKeySerialization(index, csvFrame.formsList, jsonGenerator.BannedIndexes, jsonGenerator);
    }

    maxLoveValueKeySerialization(index, fields, bannedIndexes, jsonGenerator) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_love" + this.choiceCount + "_";

        let json = "\"frame_type\": \"max-love\",\"frame_id_part\": \"" + idPart + "\"";

        bannedIndexes.add(index);

        const duplicates = getDuplicateSourceToSource(jsonGenerator.Arrows, [index, 0]);

        for (let i = 0; i < duplicates.length; i++) {
            const fullId = idPart + duplicates[i].value.input;

            let jsonFrame;

            if (duplicates[i].to in jsonGenerator.JSONFrames) {
                jsonFrame = jsonGenerator.JSONFrames[duplicates[i].to];
            } else {
                jsonFrame = new JSONFrame(duplicates[i].to);
                jsonGenerator.JSONFrames[duplicates[i].to] = jsonFrame;
            }

            jsonFrame.frameID = fullId;
        }

        this.choiceCount++;
        return json;
    }
}