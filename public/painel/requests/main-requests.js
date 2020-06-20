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
const action = urlParams.get('action')

// pegando a data e hora atual
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');

// ROTAS VIAS SECTION
if (section == 'section-list') {
    document.getElementById("section-list").style.display = "block";
} else if (section == 'section-form') {
    document.getElementById("section-form").style.display = "block";
} else if (section == 'section-logs') {
    document.getElementById("section-logs").style.display = "block";
} else if (section == 'section-detail') {
    document.getElementById("section-detail").style.display = "block";
}


Vue.component('ginput', {
    props: ['title', 'price', 'amount', 'amount', 'total', 'subtotal'],
    template: '<input :value="title || price || amount || total || subtotal">'
})

var app = new Vue({
    el: '#app',
    data() {
        return {
            full_name: null,
            car_placa: null,
            whatsapp: null,
            changer: null,
            form_payment: null,
            discount: null,
            status: null,
            total: null,
            subtotal: null,
            type_order: null,
            date_time: null,
            date_time_finish: null,
            activate: null,
            userPreparation: null,
            itens: any = [],
            address: any = [],

        }
    },
    methods: {
        getrow: function() {
            db.collection('orders').doc(uid).get().then((querySnapshot) => {
                this.full_name = querySnapshot.data().full_name;
                this.car_placa = querySnapshot.data().car_placa;
                this.whatsapp = querySnapshot.data().whatsapp;
                this.form_payment = querySnapshot.data().form_payment;
                this.status = querySnapshot.data().status;
                this.type_order = querySnapshot.data().type_order;
                this.date_time = querySnapshot.data().date_time;
                this.date_time_finish = querySnapshot.data().date_time_finish;
                this.activate = querySnapshot.data().activate;
                this.userPreparation = querySnapshot.data().userPreparation;

                this.changer = (querySnapshot.data().changer);
                this.discount = (querySnapshot.data().discount);
                this.total = (querySnapshot.data().total);
                this.subtotal = (querySnapshot.data().subtotal);
                this.itens = querySnapshot.data().itens

                this.address = querySnapshot.data().address
            });
        },
        getresult: function() {

            var dataSet = [];

            db.collection("orders").limit(100).get().then((documentSnapshots) => {

                documentSnapshots.forEach((item) => {
                    dataSet.push([item.id, item.data().full_name, item.data().date_time, item.data().date_time_finish, parseFloat(item.data().total).toFixed(2), item.data().activate])
                });

                dataSet.reverse()

                var table = $('#tableQuery').DataTable({
                    data: dataSet,
                    "order": [
                        [0, 'desc'],
                    ],
                    columns: [
                        { title: "chave do pedido" },
                        { title: "Cliente" },
                        { title: "Data e hora | Aberto" },
                        { title: "Data e hora | Finalizado" },
                        { title: "Valor Total" },
                        { title: "status" },
                        { title: "action" },
                    ],
                    "columnDefs": [{
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<a class='icon-detail' href='javascript:void(0)' title='detalhes de pedidos'><i class='material-icons'>border_color</i></a> <a class='icon-detail-del' href='javascript:void(0)' title = 'excluir pedidos'><i class='material-icons'>delete</i></a >  "
                    }]
                });

                $('a.icon-detail').on('click', 'i', function() {
                    var data = table.row($(this).parents('tr')).data();
                    window.location.href = "?section=section-form&uid=" + data[0] + "&action=up"
                });

                $('a.icon-detail-del').on('click', 'i', function() {
                    if (confirm(" Deseja deletar este item ?")) {
                        var data = table.row($(this).parents('tr')).data();
                        db.collection('orders').doc(data[0]).delete();
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

                    db.collection('orders').doc().set({
                        full_name: this.full_name,
                        car_placa: this.car_placa,
                        whatsapp: this.whatsapp,
                        changer: this.changer,
                        form_payment: this.form_payment,
                        discount: this.discount,
                        status: this.status,
                        total: this.total,
                        subtotal: this.subtotal,
                        type_order: this.type_order,
                        date_time: this.date_time,
                        date_time_finish: this.date_time_finish,
                        itens: this.itens,
                        address: this.address,
                        activate: this.activate,
                    })
                    var toastHTML = '<span>Criado com sucesso !</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });

                } catch (error) {
                    console.log(error.message)
                }

            } else {

                try {

                    db.collection('orders').doc(uid).update({
                        full_name: this.full_name,
                        car_placa: this.car_placa,
                        whatsapp: this.whatsapp,
                        changer: this.changer,
                        form_payment: this.form_payment,
                        discount: this.discount,
                        status: this.status,
                        total: this.total,
                        subtotal: this.subtotal,
                        type_order: this.type_order,
                        date_time: this.date_time,
                        date_time_finish: this.date_time_finish,
                        itens: this.itens,
                        address: this.address,
                        activate: this.activate,
                    })

                    var toastHTML = '<span>Atualizado com sucesso !</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });

                } catch (error) {
                    console.log(error.message)
                }
            }
            event.preventDefault();
        },

        Recaculation: function(item) {

            this.total = 0;
            this.subtotal = 0;
            this.discount = 0;

            if (item) {
                item['total'] = item.amount * item.price;
                item['discount'] = (item.price * (item.discount_percentage / 100));
                item['discount_value'] = item['amount'] * (item.price * (item.discount_percentage / 100));
                item['subtotal'] = item['total'] - (item['amount'] * item['discount'])


                this.itens.forEach((queryitens) => {
                    this.total += queryitens['total'];
                    this.subtotal += queryitens['total'] - (queryitens['amount'] * queryitens['discount']);
                    this.discount += queryitens['amount'] * queryitens['discount'];
                });

                console.log(this.total)
                console.log(this.subtotal)
                console.log(this.itens)
            }
        },

        formatPrice: function(value) {
            if (value != 0) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            } else {
                return '0,00'
            }
        },
    },
    beforeMount() {
        this.getresult();
        if (uid) {
            this.getrow();
        }
        db.collection("users-admin").limit(100).get().then((documentSnapshots) => {
            documentSnapshots.forEach((obj) => {
                $('#userPreparation').append($('<option>', {
                    value: obj.data().uid,
                    text: obj.data().name + " " + obj.data().surname
                }));
            });
            $('select').formSelect();
        });

        db.collection("products").limit(100).get().then((documentSnapshots) => {
            documentSnapshots.forEach((obj) => {
                $('#itens').append($('<option>', {
                    value: documentSnapshots.id,
                    'data-icon': obj.data().url_image,
                    text: obj.data().title
                }));
            });
            $('select').formSelect();
        });
    },
});