const uiContext = document.getElementById('ui');
const socket = io('http://localhost:3000');

let samplers = [];

const to35ths = (letter, total) => 
    (parseInt(letter,36)) * total / 35;

const play = (args = []) => {
    const [chan = 0, start = 0, duration = 'z'] = args
    const length = samplers[chan].length();

    samplers[chan].player.start('+0', to35ths(start, length), to35ths(duration, length, 1));
}

const loadUI = () => {
    uiContext.innerHTML = '';
    samplers.forEach(function(sampler, i) {
        uiContext.insertAdjacentHTML('beforeend', `<div class="trig" id="trig-${i}">${sampler.name}</div>`);
        const trig = document.getElementById(`trig-${i}`);
        trig.addEventListener('click', () => play([i]));
    });
}
const loadSamples = ({files=[]}) => {
    const samples = files.filter((name) => name.includes('.wav'))
    console.log(samples);
    samplers = samples.map(function (filename) {
        const player = new Tone.Player(`./samples/${filename}`).toMaster();

        return {
            player,
            name: filename.split('.wav')[0].substring(0,8),
            length: () => player.buffer._buffer.duration
        };
    });
    loadUI();
}

socket.on('message', ({type, ...rest}) => {
    switch(type) {
        case 'filechange':
            loadSamples(rest);
            break;
        case 'trig':
            play(rest.msg.split(''));
    }
})