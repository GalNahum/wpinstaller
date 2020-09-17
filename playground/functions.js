'use strict';

const create = async ( url, file_path ) => {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe( fs.createWriteStream(file_path) );

    return new Promise((resolve, reject) => {
        response.data.on('end', ()      => resolve() );
        response.data.on('error', err   => reject(err) );
    });
};

const convert = (path, dest) => {
    const { setFfmpegPath, convert } = require('video-converter');
    setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe", () => null );
    return new Promise((resolve, reject) => {
        convert(path, dest,(err) => {
                if( err)  return reject(err);
                resolve();
            }
        );
    });
};

//console.log('convert mp4 to mp3');
//await convert(file_path, path.resolve( DOWNLOAD_PATH , `${file_name}.mp3` ));