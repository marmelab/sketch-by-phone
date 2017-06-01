export default (dataUrl) =>
    new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img,0,0);
                    const whiteImage = ctx.createImageData(img.width, img.height);
                    whiteImage.data.fill(255);

                    const blackImage = ctx.createImageData(img.width, img.height);
                    for (var i=0;i<blackImage.data.length;i+=4) {
                        blackImage.data[i+0]=0;
                        blackImage.data[i+1]=0;
                        blackImage.data[i+2]=0;
                        blackImage.data[i+3]=255;
                    }
                    resolve({
                        image: ctx.getImageData(0,0,img.width, img.height),
                        whiteImage,
                        blackImage,
                    });
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = dataUrl;
        } catch (error) {
            reject(error);
        }
    });
