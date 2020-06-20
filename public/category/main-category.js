// imports firebase 
const db = firebase.firestore();

var app = new Vue({
    el: '#app',
    data() {
        return {
            pageSizer: 2,
            preload: true,
            category: null,
            loadBtn: false,
            mensagem: false,
            sectionCategory: true,
            sectionProducts: false,
            itens: any = [],
            lastObj: any = [],
            products: any = [],
            categorys: any = [],
        }
    },
    methods: {
        getCategory: function() {
            db.collection("category").get().then((querySnapshot) => {
                querySnapshot.forEach((item) => {
                    this.categorys.push(item.data())
                });
            })
        },
        getProducts: function(category) {

            this.products = [];
            this.category = category;
            this.sectionCategory = false;
            this.sectionProducts = true;

            db.collection("products")
                .where("category", "==", this.category)
                .limit(this.pageSizer)
                .get()
                .then((querySnapshot) => {
                    this.lastObj = querySnapshot.docs[querySnapshot.docs.length - 1];
                    querySnapshot.forEach((item) => {
                        data = Object.assign({ id: item.id }, item.data());
                        this.products.push(data)
                    });
                });
        },
        paginationLoad: function() {

            this.preload = true;
            setTimeout(() => { this.preload = false; }, 1000)
            try {
                db.collection("products")
                    .where("category", "==", this.category)
                    .startAfter(this.lastObj)
                    .limit(this.pageSizer)
                    .get()
                    .then((querySnapshot) => {
                        this.lastObj = querySnapshot.docs[querySnapshot.docs.length - 1];
                        querySnapshot.forEach((item) => {
                            data = Object.assign({ id: item.id }, item.data());
                            this.products.push(data)
                        });
                    });
            } catch (error) {
                this.preload = false;
                setTimeout((e) => {
                    this.mensagem = "Sem mais informações";
                    this.loadBtn = false;
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
        this.getCategory();
        this.preload = true
        setTimeout(() => {
            this.preload = false
            this.loadBtn = true
        }, 2000);
    }
});