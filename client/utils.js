const to35ths = (letter, total) => 
    (parseInt(letter,36)) * total / 35;

const splitBy = (list, groupSize) => 
    list.map((item, index) => 
        index % groupSize === 0 ? list.slice(index, index + groupSize) : null
    )
    .filter(item => item);
