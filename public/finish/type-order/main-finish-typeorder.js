// imports firebase 
const db = firebase.firestore();

// timestamp
var timestamp = moment().format();
var timestamp_formatted = moment().format('DD/MM/YYYY, h:mm:ss a');


var app = new Vue({
    el: '#app',
    data() {
        return {

        }
    },
    methods: {
        select_type_order: function(value, isvalidation) {
            if (isvalidation == true) {
                $('.drivethru').css({ 'color': '#26a69a' });
                $('.delivery').css({ 'color': 'grey' });
                localStorage.setItem("order-checkout", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('order-checkout')), { type_order: value })));
                setTimeout(() => {
                    window.location.href = "/finish/verify-drivethru"
                }, 200);
            } else {
                $('.delivery').css({ 'color': '#26a69a' });
                $('.drivethru').css({ 'color': 'grey' });
                localStorage.setItem("order-checkout", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('order-checkout')), { type_order: value })));
                setTimeout(() => {
                    window.location.href = "/finish/verify-delivery"
                }, 200);
            }

        },
    },
    beforeMount() {

    }
});