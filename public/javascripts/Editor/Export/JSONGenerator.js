class JSONGenerator {
    constructor(chapterIndex, frames, arrows, frameIndexes) {
        this.chapterIndex = chapterIndex;

        this.csvFrames = {};
        frames.forEach(frame => {
            this.csvFrames[frame.id] = frame;
        });

        this.jsonFrames = {};
        this.frameIndexes = frameIndexes;

        this.arrows = arrows;
        this.endCount = 1;

        this.converters = [
            new TextFrame(),
            new AnimationFrame(),
            new CustomizeFrame(),
            new DialogFrame(),
            new PropsFrame(),
            new ChoiceFrame(),
            new ChoiceByCharacterFrame(),
            new ChoiceByChoiceFrame(),
            new BubbleFrame(),
            new LoveFrame(),
            new ItemCheckFrame(),
            new MaxLoveFrame(),
            new LoveForkFrame(),
            new CounterFrame(),
            new CounterCheckFrame(),
            new CounterComparisonFrame(),
            new CounterValueFrame(),
            new PropShowFrame(),
            new AutoCustomizeFrame(),
            new MazeFrame(),
            new LuckyFrame(),
        ];

        this.bannedIndexes = new Set();
    }

    get CSVFrame() {
        return this.csvFrames;
    }

    get JSONFrames() {
        return this.jsonFrames;
    }

    get Arrows() {
        return this.arrows;
    }

    get FrameIndexes() {
        return this.frameIndexes;
    }

    get ChapterIndex() {
        return this.chapterIndex;
    }

    get BannedIndexes() {
        return this.bannedIndexes;
    }

    generate() {
        for (let i = 0; i < this.frameIndexes.length; i++) {
            if (this.bannedIndexes.has(this.frameIndexes[i])) continue;

            const frame = this.csvFrames[this.frameIndexes[i]];
            const type = frame.header.input.toLowerCase();

            for (const converter of this.converters) {
                if (converter.frameType === type) {
                    const text = converter.convertToJSON(this.frameIndexes[i], frame, this);
                    this.addFrame(frame.id, text, converter.additionInformation);
                    break;
                }
            }
        }
        return "[" + this.joinFrames() + "]";
    }

    joinFrames() {
        let json = "";
        const finalIndex = `chapter${this.chapterIndex}_final`;

        const framesSet = new Set();
        this.frameIndexes.forEach(index => {
            if (index in this.jsonFrames) {
                const frame = this.jsonFrames[index];
                if (!framesSet.has(frame)) {
                    const arrows = getDuplicateSourceToSource(this.arrows, [index, 0]);

                    if (arrows.length === 0) {
                        frame.nextFrameID = finalIndex;
                    }
                    framesSet.add(frame);
                }
            }
        });

        framesSet.forEach(frame => {
            json += "{";
            if (frame.frameID !== null) {
                json += `"frame_id": "${frame.frameID}",`;
            }
            json += frame.body;
            if (frame.nextFrameID !== null) {
                json += `,"next_frame_id": "${frame.nextFrameID}"`;
            }
            json += "},";
        });

        json += `{"frame_id":"${finalIndex}","frame_type": "panel","frame_settings": {"frame_type": "win"}}`;

        return json;
    }

    addFrame(id, bodyText, additionInformation) {
        let jsonFrame;
        if (id in this.jsonFrames) {
            jsonFrame = this.jsonFrames[id];
        } else {
            jsonFrame = new JSONFrame(id);
            this.jsonFrames[id] = jsonFrame;
        }

        jsonFrame.body = bodyText;
        jsonFrame.additionInformation = additionInformation;

        let arrows = getDuplicateDestinationToSource(this.arrows, [id, -1]);

        if (arrows.length < 2) return;

        let frameId = `chapter${this.chapterIndex}_end${this.endCount}`;

        if (!jsonFrame.frameID) {
            jsonFrame.frameID = frameId;
        } else {
            frameId = jsonFrame.frameID;
        }

        arrows.forEach(arrow => {
            if (arrow.from in this.jsonFrames) {
                this.jsonFrames[arrow.from].nextFrameID = frameId;
            }
        });

        this.endCount++;
    }
}
