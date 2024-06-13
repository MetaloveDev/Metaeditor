module.exports = class Infobase {
    constructor() {
        this.users = new Map();
    }

    addUser(newUserUID) {
        if (this.users.has(newUserUID)) return;

        this.users.set(newUserUID, {
            x: 0,
            y: 0,
        });
    }

    removeUser(userUID) {
        if (this.users.has(userUID) === false) return;

        this.users.delete(userUID);
    }

    setUserPosition(userUID, x, y) {
        if (this.users.has(userUID) === false) return;

        let info = this.users.get(userUID);

        info.x = x;
        info.y = y;

        this.users.set(userUID, info);
    }

    getUserPositions() {
        let positions = [];
        this.users.forEach((value, key, map) => {
            positions.push({
                id: key,
                position: {
                    x: value.x,
                    y: value.y,
                }
            });
        });

        return positions;
    }

    isEmpty() {
        return this.users.size === 0;
    }
}