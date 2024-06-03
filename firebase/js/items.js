async function add(id, doc) {
  try {
    // Verificar que 'doc' no sea undefined
    if (!doc || typeof doc !== 'object') {
      throw new Error("Documento inválido");
    }

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

async function updateItem(id, doc) {
  try {
    if (!doc || typeof doc !== 'object') {
      throw new Error("Documento inválido");
    }

    // Actualizar el documento en Firestore
    await db.collection("Competición").doc(id).update(doc);

    console.log("Elemento actualizado correctamente");
  } catch (error) {
    console.error("Error al intentar actualizar el elemento:", error);
  }
}










