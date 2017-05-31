
import { imgproc, matrix_t, U8C1_t } from 'jsfeat';

const blur = 2;
const lowTreshold = 20;
const highTreshold = 50;

export default imageData => {
    let matrix = new matrix_t(imageData.width, imageData.height, U8C1_t);
    imgproc.grayscale(imageData.data, imageData.width, imageData.height, matrix);

    var r = 0;
    var kernelSize = (r+1) << 1;
    imgproc.gaussian_blur(matrix, matrix, kernelSize, blur);

    imgproc.canny(matrix, matrix, lowTreshold, highTreshold);

    // put result back into imageData
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = matrix.cols*matrix.rows, pix = 0;
    while (--i >= 0) {
        pix = matrix.data[i];
        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }

    return imageData;
}