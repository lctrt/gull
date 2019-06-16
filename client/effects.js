class Effect {
    constructor() {
        this._wet = 0;
    }
    params= () => []
    wet(wet) {
        if(wet !== undefined) {
            this._wet = to35ths(wet || 0,1);
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
        if (room !== undefined) {
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
        if (intensity !== undefined) {
            this._intensity = Math.max(0.01, to35ths(intensity, 1));
            this.node.distortion = this._intensity;
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
        if (frequency !== undefined) {
            this._frequency = frequency; // TODO -> proper scaling
            this.node.frequency = this._frequency;
        } else {
            return this._frequency;
        }
    }
}

class Filter extends Effect {
    constructor() {
        super();
        this.node = new Tone.Filter();
    }
    params = () => ['type', 'frequency', 'q']
    type(type = "L") {
        const typeMap = {
            'L': 'lowpass', 
            'H': 'highpass', 
            'B': 'bandpass'
        }
        if (Object.keys(typeMap).includes(type)) {
            this._type = typeMap[type];
            this.node.type = this._type;
        }
    }
    frequency(frequency = 2) {
        this._frequency = to35ths(frequency, 15000); // TODO -> proper scaling
        // console.log(this.node.frequency)
        this.node.frequency.value = this._frequency;
    }
    q(q = 0) {
        this._q = to35ths(q, 4);
        this.node.q = this._q;
    }
}

const genEffectNode = Effect => (...params) => {
    const effect = new Effect();
    effect.params().forEach((key, i) => {
        effect[key](params[i] || 0);
    });
    return effect;
};