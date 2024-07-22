const metricsList = [
    ["Number of frames", 800, 1000, 1300, 1500, false, "Total number of frames, includes all types"],// 0
    ["On average forks", 11, 13, 15, 16, false, "Average number of forks ( = total number of frames/number of choices)"],// 1
    ["Text in a row", 0, 0, 3, 4, true, "Maximum number of Text frames found in a row"],// 2
    ["Paid options", 4, 4, Number.MAX_VALUE, Number.MAX_VALUE, false, "Number of Choices for which there is at least one Option with 'premium:true'"],// 3
    ["Luck change", 1, 1, 2, Number.MAX_VALUE, false, "Total number of frames of change in luck level"],// 4
    ["Luck check", 0, 0, 2, 3, false, "Total number of luck level check frames"],// 5
    ["Dressing up", 1, 2, Number.MAX_VALUE, Number.MAX_VALUE, false, "Total number of customization frames"],// 6
    ["Satyr Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE, false, "Total number of relationship change frames with Satyr"],// 7
    ["Levet Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE, false, "Total number of relationship change frames with Levet"],// 8
    ["Psychological choice", 1, 1, 3, Number.MAX_VALUE, false, "Number of elections that give Rose, Key, Crown items"],// 9
    ["Mother moon", 1, 1, 1, Number.MAX_VALUE, false, "Total number of frames with moon_mother background"],// 10
    ["Number of letters", 0, 0, 175, 190, true, "Maximum number of characters in the 'text' field"],// 11
    ["Number of locations", 6, 9, Number.MAX_VALUE, Number.MAX_VALUE, false, "Number of unique backgrounds"],// 12
];

const errorsList = [
    ["CCE0000: Not enough psychological stuff", StatState.ERROR, "The choice must have the issue of each of the items (Item frame): Rose, Key, Crown"],// 0
    ["CCE0001: Extra frame", StatState.WARNING, "Too many Text frames in a row"],// 1
    ["CCE0002: Text is too long", StatState.WARNING, "Text is too long"],// 2
    ["CCE0003: Unexpected frame type", StatState.ERROR, "The entered frame type is not recognized, check the correct spelling"],// 3
    ["CCE0004: Unexpected frame property", StatState.ERROR, "The entered frame property is not recognized, check the correct spelling"],// 4
    ["CCE0005: Invalid psychological choice format", StatState.ERROR, "The choice with the issuance of psychological subjects should have ONLY 3 options"],// 5
    ["CCE0006: Choice variant should lead somewhere", StatState.WARNING, "Choice variant should lead somewhere"],// 6
    ["CCE0007: Choice frame must lead to Option frame", StatState.ERROR, "The Choice frame MUST lead only to Option frames"],// 7
    ["CCE0008: Unexpected frame formatting", StatState.ERROR, "Unexpected frame formatting (check the documentation)"],// 8
    ["CCE0009: Disconnected frame", StatState.WARNING, "A frame disconnected from the general history (not taken into account when exporting)"],// 9
    ["CCE0010: Duplicate property", StatState.ERROR, "Two identical properties in one frame are not allowed"],// 10
    ["CCE0011: Dead-end line", StatState.ERROR, "The branch breaks off without finishing"],// 11
    ["", StatState.COMMENT, ""],// 12
    ["", StatState.COUNTER, ""],// 13
    ["CCE0012: Extra start", StatState.ERROR, "Chapter must have only one start"],// 14
    ["", StatState.BOOKMARK, ""],// 15
    ["CCE0013: No location", StatState.ERROR, "After the animation frame, the location must be set"],// 16
];