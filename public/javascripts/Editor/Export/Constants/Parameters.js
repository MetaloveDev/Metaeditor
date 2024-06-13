const ValueTypes = {
    Boolean: "Boolean",
    String: "String",
    Integer: "Integer",
};

const parametersList = {
    "character": { name: "character_key", type: ValueTypes.String },
    "emotion": { name: "emotion_key", type: ValueTypes.String },
    "location": { name: "background", type: ValueTypes.String },
    "text": { name: "dialog_text", type: ValueTypes.String },
    "thought": { name: "thoughts", type: ValueTypes.Boolean },
    "luck": { name: "lucky_level_change", type: ValueTypes.Integer },
    "luck-check": { name: "needed_lucky_level", type: ValueTypes.Integer },
    "love": { name: "needed_love_level", type: ValueTypes.Integer },
    "animation": { name: "animation", type: ValueTypes.String },
    "item": { name: "needed_prop", type: ValueTypes.String },
    "bubble": { name: "bubble", type: ValueTypes.String },
    "paid": { name: "paid", type: ValueTypes.Boolean },
    "outfit-set": { name: "outfit_bundle_key", type: ValueTypes.String },
    "outfit-id": { name: "outfit_id", type: ValueTypes.String },
    "chapter": { name: "chapter", type: ValueTypes.Integer },
    "item-name": { name: "frame_type", type: ValueTypes.String },
    "add": { name: "take", type: ValueTypes.Boolean },
    "timer": { name: "frame_type", type: ValueTypes.Boolean },
    "premium": { name: "paid", type: ValueTypes.Boolean },
    "name": { name: "name", type: ValueTypes.String },
    "count": { name: "count", type: ValueTypes.Integer },
    "type": { name: "type", type: ValueTypes.String },
    "value": { name: "value", type: ValueTypes.Integer },
    "needed-prop": { name: "needed_prop", type: ValueTypes.String },
};

function tryGetParameterPair(key, rawValue) {
    key = key.toLowerCase();
    rawValue = rawValue.toLowerCase().trim();
    if (rawValue !== 'none' && parametersList.hasOwnProperty(key)) {
        const name = parametersList[key].name;
        let value;
        switch (parametersList[key].type) {
            case ValueTypes.Boolean:
                value = rawValue === 'true';
                break;
            case ValueTypes.String:
                value = `"${rawValue.replace(/"/g, '\\"')}"`;
                break;
            case ValueTypes.Integer:
                value = parseInt(rawValue, 10);
                break;
            default:
                value = null;
                break;
        }
        return [name, value, true];
    }

    return ["", null, false];
}
