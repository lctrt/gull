class Effect {
    params= () => []
    wet(wet) {
        if(wet) {
            this._wet = to35ths(wet,1);
            this.node.wet.value = this._wet;
        } else {
            return this._wet;
        }
    }
}

class Freeverb extends Effect {
    constructor() {
        super();
        this.node = new Tone.Freeverb();
        this._room = 0;
    }
    params =  () => ['room','wet']
    room(room) {
        if (room) {
            this._room = Math.max(0.01, to35ths(room,0.99));
            this.node.room = this._room;
        } else {
            return this._room;
        }
    }
}

class Distortion extends Effect {
    constructor() {
        super();
        this.node = new Tone.Distortion();
        this._intensity = 0;
    }
    params = () => ['intensity', 'wet']
    intensity(intensity) {
        if (intensity) {
            this._intensity = Math.max(0.01, to35ths(intensity, 1));
            this.node.intensity = this._intensity;
        } else {
            return this._intensity;
        }
    }
}

class Tremolo extends Effect {
    constructor() {
        super();
        this.node = new Tone.Tremolo().start();
        this._frequency = 0;
    }
    params = () => ['frequency', 'wet']
    frequency(frequency) {
        if (frequency) {
            this._frequency = frequency; // TODO -> proper scaling
            this.node.frequency = this._frequency;
        } else {
            return this.frequency;
        }
    }
}

const genEffectNode = Effect => (...params) => {
    const effect = new Effect();
    effect.params().forEach((key, i) => {
        effect[key](params[i]);
    });
    return effect.node;
};