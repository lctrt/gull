const fromBase36 = (code) => 
    parseInt(code,36);

const to35ths = (letter, total) => 
    (fromBase36(letter)) * total / 35;
