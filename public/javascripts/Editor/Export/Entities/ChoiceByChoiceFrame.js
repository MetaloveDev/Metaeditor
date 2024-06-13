class ChoiceByChoiceFrame extends Converter {
    constructor() {
        super("choice-by-choice");
        this.choiceCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "choice-by-choice",` +
            this.choiceValueKeySerialization(index, jsonGenerator.BannedIndexes, jsonGenerator);
    }

    choiceValueKeySerialization(index, bannedIndexes, jsonGenerator) {
        const idPart = "chapter" + jsonGenerator.ChapterIndex + "_choice_by_choice" + this.choiceCount + "_";
        let json = "\"frame_id_part\": \"" + idPart + "\",\"choice_id\": \"prop\",";

        bannedIndexes.add(index);


        const duplicates = getDuplicateSourceToSource(jsonGenerator.Arrows, [index, 0]);

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

        this.choiceCount++;
        return json.substring(0, json.length - 1);
    }
}