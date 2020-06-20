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


var app = new Vue({
    el: '#app',
    data() {
        return {
            title: null,
            description: null,
            category: null,
            stock: null,
            price: null,
            date_time: null,
            url_image: null,
            url_image_banner: null,
            promotion: null,
            discount: 0,
            activate: null,
        }
    },
    methods: {
        getProduct: function() {
            db.collection('products').doc(uid).get().then((querySnapshot) => {
                this.title = querySnapshot.data().title;
                this.description = querySnapshot.data().description;
                this.category = querySnapshot.data().category;
                this.stock = querySnapshot.data().stock;
                this.price = querySnapshot.data().price;
                this.date_time = querySnapshot.data().date_time;
                this.url_image = querySnapshot.data().url_image;
                this.url_image_banner = querySnapshot.data().url_image_banner;
                this.promotion = querySnapshot.data().promotion;
                this.discount = querySnapshot.data().discount;
                this.activate = querySnapshot.data().activate;

                setTimeout(() => {
                    $('#category').val(querySnapshot.data().category);
                    $('#category').formSelect();
                }, 200);
            });
        },

        finalize: function(event) {

            if (!action) {

                this.uploadImg(this.$refs.fileImgMain.files).then(snapshot => {
                    snapshot.ref.getDownloadURL().then(downloadURL => {
                        db.collection('products').add({
                            title: this.title,
                            description: this.description,
                            category: this.category,
                            stock: Number(this.stock),
                            price: parseFloat(this.price),
                            date_time_formatted: timestamp_formatted,
                            date_time: timestamp,
                            url_image: downloadURL,
                            url_image_banner: this.url_image_banner,
                            promotion: this.promotion,
                            discount: Number(this.discount),
                            activate: this.activate,
                        }).then((data) => {
                            this.uploadImg(this.$refs.fileImgBanner.files).then(snapshot => {
                                snapshot.ref.getDownloadURL().then(downloadURL => {
                                    db.collection('products').doc(data.id).update({
                                        url_image_banner: downloadURL,
                                    });
                                });
                            });
                        });
                    });

                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });
                });
            } else {

                if (this.$refs.fileImgMain.files['length'] > 0) {
                    this.uploadImg(this.$refs.fileImgMain.files).then(snapshot => {
                        snapshot.ref.getDownloadURL().then(downloadURL => {
                            db.collection('products').doc(uid).update({
                                title: this.title,
                                description: this.description,
                                category: this.category,
                                stock: Number(this.stock),
                                price: parseFloat(this.price),
                                date_time: this.date_time,
                                promotion: this.promotion,
                                discount: Number(this.discount),
                                activate: this.activate,
                                url_image: downloadURL,
                            });
                        });
                    });

                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });

                }
                if (this.$refs.fileImgBanner.files['length'] > 0) {
                    this.uploadImg(this.$refs.fileImgBanner.files).then(snapshot => {
                        snapshot.ref.getDownloadURL().then(downloadURL => {
                            db.collection('products').doc(uid).update({
                                title: this.title,
                                description: this.description,
                                category: this.category,
                                stock: Number(this.stock),
                                price: parseFloat(this.price),
                                date_time: this.date_time,
                                promotion: this.promotion,
                                discount: Number(this.discount),
                                activate: this.activate,
                                url_image_banner: downloadURL,
                            });
                        });
                    });

                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });
                } else {
                    db.collection('products').doc(uid).update({
                        title: this.title,
                        description: this.description,
                        category: this.category,
                        stock: Number(this.stock),
                        price: parseFloat(this.price),
                        date_time: this.date_time,
                        promotion: this.promotion,
                        discount: Number(this.discount),
                        activate: this.activate,
                    });

                    var toastHTML = '<span>Efetuada com sucesso</span>';
                    M.toast({ html: toastHTML, displayLength: 2000 });
                }
            }
            event.preventDefault();
        },
        uploadImg: function(file) {
            if (file['length'] > 0) {
                var storageRef = firebase.storage().ref('products/image/')
                var name = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                var metadata = {
                    contentType: file[0].type
                }
                var uploadTask = storageRef.child(name).put(file[0], metadata)
                return uploadTask
            } else {
                return [];
            }
        },
        getAllCategory: function() {
            db.collection("category").limit(100).get().then(function(documentSnapshots) {
                documentSnapshots.forEach(function(obj) {
                    $('#category').append($('<option>', {
                        value: obj.data().name,
                        text: obj.data().name
                    }));
                });
                $('#category').formSelect();
            });
        },
        getAll: function() {

            var dataSet = [];

            db.collection("products").limit(100).get().then(function(documentSnapshots) {
                documentSnapshots.forEach(function(item) {
                    dataSet.push([item.id, item.data().title, item.data().category, item.data().stock, item.data().price, item.data().activate])
                });

                dataSet.reverse()

                var table = $('#tableQuery').DataTable({
                    data: dataSet,
                    "order": [
                        [0, 'desc'],
                    ],
                    columns: [
                        { title: "chave" },
                        { title: "Titulo" },
                        { title: "categoria" },
                        { title: "estoque" },
                        { title: "Preços" },
                        { title: "status" },
                        { title: "action" },
                    ],
                    "columnDefs": [{
                        "targets": [0],
                        "visible": false
                    }, {
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<a class='icon-detail' href='javascript:void(0)' title='detalhes de produtos'><i class='material-icons'>border_color</i></a> <a class='icon-detail-del' href='javascript:void(0)' title = 'excluir produtos'><i class='material-icons'>delete</i></a >  "
                    }]
                });

                $('a.icon-detail').on('click', 'i', function() {
                    var data = table.row($(this).parents('tr')).data();
                    window.location.href = "?section=section-form&uid=" + data[0] + "&action=up"
                });


                $('a.icon-detail-del').on('click', 'i', function() {
                    if (confirm(" Deseja deletar este item ?")) {
                        var data = table.row($(this).parents('tr')).data();
                        db.collection('products').doc(data[0]).delete();
                        var toastHTML = '<span>Exclusão efetuada com sucesso!</span>';
                        M.toast({ html: toastHTML, displayLength: 2000 });
                        setInterval(() => { document.location.reload(true); }, 2000);
                    } else {
                        var toastHTML = '<span>Calma, O item foi mantido !</span>';
                        M.toast({ html: toastHTML, displayLength: 2000 });
                    }
                });
            });
        }
    },
    beforeMount() {
        this.getAll();

        if (uid) {
            this.getProduct();
        }
        this.getAllCategory();
    }
});