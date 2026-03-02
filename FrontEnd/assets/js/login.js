const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Identifiants incorrects");
    }

    const data = await response.json();

// Token
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userId", data.userId);

// Redirection accueil
    window.location.href = "index.html";

  } catch (error) {
    errorMessage.textContent = "Email ou mot de passe incorrect";
    errorMessage.style.color = "red";
  }
});

