const Competición = db.collection("Competición");

async function add(id, doc, logoFile) {
  try {
    // Subir el archivo al almacenamiento de Firebase
     uploadFile(logoFile, id);
    
    // Añadir el documento a la colección en Firestore
    await db.collection("Competición").doc(id).set(doc);
    
    // Recargar los datos
    loadCompetición();
    
    console.log("El elemento se creó correctamente");
  } catch (error) {
    console.error("Error al intentar crear el elemento:", error);
  }
}


function loadCompetición() {
  const tableResponsive = document.querySelector(".table-responsive");
  const table = tableResponsive.querySelector("table");
  let tbody = table.querySelector("tbody");

  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  db.collection("Competición").onSnapshot((querySnapshot) => {
    let rowsHtml = `
    <br>
    <br>
    <br>
    <br>
    <br>
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
      const data = doc.data();
      const nombreCompeticion = doc.id;
      const rowHtml = `
        <tr id="row-${doc.id}">
          <td><img src="${data.logo_url}" width="50" height="50"></td>
          <td>${nombreCompeticion}</td>
          <td>${data.categoria}</td>
          <td>${data.circuitos}</td>
          <td>${data.equipos}</td>
          <td>${data.data_inici}</td>
          <td>${data.data_fi}</td>
          <td>
            <button class="btn btn-danger" onclick="deleteItem('${doc.id}')">Eliminar</button>
            <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${doc.id}')">Editar</button>
          </td>
        </tr>
      `;
      rowsHtml += rowHtml;
    });

    tbody.innerHTML = rowsHtml;
  });
}




function updateItem(id, doc, imatgeModificada) {

  if (imatgeModificada) {
    let logoFile = doc.logo_url;

    // No es necesario obtener el nombre del archivo si ya se tiene la URL

    let storageRef = firebase.storage().ref();
    let logoRef = storageRef.child(`/images/Competición/${id}`);

    fetch(logoFile)
      .then(response => response.blob())
      .then(blob => {
        logoRef.put(blob)
          .then(() => {
            logoRef.getDownloadURL()
              .then((url) => {
                // Actualizar el campo 'logo_url' en el documento
                doc.logo_url = url;
                // Llamar a la función de actualización en Firestore
                updateDoc(id, doc);
              })
              .catch((error) => {
                console.error("Error al intentar obtener la URL del logo:", error);
              });
          })
          .catch((error) => {
            console.error("Error al intentar subir el logo:", error);
          });
      })
      .catch((error) => {
        console.error("Error al obtener el archivo del logo:", error);
      });
  } else {
    // Si no se modificó la imagen, llamar directamente a la función de actualización en Firestore
    updateDoc(id, doc);
  }
}










