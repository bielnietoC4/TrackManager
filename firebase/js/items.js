const Competición = db.collection("Competición");

function addItem(doc) {
    add(Competición, doc)
        .then(() => {
            loadCompetición();

            document.getElementById("nombre").value = nombre;
            document.getElementById("image").value = "";
            

            showAlert("Element guardat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar guardar l'element", "alert-danger");
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

function updateItem(id, doc) {
    updateById(Competición, id, doc)
        .then(() => {
            loadCompetición();

            document.getElementById("elementId").value = "";
            document.getElementById("nombre").value = "";
            document.getElementById("content").value = "";
            document.getElementById("image").value = "";
            document.getElementById("thumbnail").style.visibility = "hidden";

            showAlert("Element actualitzat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar actualitzat l'element", "alert-danger");
        });
}