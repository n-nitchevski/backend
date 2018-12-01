import Jimp from 'jimp';

/**
 * @param fileData
 * @return Promise.resolve(Buffer)
 */
export default fileData => new Promise((res, rej) => Jimp.read(fileData, (err, image) => {
    if (err) return rej(err);
    return image.resize(640, Jimp.AUTO).getBuffer(Jimp.MIME_PNG, (error, newImage) => {
        if (error) return rej(error);
        return res(newImage);
    });
}));

