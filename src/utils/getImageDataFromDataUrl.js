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
                    resolve(ctx.getImageData(0,0,img.width, img.height));
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
