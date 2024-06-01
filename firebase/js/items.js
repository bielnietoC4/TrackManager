const Competición = db.collection("Competición");

function add(id, doc) {
  db.collection("Competición").doc(id).set(doc);
  loadCompetición()
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
        console.log("Archivo subido correctamente");
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
        console.error("Error al subir archivo:", error);
      });
  }

loadCompetición();

function deleteItem(id) {
  db.collection("Competición").doc(id).delete()
    .then(() => {
      console.log("Elemento eliminado correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar elemento:", error);
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
  db.collection("Competición").onSnapshot((querySnapshot) => {
    let tableHtml = `
      <tr>
        <th>Logo</th>
        <th>Nombre</th>
        <th>Categoria</th>
        <th>Circuitos</th>
        <th>Equipos</th>
        <th>Fecha de inicio</th>
        <th>Fecha de fin</th>
        <th>Acciones</th>
      </tr>
    `;
    querySnapshot.forEach((doc) => {
      let nombreCompeticion = doc.id;
      let row = `
        <tr>
          <td><img src="${doc.data().logo.url}" width="50" height="50"></td>
          <td>${nombreCompeticion}</td>
          <td>${doc.data().categoria}</td>
          <td>${doc.data().circuitos}</td>
          <td>${doc.data().equipos}</td>
          <td>${doc.data().data_inici}</td>
          <td>${doc.data().data_fi}</td>
          <td>
            <button class="btn btn-danger" onclick="deleteItem('${doc.id}')">Eliminar</button>
            <button class="btn btn-primary" onclick="editItem('${doc.id}', ${JSON.stringify(doc.data())})">Editar</button>
          </td>
        </tr>
      `;
      tableHtml += row;
    });
    let tableResponsive = document.querySelector(".table-responsive");
    let table = tableResponsive.querySelector("table");
    if (!table.querySelector("tbody")) {
      let tbody = document.createElement("tbody");
      table.appendChild(tbody);
    }
    table.querySelector("tbody").innerHTML = tableHtml;
  });
}

function updateItem(id, doc, imatgeModificada) {
  if (imatgeModificada) {
    let logoFile = doc.logo;
    let logoName = logoFile.name;
    let logoType = logoFile.type;
    let logoSize = logoFile.size;
    
    let storageRef = firebase.storage().ref();
    let logoRef = storageRef.child(`/images/Competición${logoName}`);
    
    logoRef.put(logoFile)
      .then(() => {
        logoRef.getDownloadURL()
          .then((url) => {
            data.logo = url;
            updateItem(id, data); // Llama a la función updateItem de items.js
            loadCompetición();
          })
          .catch((error) => {
            console.error("Error al intentar obtener la URL del logo:", error);
          });
      })
      .catch((error) => {
        console.error("Error al intentar subir el logo:", error);
      });
  } else {
    updateItem(id, data); // Llama a la función updateItem de items.js
  }
}

