class ChoiceFrame extends Converter {
    constructor() {
        super("choice");
        this.choiceCount = 0;
    }

    convertToJSON(index, csvFrame, jsonGenerator) {
        return `"frame_type": "${this.frameType}",` +
            this.choiceValueKeySerialization(index, csvFrame.formsList, jsonGenerator.bannedIndexes, jsonGenerator);
    }

    choiceValueKeySerialization(index, fields, bannedIndexes, jsonGenerator) {
        let idPart = `chapter${jsonGenerator.chapterIndex}_choice${this.choiceCount}_answer`;
        let choiceId = `chapter${jsonGenerator.chapterIndex}_choice${this.choiceCount}`;

        this.additionInformation = choiceId;

        let finalFields = [];
        let isTimerChoice = false;
        fields.forEach(field => {
            if (field.key.input.toLowerCase() === "timer") {
                isTimerChoice = field.value.input.toLowerCase() === "true";
            } else {
                finalFields.push(field);
            }
        });

        let json = `"choice_id": "${choiceId}",`;
        json += this.simpleValueKeySerialization(finalFields);
        json += `"frame_settings": {"frame_type": "${isTimerChoice ? "choice_timer" : "choice"}","answers": [`;

        bannedIndexes.add(index);

        let duplicates = getDuplicateSourceToSource(jsonGenerator.arrows, [index, 0]);
        duplicates.forEach((duplicate, i) => {
            bannedIndexes.add(duplicate.to);

            let nextArrow = getDuplicateSourceToDestination(jsonGenerator.arrows, [0, duplicate.to])[0];

            let fullId = `${idPart}${i + 1}`;
            let jsonFrame;

            if (nextArrow.to in jsonGenerator.jsonFrames) {
                jsonFrame = jsonGenerator.jsonFrames[nextArrow.to];
                if (!jsonFrame.frameID) {
                    jsonFrame.frameID = fullId;
                } else {
                    fullId = jsonFrame.frameID;
                }
            } else {
                jsonFrame = new JSONFrame(nextArrow.to);
                jsonFrame.frameID = fullId;
                jsonGenerator.jsonFrames[nextArrow.to] = jsonFrame;
            }

            json += `{`;
            json += this.simpleValueKeySerialization(jsonGenerator.csvFrames[duplicate.to].formsList);
            json += `"next_id": "${fullId}"`;
            json += `},`;
        });

        this.choiceCount++;
        return json.substring(0, json.length - 1) + "]}";
    }
}
