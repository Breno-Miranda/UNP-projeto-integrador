// imports firebase 
const db = firebase.firestore();

// timestamp
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');


var app = new Vue({
    el: '#app',
    data() {
        return {
            token: localStorage.getItem('tokemlastorder'),
            status: any = [],
            order: null,
            whatsapp: '88330532',
        }
    },
    methods: {
        getStatus: function() {

            if (this.token != null) {
                db.collection("orders-status").limit(3).where('uid_order', '==', this.token).get().then((documentSnapshots) => {
                    documentSnapshots.forEach((item) => {
                        this.status[item.data().fase - 1] = (Object.assign({ id: item.id }, item.data()));
                    });
                });
            } else {
                this.status = [];
            }

        },
        getOrder: function() {
            if (this.token != null) {
                db.collection("orders").doc(this.token).get().then((documentSnapshots) => {
                    this.order = Object.assign({ uid: documentSnapshots.id }, documentSnapshots.data());
                })
            } else {
                this.order = [];
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
        requestFinish: function() {
            M.toast({
                html: 'Obrigado pela preferencia!! Te esperamos novamente.',
                displayLength: 2000
            });
            setTimeout((e) => {
                localStorage.removeItem('tokemlastorder');
                setTimeout(() => {
                    window.location.href = "/"
                }, 100);
            }, 2000);
        }
    },
    beforeMount() {
        this.getStatus();
        this.getOrder();

        setInterval((e) => {
            this.getStatus();
            this.getOrder();
        }, 10000);
    }
});