// importando firebase 
const userauth = firebase.auth()
const database = firebase.database();
const db = firebase.firestore();

//  montando url (capitura de parametros)
const Url = window.location.host;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// PARAMETROS PADRÕES
const uid = urlParams.get('uid')
const page = urlParams.get('page')
const section = urlParams.get('section')
const keyuser = urlParams.get('keyUser')
const action = urlParams.get('action')

// capiturar as informações do campo input form
var first_name = document.getElementById("first_name");
var placa = document.getElementById("placa");
var whatsapp = document.getElementById("whatsapp");

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

// create customer authtetication firebase 
function createAndUpcustomer() {

    if (!action) {

        try {
            db.collection('users-customers').doc().set({
                name: first_name.value,
                placa: placa.value,
                whatsapp: whatsapp.value,
                date_time_formatted: timestamp_formatted,
                date_time: timestamp,
                activate: false,
            })
            var toastHTML = '<span>Criado com sucesso !</span>';
            M.toast({ html: toastHTML, displayLength: 2000 });

        } catch (error) {
            console.log(error.message)
        }

    } else {

        try {

            db.collection('users-customers').doc(keyuser).update({
                name: first_name.value,
                placa: placa.value,
                whatsapp: whatsapp.value,
                date_time_formatted: timestamp_formatted,
                date_time: timestamp,
                activate: false,
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

    db.collection("users-customers").limit(100).get().then(function(documentSnapshots) {
        documentSnapshots.forEach(function(item) {
            dataSet.push([item.id, item.data().name, item.data().placa, item.data().whatsapp, item.data().activate])
        });
        dataSet.reverse()

        var table = $('#tableQuery').DataTable({
            data: dataSet,
            "order": [
                [0, 'desc'],
            ],
            columns: [
                { title: "chave do usuário" },
                { title: "Nome" },
                { title: "placa (Veiculo)" },
                { title: "Celular (Whatsapp)" },
                { title: "status" },
                { title: "action" },
            ],
            "columnDefs": [{
                "targets": -1,
                "data": null,
                "defaultContent": "<a class='icon-detail' href='javascript:void(0)' title='detalhes de clientes'><i class='material-icons'>border_color</i></a> <a class='icon-detail-del' href='javascript:void(0)' title = 'excluir clientes'><i class='material-icons'>delete</i></a >  "
            }]
        });

        $('a.icon-detail').on('click', 'i', function() {
            var data = table.row($(this).parents('tr')).data();
            window.location.href = "?section=section-form&uid=" + data[4] + "&keyUser=" + data[0] + "&action=up"
        });

        $('a.icon-detail-del').on('click', 'i', function() {
            if (confirm(" Deseja deletar este item ?")) {
                var data = table.row($(this).parents('tr')).data();
                db.collection('category').doc(data[0]).delete();
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

// puxar informações detalhadas de customer especifico 
function getUserDetail() {
    // validar
    if (keyuser != null) {
        db.collection('users-customers').doc(keyuser).get().then(querySnapshot => {
            $('#bind-uid').text(keyuser)
            $('#bind-keyuser').text(querySnapshot.data().uid);
            $('#bind-fullname').text(querySnapshot.data().name + ' ' + querySnapshot.data().surname);
            $('#bind-username').text(querySnapshot.data().name);
            $('#bind-email').text(querySnapshot.data().email);
            $('#bind-activate').text(querySnapshot.data().activate ? 'ativo' : 'inativo');
        });
    }
}
// puxando as informações de customer especifico
function getUserId() {
    $('#password').hide();
    db.collection('users-customers').doc(keyuser).get().then((querySnapshot) => {
        $('#first_name').val(querySnapshot.data().name)
        $('#placa').val(querySnapshot.data().placa)
        $('#whatsapp').val(querySnapshot.data().whatsapp)
    });
}