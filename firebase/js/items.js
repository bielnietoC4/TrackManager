const Competición = db.collection("Competición");

function add(id, doc) {
  db.collection("Competición").doc(id).set(doc)
   .then(() => {
      console.log("Element creat correctament");
      uploadFile(logoFile, id); // upload the file to Firebase Storage
      loadCompetición(); // reload the data
    })
   .catch((error) => {
      console.error("Error al intentar crear l'element:", error);
    });
}
  
  // Function to upload the file to Firebase Storage
  function uploadFile(file, id) {
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child(`images/Competición/${id}/${file.name}`);
    fileRef.put(file)
     .then((snapshot) => {
        console.log("File uploaded successfully!");
        // Update the document with the file URL
        db.collection("Competición").doc(id).update({
          logo: {
            name: file.name,
            type: file.type,
            size: file.size,
            url: snapshot.downloadURL
          }
        });
      })
     .catch((error) => {
        console.error("Error uploading file:", error);
      });
  }

loadCompetición();

function deleteItem(id) {
  db.collection("Competición").doc(id).get()
   .then((doc) => {
      if (doc.exists) {
        // Eliminar archivo asociado en el Storage
        var storageRef = firebase.storage().ref();
        var fileRef = storageRef.child(`images/Competición/${id}/${doc.data().logo.name}`);
        fileRef.delete()
         .then(() => {
            console.log("File deleted successfully!");
         })
         .catch((error) => {
            console.error("Error deleting file:", error);
         });
        
        // Eliminar elemento en la base de datos
        doc.ref.delete()
         .then(() => {
            console.log("Element deleted successfully!");
            loadCompetición(); // reload the data
         })
         .catch((error) => {
            console.error("Error deleting element:", error);
         });
      } else {
        console.log("Element not found!");
      }
   })
   .catch((error) => {
      console.error("Error getting element:", error);
   });
}

function editItem(id) {
    document.getElementById("elementId").value = id;
    document.getElementById("thumbnail").style.visibility = "visible";
    selectById(Competición, id)
        .then((doc) => {
            document.getElementById("nombre").value = doc.data().nombre;
            document.getElementById("thumbnail").src = doc.data().image;
        })
        .catch(() => {
            showAlert("Error al intentar editar l'element", "alert-danger");
        });
}

function loadCompetición() {
  selectAll(Competición)
      .then((arrayCompetición) => {
          let tableBody = "";
          arrayCompetición.forEach((doc) => {
              let image = "";
              if (doc.data().logo && doc.data().logo.url) {
                  image = `<img src="${doc.data().logo.url}" class="rounded" style="max-width: 100px; max-height: 100px;" alt="${doc.data().nombre}">`;
              }
              tableBody += `<tr>
                              <td>${image}</td>
                              <td>${doc.data().categoria}</td>
                              <td>${doc.data().circuitos}</td>
                              <td>${doc.data().equipos}</td>
                              <td>${doc.data().data_inici}</td>
                              <td>${doc.data().data_fi}</td>
                              <td>
                                  <button type="button" class="btn btn-danger float-right" onclick="eliminar('${doc.id}', '${doc.data().logo.url}')">
                                      Eliminar
                                  </button>
                                  <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${doc.id}')">
                                      Editar
                                  </button>
                              </td>
                          </tr>`;
          });
          document.getElementById("listCompetición").innerHTML = `<tr>
                                                                  <th></th>
                                                                  <th>Categoría</th>
                                                                  <th>Circuitos</th>
                                                                  <th>Equipos</th>
                                                                  <th>Inicio</th>
                                                                  <th>Final</th>
                                                                  <th>Acciones</th>
                                                              </tr>`;
          document.getElementById("listCompetición").insertAdjacentHTML("beforeend", tableBody);
      })
      .catch(() => {
          showAlert("Error al mostrar els elements", "alert-danger");
      });
}

function updateItem(id, data) {
    db.collection("Competición").doc(id).update(data)
      .then(() => {
        console.log("Element actualitzat correctament");
      })
      .catch((error) => {
        console.error("Error al intentar actualitzat l'element:", error);
      });
  }