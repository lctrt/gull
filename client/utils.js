const fromBase36 = (code) => 
    parseInt(code,36);

const to35ths = (letter, total) => 
    (fromBase36(letter)) * total / 35;


const splitBy = (list, groupSize) => 
    list.map((item, index) => 
        index % groupSize === 0 ? list.slice(index, index + groupSize) : null
    )
    .filter(item => item);
