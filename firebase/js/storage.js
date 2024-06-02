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

function uploadFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let randomId = Math.random().toString(36).substr(2);
      storage.ref().child('images').child('Competición').putString(reader.result, "data_url")
       .then((snapshot) => {
          resolve(snapshot.downloadURL);
        })
       .catch(() => {
          reject();
        });
    }
  }