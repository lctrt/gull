const TUNING_FREQ = 440;

const fromBase36 = (code) => 
    parseInt(code,36);

const to35ths = (letter, total) => 
    (fromBase36(letter)) * total / 35;

const p2f = pitch => Math.pow(2, (-69 + pitch * 4) / 12) * TUNING_FREQ;

const f2p = freq => 19 + Math.log2(freq/TUNING_FREQ) * 12;

const p2f36 = code => p2f(fromBase36(code));