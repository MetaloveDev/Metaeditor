class JSONFrame {
    constructor(id) {
        this._id = id;
        this._frameID = null;
        this._body = null;
        this._nextFrameID = null;
        this._additionInformation = null;
    }

    get frameID() {
        return this._frameID;
    }

    set frameID(value) {
        if (this._frameID === null) {
            this._frameID = value;
        }
    }

    set frameIDRaw(value) {
        this._frameID = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get nextFrameID() {
        return this._nextFrameID;
    }

    set nextFrameID(value) {
        if (this._nextFrameID === null) {
            this._nextFrameID = value;
        }
    }

    get additionInformation() {
        return this._additionInformation;
    }

    set additionInformation(value) {
        this._additionInformation = value;
    }
}
