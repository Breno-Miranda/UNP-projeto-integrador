// importando firebase 
const userauth = firebase.auth()
const database = firebase.database();
const db = firebase.firestore();

//  montando url (capitura de parametros)
const Url = window.location.host;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// PARAMETROS PADRÕES
const section = urlParams.get('section')
const uid = urlParams.get('uid')
const keyuser = urlParams.get('keyUser')
const action = urlParams.get('action')
const page = urlParams.get('page')

// capiturar as informações do campo input form
var first_name = document.getElementById("first_name");
var surname = document.getElementById("surname");
var email = document.getElementById("email");
var password = document.getElementById("password");

// pegando a data e hora atual
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');

// ROTAS VIAS SECTION
if (section == 'section-list') {
    getAllUsersAdmin();
    document.getElementById("section-list").style.display = "block";
} else if (section == 'section-form') {

    if (action == "up") {
        getUserId()
    }
    document.getElementById("section-form").style.display = "block";
} else if (section == 'section-logs') {
    document.getElementById("section-logs").style.display = "block";
} else if (section == 'section-detail') {
    getUserDetail()
    document.getElementById("section-detail").style.display = "block";
}

// criar usuario authtetication firebase 
function createAndUpUsers() {

    if (!action) {
        try {
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(data) {

                    try {
                        keyUserCustomer = 'te';
                        db.collection('users-admin').doc().set({
                            name: first_name.value,
                            surname: surname.value,
                            email: email.value,
                            date_time_formatted: timestamp_formatted,
                            date_time: timestamp,
                            activate: false,
                            uid: data.user['uid'],
                        })

                        var toastHTML = '<span>Criado com sucesso !</span>';
                        M.toast({ html: toastHTML, displayLength: 2000 });

                    } catch (error) {
                        console.log(error.message)
                    }

                })
                .catch(function(error) {
                    M.toast({ html: error.message, displayLength: 100000 });
                });

        } catch (error) {
            M.toast({ html: error.message, displayLength: 100000 });
        }
    } else {

        try {

            db.collection('users-admin').doc(keyuser).update({
                name: first_name.value,
                surname: surname.value,
                email: email.value,
            })

            var toastHTML = '<span>Atualizado com sucesso !</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });

        } catch (error) {
            console.log(error.message)
        }
    }

}



// capitura as informaçõesde usuário e exibir na tabela.
function getAllUsersAdmin() {

    var dataSet = [];

    db.collection("users-admin").limit(100).get().then(function(documentSnapshots) {
        documentSnapshots.forEach(function(item) {
            dataSet.push([item.id, item.data().name, item.data().surname, item.data().email, item.data().uid, item.data().activate])
        });

        var table = $('#tableQuery').DataTable({
            data: dataSet,
            columns: [
                { title: "chave do usuário" },
                { title: "Nome" },
                { title: "Sobrenome" },
                { title: "email" },
                { title: "uid" },
                { title: "status" },
                { title: "action" },
            ],
            "columnDefs": [
                { "visible": false, "targets": 4 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<a class='icon-detail' href='javascript:void(0)' title='detalhes de usuários'><i class='material-icons'>border_color</i></a> <a class='icon-detail-del' href='javascript:void(0)' title = 'excluir usuários'><i class='material-icons'>delete</i></a >  "
                }
            ]

        });

        $('a.icon-detail').on('click', 'i', function() {
            var data = table.row($(this).parents('tr')).data();
            window.location.href = "?section=section-form&uid=" + data[0] + "&action=up"
        });

        $('a.icon-detail-del').on('click', 'i', function() {
            if (confirm(" Deseja deletar este item ?")) {
                var data = table.row($(this).parents('tr')).data();
                db.collection('users-admin').doc(data[0]).delete();
                var toastHTML = '<span>Exclusão efetuada com sucesso!</span>';
                M.toast({ html: toastHTML, displayLength: 2000 });
                setInterval(() => { document.location.reload(true); }, 2000);
            } else {
                var toastHTML = '<span>Calma, O item foi mantido !</span>';
                M.toast({ html: toastHTML, displayLength: 2000 });
            }
        });
    });
}

// puxar informações detalhadas de usuario especifico 
function getUserDetail() {
    // validar
    if (keyuser != null) {
        db.collection('users-admin').doc(keyuser).get().then(querySnapshot => {
            $('#bind-uid').text(keyuser)
            $('#bind-keyuser').text(querySnapshot.data().uid);
            $('#bind-fullname').text(querySnapshot.data().name + ' ' + querySnapshot.data().surname);
            $('#bind-username').text(querySnapshot.data().name);
            $('#bind-email').text(querySnapshot.data().email);
            $('#bind-activate').text(querySnapshot.data().activate ? 'ativo' : 'inativo');
        });
    }
}
// puxando as informações de usuario especifico
function getUserId() {
    $('#password').hide();
    db.collection('users-admin').doc(keyuser).get().then((querySnapshot) => {
        $('#first_name').val(querySnapshot.data().name)
        $('#surname').val(querySnapshot.data().surname)
        $('#email').val(querySnapshot.data().email)
    });
}