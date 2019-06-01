const Listener = (onLoadSamples, onPlay) => {
    const socket = io('http://localhost:3000');

    socket.on('message', ({type, ...rest}) => {
        switch(type) {
            case 'filechange':
                onLoadSamples(rest);
                break;
            case 'edit':
                const [rowId, lineId, char] = rest.msg.split('');
                remoteEdit(rowId, lineId, char);
                break;
            case 'trig':
                onPlay(rest.msg.split(''));
                break;
            default:
                console.log('unsupported message');
        }
    });

    return socket;
}