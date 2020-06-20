// importando firebase 
const db = firebase.firestore();

var app = new Vue({
    el: '#app',
    data() {
        return {
            products: any = [],
            productsPromotions: any = [],
            lastObj: any,
            pageSizer: 2,
            // ações de mensagem e buttons
            preload: true,
            loadBtn: false,
            mensagem: false,
            // itens selecionados
            itens: any = [],
        }
    },
    methods: {
        getProductsPromotions: function() {
            db.collection("products").where("promotion", "==", true).where("activate", "==", true).get().then((documentSnapshots) => {
                documentSnapshots.forEach((item) => {
                    data = Object.assign({ id: item.id }, item.data());
                    this.productsPromotions.push(data)
                });
                setTimeout(() => {
                    $('.carousel').carousel();
                    $('.slider').slider();
                }, 500);
            })

        },
        getProducts: function() {
            db.collection("products").limit(this.pageSizer).where("activate", "==", true).get().then((documentSnapshots) => {
                this.lastObj = documentSnapshots.docs[documentSnapshots.docs.length - 1];
                documentSnapshots.forEach((item) => {
                    data = Object.assign({ id: item.id }, item.data());
                    this.products.push(data)
                });
            })
        },
        paginationLoad: function() {

            this.preload = true;

            setTimeout((e) => {
                this.preload = false;
            }, 1000)

            try {
                db.collection("products").startAfter(this.lastObj).limit(this.pageSizer).where("activate", "==", true).get().then((documentSnapshots) => {
                    this.lastObj = documentSnapshots.docs[documentSnapshots.docs.length - 1];
                    documentSnapshots.forEach((item) => {
                        data = Object.assign({ id: item.id }, item.data());
                        this.products.push(data)
                    });
                });
            } catch (error) {
                this.preload = false;
                setTimeout((e) => {
                    this.mensagem = "Sem mais informações";
                }, 1000)
            }
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
        $('.carousel').carousel();
        $('.slider').slider();
        this.getProducts()
        this.getProductsPromotions();
        this.preload = true
        setTimeout(() => {
            this.preload = false
            this.loadBtn = true
        }, 2000);
    }
});