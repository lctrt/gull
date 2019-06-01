const Listener = (onLoadSamples, onPlay) => {
    const socket = io('http://localhost:3000');

    socket.on('message', ({type, ...rest}) => {
        switch(type) {
            case 'filechange':
                onLoadSamples(rest);
                break;
            case 'trig':
                onPlay(rest.msg.split(''));
        }
    });

    return socket;
}