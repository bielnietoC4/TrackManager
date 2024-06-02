let imatgeModificada = false;

	function showAlert(text, type) {
		document.getElementById("alert").innerText = text;
		document.getElementById("alert").className = "alert " + type;
		document.getElementById("alert").style.display = "block";
		window.setTimeout(function () {
			document.getElementById("alert").style.display = "none";
		}, 2000);
	}

	window.addEventListener("load", function () {
        loadCompetición();
    });

	document.getElementById("login").addEventListener("click", function () {
		let email = document.getElementById("loginEmail").value;
		let password = document.getElementById("loginPassword").value;
	  
		auth.signInWithEmailAndPassword(email, password)
		 .then(function () {
			showAlert("Usuari autenticat", "alert-success");
	  
			document.getElementById("loginForm").style.display = "none";
			document.getElementById("buttonsContainer").style.display = "block";
		  })
		 .catch(function (error) {
			showAlert("Error d’autenticació", "alert-danger");
		  });
	  });

	document.getElementById("newUser").addEventListener("click", function () {
		document.getElementById("loginForm").style.display = "none";
		document.getElementById("signupForm").style.display = "block";
	});

	document.getElementById("signup").addEventListener("click", function () {
		let email = document.getElementById("signupEmail").value;
		let password = document.getElementById("signupPassword").value;
		let passwordConfirm = document.getElementById("signupPasswordConfirm").value;

		if (email.length > 0 && email.indexOf("@") > 1) {
			if (password.length > 0) {
				if (password == passwordConfirm) {
					auth.createUserWithEmailAndPassword(email, password)
						.then(function () {
							showAlert("Usuari creat correctament", "alert-success");

							document.getElementById("loginForm").style.display = "block";
							document.getElementById("signupForm").style.display = "none";
						})
						.catch(function () {
							showAlert("Error al intentar crear l'usuari", "alert-danger");
						});
				} else {
					showAlert("Les contrasenyes no coincideixen", "alert-danger");
				}
			} else {
				showAlert("La contrasenya és obligatòria", "alert-danger");
			}
		} else {
			showAlert("Email incorrecte", "alert-danger");
		}
	});

	document.getElementById("addCompetición").addEventListener("click", function () {
		document.getElementById("CompeticiónForm").style.display = "block";
		document.getElementById("listCompetición").style.display = "block";
	  });

    function clearInputs() {
      const inputs = document.querySelectorAll('input, select');
      inputs.forEach(input => {
          if (input.type === 'text' || input.type === 'date') {
              input.value = '';
          } else if (input.type === 'file') {
              input.value = '';
          } else if (input.type === 'select-one' || input.type === 'select-multiple') {
              input.selectedIndex = -1;
          } else if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = false;
          }
      });
  }

  document.getElementById("guardar").addEventListener("click", function() {
    let id = document.getElementById("elementId").value;
    let categoria = document.getElementById("categoria").value;
    let circuitos = document.getElementById("circuitos").value;
    let equipos = document.getElementById("equipos").value;
    let data_inici = document.getElementById("data_inici").value;
    let data_fi = document.getElementById("data_fi").value;
    let logoFile = document.getElementById("logo").files[0]; 

    // Agregar el documento sin la URL del logo
    let doc = {
        categoria: categoria,
        circuitos: circuitos,
        equipos: equipos,
        data_inici: data_inici,
        data_fi: data_fi
    };

    uploadFile(logoFile, id, doc); 
});

