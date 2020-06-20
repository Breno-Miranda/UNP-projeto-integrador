firebase.auth().onAuthStateChanged(user => {
    if (user) {
        localStorage.setItem('userid', user.uid);
    } else {
        window.location.href = "/auth";
    }
});

function signOut() {
    localStorage.clear();
    firebase.auth().signOut();
}