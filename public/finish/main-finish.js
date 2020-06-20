// imports firebase 
const db = firebase.firestore();

var app = new Vue({
    el: '#app',
    data() {
        return {}
    },
    methods: {
        select_action_user: function(value) {
            if (value == true) {
                $('.userYes').css({ 'color': '#26a69a' });
                $('.userNo').css({ 'color': 'grey' });
                localStorage.setItem("order-checkout", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('order-checkout')), { isnewuser: !value })));
                setTimeout(() => {
                    window.location.href = "/finish/type-order/"
                }, 200);
            } else {
                $('.userNo').css({ 'color': '#26a69a' });
                $('.userYes').css({ 'color': 'grey' });
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = "/"
                }, 200);
            }
        }
    },
    beforeMount() {}
});