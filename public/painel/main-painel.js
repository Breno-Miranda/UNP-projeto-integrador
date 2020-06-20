// imports firebase 
const db = firebase.firestore();

// timestamp
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');

// timestamp date atual + 1 dia
var start = moment().add(-1, 'd').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format();
var end = moment().add(+1, 'd').format();


// filter vue js
Vue.filter('reverse', function(value) {
    // slice to make a copy of array, then reverse the copy
    return value.slice().reverse();
});


var app = new Vue({
    el: '#app',
    data() {
        return {
            orders: any = [],
            ordersFinishs: any = [],
            ordersPreparations: any = [],
            prepraretionOrders: any = [],
        }
    },
    methods: {
        getorders: function(item) {

            this.orders = [];

            db.collection("orders").limit(50)
                .where("status", "==", "Aberto")
                .where('date_time', '>', start)
                .where('date_time', '<', end)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((item) => {
                        data = Object.assign({ uid: item.id }, item.data());
                        this.orders.push(data);
                    });
                });
        },
        getorderFinish: function() {

            this.ordersFinishs = [];



            db.collection("orders").limit(50)
                .where("status", "in", ["Finalizado", "Cancelado"])
                .where('date_time', '>', start)
                .where('date_time', '<', end)
                .get().then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((item) => {
                            data = Object.assign({ uid: item.id }, item.data());
                            this.ordersFinishs.push(data);
                        });

                    } else {
                        return false;
                    }
                });
        },
        getorderPreparation: function(item) {

            this.prepraretionOrders = [];

            if (item) {
                this.preparation(item);
                db.collection("orders").doc(item.uid).get().then((querySnapshot) => {
                    this.prepraretionOrders.push(Object.assign({ uid: querySnapshot.id }, querySnapshot.data()));
                });
            } else {
                return false;
            }
        },
        getordersPreparations: function() {

            this.ordersPreparations = [];

            db.collection("orders")
                .where("status", "==", "Preparando")
                .where("userPreparation", "==", localStorage.getItem('userid'))
                .where('date_time', '>', start)
                .where('date_time', '<', end)
                .get().then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        querySnapshot.forEach((item) => {
                            data = Object.assign({ uid: item.id }, item.data());
                            this.ordersPreparations.push(data);
                        });
                    } else {
                        return false;
                    }
                });

        },
        preparation: function(item) {

            db.collection("orders").doc(item.uid).get().then((querySnapshot) => {

                if (querySnapshot.data().userPreparation != null) {
                    this.getorders();
                } else {

                    if (localStorage.getItem('userid')) {
                        db.collection("orders").doc(item.uid).update({
                            status: "Preparando",
                            userPreparation: localStorage.getItem('userid'),
                        });

                        db.collection('orders-status').add({
                            date_time_formatted: timestamp_formatted,
                            date_time: timestamp,
                            uid_order: item.uid,
                            status: "Preparando",
                            fase: 2,
                            percentage: '40%',
                        });

                        this.getorders();
                        this.getordersPreparations();
                    } else {
                        alert('userid não foi encontrado')
                    }
                }
            });
        },
        finalizarOrder: function(item) {
            if (item) {
                db.collection("orders").doc(item.uid).update({
                    status: "Finalizado",
                    userPreparation: localStorage.getItem('userid'),
                    date_time_finish: timestamp,
                });
                db.collection('orders-status').add({
                    date_time_formatted: timestamp_formatted,
                    date_time: timestamp,
                    activate: true,
                    uid_order: item.uid,
                    status: "Finalizado",
                    fase: 3,
                    percentage: '20%',
                });

                this.getorders();
                this.getorderFinish();
                this.getordersPreparations();
            } else {
                console.log('O usuário não estar logado.')
            }

        },
        cancelarOrder: function(item) {
            if (item) {
                db.collection("orders").doc(item.uid).update({
                    status: "Cancelado",
                    userPreparation: localStorage.getItem('userid'),
                    date_time_finish: timestamp,
                });

                db.collection('orders-status').add({
                    date_time_formatted: timestamp_formatted,
                    date_time: timestamp,
                    activate: true,
                    uid_order: item.uid,
                    status: "Cancelado",
                    fase: 3,
                    percentage: '20%',
                });
                this.getorders();
                this.getorderFinish();
                this.getordersPreparations();
            } else {
                console.log('O usuário não estar logado.')
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
        this.getorders();
        this.getorderFinish();
        this.getordersPreparations();
        setInterval((e) => {
            this.getorders();
        }, 100000);
    }
});