handSubmit = async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    if (password !== confirm_password) {
        return alert("Passwords do not match!");
    }

    const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("msg").innerText = data.message;
        })
        .catch(err => console.log(err));
};
