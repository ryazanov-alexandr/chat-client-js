export function getImageFromBase64(base64) {
    const blob = base64toBlob(base64);
    return blobToImage(blob);
}

export function base64toBlob(dataURL) {
    if(!dataURL) return new Blob();

    var arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

export function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob)
      let img = new Image();

      img.addEventListener('load', () => {
        //URL.revokeObjectURL(url);
        resolve(img);
      });

      img.addEventListener('error', () => {
        reject(new Error('Error loading image'));
      });
      
      img.src = url;
    });
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        resolve(reader.result);
      });

      reader.addEventListener("error", () => {
        reject(new Error(`Error occurred reading file: ${file.name}`));
      });

      reader.readAsDataURL(file);
    })
}
