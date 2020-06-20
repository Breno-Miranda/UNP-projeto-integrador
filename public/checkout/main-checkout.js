// imports firebase 
const db = firebase.firestore();

Vue.use(VMoney)

var app = new Vue({
    el: '#app',
    data() {
        return {
            itens: any = [],
            total: 0,
            subtotal: 0,
            discount: 0,
            changer: 0,
            form_payment: any = [],
        }
    },
    methods: {
        _getitens: function() {

            this.total = 0;
            this.discount = 0;
            this.subtotal = 0;

            this.itens = JSON.parse(localStorage.getItem('checkout'))

            if (this.itens) {
                this.itens.forEach((item, index) => {
                    this.total += parseFloat(item.total);
                    this.discount += parseFloat(item.discount);
                    this.subtotal += parseFloat(item.total - item.discount);
                });
            } else {
                this.itens = [];
            }

        },
        handlesumitens: function(index, item) {

            data = JSON.parse(localStorage.getItem('checkout'))

            data[index]['amount'] += 1;

            data[index]['total'] = data[index]['amount'] * (data[index]['total_product']).toString().replace(",", ".")
            data[index]['discount'] = data[index]['amount'] * (data[index]['discount_value']).toString().replace(",", ".")

            if (typeof(Storage) !== "undefined") {

                localStorage.setItem("checkout", JSON.stringify(data));

                this._getitens();

            } else {
                M.toast({ html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.' })
            }
        },
        handlenegativeitens: function(index, item) {

            data = JSON.parse(localStorage.getItem('checkout'))

            data[index]['amount'] -= 1;

            data[index]['total'] = data[index]['amount'] * (data[index]['total_product']).toString().replace(",", ".")
            data[index]['discount'] = data[index]['amount'] * (data[index]['discount_value']).toString().replace(",", ".")

            if (typeof(Storage) !== "undefined") {

                localStorage.setItem("checkout", JSON.stringify(data));

                this._getitens();

            } else {
                M.toast({ html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.' })
            }
        },
        handledelete: function(index) {

            this.itens.splice(index, 1);

            if (typeof(Storage) !== "undefined") {

                localStorage.setItem("checkout", JSON.stringify(this.itens));

                this._getitens();

            } else {
                M.toast({ html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.' })
            }

        },
        lastset: function() {

            if (typeof(Storage) !== "undefined") {

                localStorage.setItem("order-checkout", JSON.stringify({
                    total: this.total,
                    discount: this.discount,
                    subtotal: this.subtotal,
                    form_payment: this.form_payment,
                    changer: this.changer,
                    type_order: null
                }));

                window.location.href = "/finish";

            } else {
                M.toast({ html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.' })
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
        loadChenger: function() {
            this.changer = prompt("Nos informe o troco porfavor", this.total);
        }
    },
    beforeMount() {
        this._getitens()
    }
});