function uploadFile(logoFile, id, doc) {
    if (logoFile) {
        let storageRef = firebase.storage().ref();
        let logoRef = storageRef.child(`/images/Competición/${id}`);
        
        logoRef.put(logoFile)
            .then(() => {
                logoRef.getDownloadURL()
                    .then((url) => {
                        // Asignar la URL del archivo al campo logo_url del documento
                        doc.logo_url = url;
                        
                        // Agregar el documento con la URL del logo
                        add(id, doc);

                        // Limpiar los inputs del formulario
                        clearInputs();
                        
                        // Actualizar el item en la base de datos
                        updateItem(id, doc);
                    })
                    .catch((error) => {
                        console.error("Error al intentar obtener la URL del logo:", error);
                    });
            })
            .catch((error) => {
                console.error("Error al intentar subir el logo:", error);
            });
    } else {
        // Si no hay archivo de logo, agregar el documento sin la URL del logo
        add(id, doc);

        // Limpiar los inputs del formulario
        clearInputs();
        
        // Actualizar el item en la base de datos
        updateItem(id, doc);
    }
}

    document.addEventListener("DOMContentLoaded", function() {
      // Cargar la tabla de competiciones y asignar eventos a botones dinámicos
      loadCompetición();
    
      // Asignar evento al botón de eliminar general
      const eliminarButton = document.getElementById("eliminar");
      if (eliminarButton) {
        eliminarButton.addEventListener("click", function() {
          let id = document.getElementById("elementId").value;
          deleteItem(id);
    
          // Limpiar valores de los inputs
          document.getElementById("elementId").value = "";
          document.getElementById("categoria").value = "";
          document.getElementById("circuitos").value = "";
          document.getElementById("equipos").value = "";
          document.getElementById("data_inici").value = "";
          document.getElementById("data_fi").value = "";
          document.getElementById("logo").value = "";
        });
      }
    });
    
    // Definir la función deleteItem para eliminar el documento de la colección
    function deleteItem(id) {
      db.collection("Competición").doc(id).delete().then(() => {
        console.log("Documento eliminado con ID: ", id);
      }).catch((error) => {
        console.error("Error eliminando documento: ", error);
      });
    }
    

      
	
    function editItem(id) {
        // Obtener una referencia al documento en Firestore
        const docRef = db.collection("Competición").doc(id);
        
        // Obtener el documento
        docRef.get().then(function(doc) {
            if (doc.exists) {
                // Obtener los valores del documento
                const categoria = doc.data().categoria;
                const circuitos = doc.data().circuitos;
                const equipos = doc.data().equipos;
                const data_inici = doc.data().data_inici;
                const data_fi = doc.data().data_fi;
                const logoURL = doc.data().logo_url; // Obtener la URL de la imagen
    
                // Rellenar los campos del formulario con los valores del documento
                document.getElementById("elementId").value = doc.id;
                document.getElementById("categoria").value = categoria;
                document.getElementById("circuitos").value = circuitos;
                document.getElementById("equipos").value = equipos;
                document.getElementById("data_inici").value = data_inici;
                document.getElementById("data_fi").value = data_fi;
    
                // Establecer la URL de la imagen actual en un elemento de imagen para que el usuario pueda verla
                const logoInput = document.getElementById("logo");
                if (logoURL) {
                    logoInput.value = logoURL;
                } else {
                    logoInput.value = ''; // Vaciar el campo si no hay URL de imagen
                }
    
                // Eliminar el campo de entrada de archivo existente
                const logoInputContainer = document.getElementById("logoInputContainer");
                logoInputContainer.innerHTML = '';
    
                // Crear un nuevo campo de entrada de archivo
                const logoInputUpdate = document.createElement("input");
                logoInput.type = "file";
                logoInput.id = "logo";
                logoInput.name = "logo";
                logoInputContainer.appendChild(logoInputUpdate);
    
                // Añadir evento al nuevo campo de entrada de archivo para capturar el archivo seleccionado
                logoInput.addEventListener("change", function() {
                    const newLogoFile = logoInput.files[0];
                    // Aquí puedes hacer lo que necesites con el nuevo archivo seleccionado
                });
    
                // Añadir evento al botón de actualización después de insertar el formulario
                document.getElementById("updateButton").addEventListener("click", function() {
                    // Obtener el valor del campo de archivo
                    const logoFile = document.getElementById("logo").files[0];
                    
                    // Obtener valores del formulario
                    const idUpdate = document.getElementById("elementId").value;
                    const categoriaUpdate = document.getElementById("categoria").value;
                    const circuitosUpdate = document.getElementById("circuitos").value;
                    const equiposUpdate = document.getElementById("equipos").value;
                    const data_iniciUpdate = document.getElementById("data_inici").value;
                    const data_fiUpdate = document.getElementById("data_fi").value;
    
                    // Crear un objeto con los nuevos datos actualizados
                    const updatedDoc = {
                        categoria: categoriaUpdate,
                        circuitos: circuitosUpdate,
                        equipos: equiposUpdate,
                        data_inici: data_iniciUpdate,
                        data_fi: data_fiUpdate,
                        logo_url: logoURL 
                    };
    
                    // Verificar si se ha seleccionado un nuevo logo
                    if (logoFile) {
                        // Subir el nuevo logo a Firebase Storage y actualizar la URL en Firestore
                        uploadFile(logoFile, idUpdate, updatedDoc);
                    } else {
                        // Si no se seleccionó un nuevo logo, actualizar solo los otros datos en Firestore
                        updateItem(idUpdate, updatedDoc);
                    }
                });
            } else {
                // El documento no existe
                console.log("¡El documento no existe!");
            }
        }).catch(function(error) {
            // Manejar cualquier error que pueda ocurrir al obtener el documento
            console.error("Error al obtener documento:", error);
        });
    }
    

    
    
    

