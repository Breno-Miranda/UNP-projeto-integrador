// imports firebase 
const db = firebase.firestore();

// timestamp
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');

var app = new Vue({
    el: '#app',
    data() {
        return {
            full_name: null,
            car_placa: null,
            whatsapp: null,
            zipcode: null,
            address: null,
            number_house: null,
            neighborhood: null,
            state: null,
            reference: null,
            complement: null,
            ismain: false,
            isvalidzipcode: false,
        }
    },
    methods: {

        viacep: function() {
            if (this.zipcode != null && this.zipcode.length == 8) {
                $.getJSON("https://viacep.com.br/ws/" + this.zipcode + "/json", (result) => {
                    if (("erro" in result)) {
                        alert('cep não encontrado')
                        this.isvalidzipcode = false;
                    } else {
                        this.address = result.localidade
                        this.neighborhood = result.bairro
                        this.state = result.uf
                        this.isvalidzipcode = true;
                    }
                });
            }
        },

        finalizarOrder: function(e) {

            if (this.zipcode != null && this.number_house != null && this.neighborhood != null && this.address != null) {

                if (JSON.parse(localStorage.getItem('order-checkout'))) {

                    $('#btnFinalize').prop('disabled', true);

                    M.toast({ html: 'Estamos processando seu pedido . . .' });

                    data = Object.assign(JSON.parse(localStorage.getItem('order-checkout')), {
                        itens: JSON.parse(localStorage.getItem('checkout')),
                        full_name: this.full_name,
                        car_placa: this.car_placa,
                        whatsapp: this.whatsapp,
                        address: {
                            zipcode: this.zipcode,
                            address: this.address,
                            number_house: this.number_house,
                            neighborhood: this.neighborhood,
                            state: this.state,
                            reference: this.reference,
                            complement: this.complement,
                            ismain: this.ismain
                        },
                        date_time_formatted: timestamp_formatted,
                        date_time: timestamp,
                        activate: true,
                        status: "Aberto",
                        userPreparation: null,
                        date_time_finish: null,
                    });

                    db.collection('orders').add(data).then((doc_order) => {

                        M.toast({ html: 'Seu pedido sai em 3 minutinhos ... Estamos preparando tudo para seu conforto e segurança.' });

                        this.upgradestock();

                        localStorage.clear();

                        localStorage.setItem('tokemlastorder', doc_order.id);

                        localStorage.setItem('user', JSON.stringify({
                            full_name: this.full_name,
                            car_placa: this.car_placa,
                            whatsapp: this.whatsapp,
                            address: {
                                zipcode: this.zipcode,
                                address: this.address,
                                number_house: this.number_house,
                                neighborhood: this.neighborhood,
                                state: this.state,
                                reference: this.reference,
                                complement: this.complement,
                                ismain: this.ismain
                            },
                        }));

                        db.collection('orders-status').add({
                            date_time_formatted: timestamp_formatted,
                            date_time: timestamp,

                            activate: true,
                            uid_order: doc_order.id,
                            status: "aberto",
                            fase: 1,
                            percentage: '40%',
                        });

                        setTimeout(() => {
                            window.location.href = "/finish/waiting"
                        }, 500);

                    }).catch(() => {
                        M.toast({ html: 'Ocorreu um error! Tente novamente mais tarde.' });
                    });
                } else {
                    M.toast({ html: 'Sem itens no carrinho. A order de pedidos não foi gerada, mas os seus dados foram cadastrado com sucesso.' });

                    setTimeout(() => {
                        window.location.href = "/"
                    }, 500);
                }
            } else {
                M.toast({ html: 'Por favor! Preencher todos os campos obrigatorios.' });
            }

            e.preventDefault();
        },
        upgradestock: function() {
            let itens = JSON.parse(localStorage.getItem('checkout'))
            itens.forEach((item) => {
                db.collection('products').doc(item.uid).get().then((querySnapshot) => {

                    if (querySnapshot.exists) {
                        db.collection('products').doc(querySnapshot.id).update({
                            stock: Number(querySnapshot.data().stock) - Number(item.amount),
                        })
                    } else {
                        return false;
                    }
                });
            });
        }
    },
    beforeMount() {
        user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            this.full_name = user.full_name;
            this.car_placa = user.car_placa;
            this.whatsapp = user.whatsapp;
            this.zipcode = user.address.zipcode
            this.address = user.address.address
            this.number_house = user.address.number_house
            this.neighborhood = user.address.neighborhood
            this.state = user.address.state
            this.reference = user.address.reference
            this.complement = user.address.complement
        }
    }
});