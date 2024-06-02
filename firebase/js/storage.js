const storage = firebase.storage();

function deleteFile(url) {
    return new Promise((resolve, reject) => {
        storage.refFromURL(url).delete()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let randomId = Math.random().toString(36).substr(2);
            let uploadTask = storage.ref().child('images').child('Competición').child(randomId).putString(reader.result, "data_url");

            uploadTask.on('state_changed', 
                (snapshot) => {},
                (error) => {
                    reject(error);
                }, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        };
        reader.onerror = error => reject(error);
    });
}
