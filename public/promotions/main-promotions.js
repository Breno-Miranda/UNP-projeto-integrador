// importando firebase 
const db = firebase.firestore();

var app = new Vue({
    el: '#app',
    data() {
        return {
            productsPromotions: any = [],
            // itens selecionados
            itens: any = [],
        }
    },
    methods: {
        getProductsPromotions: function() {
            db.collection("products").where("promotion", "==", true).get().then((documentSnapshots) => {
                documentSnapshots.forEach((item) => {
                    data = Object.assign({ id: item.id }, item.data());
                    this.productsPromotions.push(data)
                });
                setTimeout(() => {
                    $('.slider').slider();
                }, 500);
            })

        },
        checkoutItem: function(item) {

            if (JSON.parse(localStorage.getItem('checkout')) != null) {

                this.itens = JSON.parse(localStorage.getItem('checkout'));

                discount_value = item.price * (parseFloat(item.discount) / 100);
                price_discount = item.price - discount_value;

                this.itens.push({ uid: item.id, amount: 1, url_image: item.url_image, discount_percentage: item.discount, discount_value: discount_value, title: item.title, category: item.category, price: item.price, total_product: price_discount, total: price_discount, discount: discount_value })

                if (typeof(Storage) !== "undefined") {

                    localStorage.setItem("checkout", JSON.stringify(this.itens));

                    M.toast({ html: 'O item foi adicionado ao carrinho!', displayLength: 1000 });

                } else {
                    M.toast({
                        html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.',
                        displayLength: 1000
                    });
                }

            } else if (this.itens.length == 0) {

                discount_value = item.price * (parseFloat(item.discount) / 100);
                price_discount = item.price - discount_value;

                this.itens.push({ uid: item.id, amount: 1, url_image: item.url_image, discount_percentage: item.discount, discount_value: discount_value, title: item.title, category: item.category, price: item.price, total_product: price_discount, total: price_discount, discount: discount_value })

                if (typeof(Storage) !== "undefined") {

                    localStorage.setItem("checkout", JSON.stringify(this.itens));

                    M.toast({ html: 'O item foi adicionado ao carrinho!', displayLength: 1000 });

                } else {
                    M.toast({
                        html: 'Seu navegador estar desatualizado! Atualize e volte ao nosso app de delivery.',
                        displayLength: 1000
                    });
                }
            }
        }
    },
    beforeMount() {
        $('.slider').slider();
        this.getProductsPromotions();
    }
});