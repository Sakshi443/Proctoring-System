// in login.js
const container = document.getElementById("container");
document.getElementById("goRegister").onclick = () =>
  container.classList.add("right-panel-active");
document.getElementById("goLogin").onclick = () =>
  container.classList.remove("right-panel-active");

// loader
async function loginUser(email, password) {
  document.getElementById("loader").style.display = "block";
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // success...
    console.log("Login successful:", userCredential.user);
    showMessage("Login successful!", "green");
  } catch (e) {
    alert("Login failed: " + e.message);
    showMessage(e.message);
  }
  document.getElementById("loader").style.display = "none";
}
// Show/Hide Password
function togglePassword() {
  const input = document.getElementById("regPassword");
  input.type = input.type === "password" ? "text" : "password";
}

// Add JS Utility Function
function showMessage(msg, color = "red") {
  const box = document.getElementById("messageBox");
  box.innerText = msg;
  box.style.color = color;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 5000); // auto-hide after 5 sec
}
