var app = new Vue({
    el: '#app', // instanciando o elemento de chamada do controller.
    data() {
        return {
            email: null, // instanciando a variável email.
            senha: null, // instanciando a variável senha.
            whatsapp: 'xxxxxxxxxxx', // telefone com whatsapp
        }
    },
    methods: {
        _authUser: function(e) {
            firebase.auth().signInWithEmailAndPassword(this.email, this.senha).then(data => {
                window.location.href = "/painel"
            }).catch((error) => {
                if (error.code == "auth/too-many-requests") {
                    M.toast({ html: ' muitas tentativas de login sem êxito. Por favor, tente novamente mais tarde.' });
                } else if (error.code == "auth/user-not-found") {
                    M.toast({ html: 'Não há registro de usuário correspondente a esse identificador. O usuário pode ter sido excluído.' });
                } else if (error.code == "auth/wrong-password") {
                    M.toast({ html: 'A senha é inválida ou o usuário não possui uma senha.' });
                }
            });
            e.preventDefault();
        },
  
    }
 });
 