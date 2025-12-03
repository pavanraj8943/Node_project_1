const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm").value.trim();
    const msg = document.getElementById("msg");

    if (password !== confirmPassword) {
      msg.style.color = "red";
      msg.innerText = "Passwords do not match!";
      return;
    }

    const payload = { username, email, password };

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const message = await response.text();
      msg.style.color = "green";
      msg.innerHTML = message;

      signupForm.reset();
    } catch (error) {
      msg.style.color = "red";
      msg.innerText = "Server Error!";
    }
  });
}
