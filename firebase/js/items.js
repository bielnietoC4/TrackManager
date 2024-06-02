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
  function uploadFile(logoFile, id) {
    let storageRef = firebase.storage().ref();
    let logoRef = storageRef.child(`logoFile/images/Competición/undefined/${logoFile.name}`);
    logoRef.put(logoFile)
        .then(() => {
            logoRef.getDownloadURL()
                .then((url) => {
                    updateLogoUrl(id, url); // update the logo URL in Firestore
                })
                .catch((error) => {
                    console.error("Error al intentar obtener la URL del logo:", error);
                });
        })
        .catch((error) => {
            console.error("Error al intentar subir el logo:", error);
        });
}

function updateLogoUrl(id, url) {
    let docRef = db.collection("Competición").doc(id);
    docRef.update({
        logo: {
            url: url
        }
    })
        .then(() => {
            console.log("Logo URL actualizada correctamente");
        })
        .catch((error) => {
            console.error("Error al actualizar la URL del logo:", error);
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

function editItem(id, data) {
  let editContainer = document.getElementById("editContainer");
  editContainer.style.display = "block";
  
  let formHtml = `
    <form id="editForm">
      <div class="form-group">
        <label for="logo">Logo</label>
        <input type="text" class="form-control" id="logo" value="${data.logo.url}">
      </div>
      <div class="form-group">
        <label for="categoria">Categoría</label>
        <input type="text" class="form-control" id="categoria" value="${data.categoria}">
      </div>
      <div class="form-group">
        <label for="circuitos">Circuitos</label>
        <input type="text" class="form-control" id="circuitos" value="${data.circuitos}">
      </div>
      <div class="form-group">
        <label for="equipos">Equipos</label>
        <input type="text" class="form-control" id="equipos" value="${data.equipos}">
      </div>
      <div class="form-group">
        <label for="data_inici">Fecha de inicio</label>
        <input type="date" class="form-control" id="data_inici" value="${data.data_inici}">
      </div>
      <div class="form-group">
        <label for="data_fi">Fecha de fin</label>
        <input type="date" class="form-control" id="data_fi" value="${data.data_fi}">
      </div>
      <button type="button" id="updateButton" class="btn btn-primary">Actualizar</button>
      <button type="button" id="cancelButton" class="btn btn-default">Cancelar</button>
    </form>
  `;
  
  editContainer.innerHTML = formHtml;
  
  document.getElementById("updateButton").addEventListener("click", function() {
    // Actualiza la competición en la base de datos
    db.collection("Competición").doc(id).update({
     logo: { url: document.getElementById("logo").value },
      categoria: document.getElementById("categoria").value,
      circuitos: document.getElementById("circuitos").value,
      equipos: document.getElementById("equipos").value,
      data_inici: document.getElementById("data_inici").value,
      data_fi: document.getElementById("data_fi").value
    })
   .then(function() {
      // Oculta el formulario de edición
      editContainer.style.display = "none";
      // Actualiza la tabla de competiciones
      loadCompetición();
    })
   .catch(function(error) {
      console.error("Error actualizando competición:", error);
    });
  });
  
  document.getElementById("cancelButton").addEventListener("click", function() {
    // Oculta el formulario de edición
    editContainer.style.display = "none";
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
            <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${doc.id}')">Editar</button>
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

function getEditFunction(id, data) {
  return function() {
    editItem(id, data);
  };
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

