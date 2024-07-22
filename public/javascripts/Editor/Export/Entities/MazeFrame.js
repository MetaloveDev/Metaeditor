class MazeFrame extends Converter {
    constructor() {
        super("maze")
        this.mazeCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return this.mazeKeySerialization(index, csvFrame.formsList, jsonGenerator.BannedIndexes, jsonGenerator);
    }

    mazeKeySerialization(index, fields, bannedIndexes, jsonGenerator) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_maze" + this.mazeCount + "_";

        let json = "\"frame_type\": \"maze\"," + this.simpleValueKeySerialization(fields);
        json += "\"frame_id_part\": \"" + idPart + "\"";

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
            jsonFrame.frameIDRaw = (jsonFrame.frameID === null ? fullId : (jsonFrame.frameID + " " + fullId));
        }

        this.mazeCount++;
        return json;
    }
}