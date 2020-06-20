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
const action = urlParams.get('action')
const section = urlParams.get('section')

// pegando a data e hora atual
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');

// ROTAS VIAS SECTION
if (section == 'section-list') {
    document.getElementById("section-list").style.display = "block";
} else if (section == 'section-form') {
    document.getElementById("section-form").style.display = "block";
}

var app = new Vue({
    el: '#app',
    data() {
        return {
            name: null,
            icon: null,
            activate: null,
        }
    },
    methods: {
        getrow: function() {
            db.collection('category').doc(uid).get().then((querySnapshot) => {
                this.name = querySnapshot.data().name
                this.icon = querySnapshot.data().icon
                this.date_time_formatted = querySnapshot.data().date_time_formatted
                this.date_time = querySnapshot.data().date_time
                this.activate = querySnapshot.data().activate
            });
        },
        getresult: function() {

            var dataSet = [];

            db.collection("category").limit(100).get().then((documentSnapshots) => {
                documentSnapshots.forEach((item) => {
                    dataSet.push([item.id, item.data().icon, item.data().name, item.data().activate])
                });

                dataSet.reverse()

                var table = $('#tableQuery').DataTable({
                    data: dataSet,
                    "order": [
                        [0, 'desc'],
                    ],
                    columns: [
                        { title: "chave do usuário" },
                        { title: "Icon" },
                        { title: "Titulo" },
                        { title: "status" },
                        { title: "action" },
                    ],
                    "columnDefs": [{
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<a class='icon-detail' href='javascript:void(0)' title='detalhes de categoria'><i class='material-icons'>border_color</i></a> <a class='icon-detail-del' href='javascript:void(0)' title = 'excluir categoria'><i class='material-icons'>delete</i></a >  "
                    }]
                });

                $('a.icon-detail').on('click', 'i', function() {
                    var data = table.row($(this).parents('tr')).data();
                    window.location.href = "?section=section-form&uid=" + data[0] + "&action=up"
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
        },
        finalize: function(event) {

            if (!action) {

                try {
                    db.collection('category').doc().set({
                        name: this.name,
                        icon: this.icon,
                        date_time_formatted: timestamp_formatted,
                        date_time: timestamp,
                        activate: Boolean(this.activate),
                    })
                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });

                } catch (error) {
                    var toastHTML = '<span>Tente novamente</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });
                }

            } else {

                try {

                    db.collection('category').doc(uid).update({
                        name: this.name,
                        icon: this.icon,
                        activate: Boolean(this.activate),
                    })

                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });

                } catch (error) {
                    var toastHTML = '<span>Tente novamente</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });
                }
            }
            event.preventDefault();
        }
    },
    beforeMount() {
        this.getresult();
        if (uid) {
            this.getrow();
        }
    }
});