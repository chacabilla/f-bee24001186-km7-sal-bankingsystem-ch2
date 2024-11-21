import ImageKit from 'imagekit';

const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT
} =process.env;

export default new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
});