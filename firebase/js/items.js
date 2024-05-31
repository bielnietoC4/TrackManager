const Competición = db.collection("Competición");

function add(id, doc) {
    db.collection("Competiciones").doc(id).set(doc)
      .then(() => {
        console.log("Element creat correctament");
        uploadFile(logoFile, id); // upload the file to Firebase Storage
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
    db.collection("Competiciones").doc(id).update({
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
    deleteById(Competición, id)
        .then(() => {
            loadCompetición();
            showAlert("Element eliminat correctament", "alert-success");
        }).catch(() => {
            showAlert("Error al intentar eliminar l'element", "alert-danger");
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
            document.getElementById("listCompetición").innerHTML = `<tr>
                                                                <th></th>
                                                                <th>Nombre Competición</th>
                                                                <th>Categoría</th>
                                                                <th>Inicio</th>
                                                                <th>Final</th>
                                                                <th>Circuitos</th>
                                                                <th>Equipos</th>
                                                            </tr>`;
            arrayCompetición.forEach((doc) => {
                let image = "";
                if (doc.data().image != null) {
                    image = `<img src="${doc.data().image}" class="rounded" style="max-width: 100px; max-height: 100px;" "alt="${doc.data().nombre}">`;
                }
                document.getElementById("listCompetición").innerHTML += `<tr>
                                                                        <td>${image}</td>
                                                                        <td>${doc.data().nombre}</td>
                                                                        <td>${doc.data().category}</td>
                                                                        <td>${doc.data().inicio}</td>
                                                                        <td>${doc.data().final}</td>
                                                                        <td>${doc.data().circuitos}</td>
                                                                        <td>${doc.data().equipos}</td>
                                                                        <td>
                                                                            <button type="button" class="btn btn-danger float-right" onclick="eliminar('${doc.id}', '${doc.data().image}')">
                                                                                Eliminar
                                                                            </button>
                                                                            <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${doc.id}')">
                                                                                Editar
                                                                            </button>
                                                                        </td>
                                                                    </tr>`;
            });
        })
        .catch(() => {
            showAlert("Error al mostrar els elements", "alert-danger");
        });
}

function updateItem(id, data) {
    db.collection("Competiciones").doc(id).update(data)
      .then(() => {
        console.log("Element actualitzat correctament");
      })
      .catch((error) => {
        console.error("Error al intentar actualitzat l'element:", error);
      });
  }