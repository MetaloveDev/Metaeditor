class CounterComparisonFrame extends Converter {
    constructor() {
        super("counter-comparison")
        this.choiceCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return this.choiceValueKeySerialization(index, csvFrame.formsList, jsonGenerator.BannedIndexes, jsonGenerator);
    }

    choiceValueKeySerialization(index, fields, bannedIndexes, jsonGenerator) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_counter_comparison" + this.choiceCount + "_";

        let json = "\"frame_type\": \"counter-comparison\"," + this.simpleValueKeySerialization(fields);
        json += "\"frame_id_part\": \"" + idPart + "\", \"counters\":\"";

        bannedIndexes.add(index);

        const duplicates = getDuplicateSourceToSource(jsonGenerator.Arrows, [index, 0]);

        for (let i = 0; i < duplicates.length; i++) {
            const fullId = idPart + duplicates[i].value.input;

            json += duplicates[i].value.input + "|";

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
        return json.substring(0, json.length - 1) + "\"";
    }
}