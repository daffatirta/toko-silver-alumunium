function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
  
    document.querySelectorAll(".tab")[0].classList.add("active");
    document.querySelectorAll(".tab")[1].classList.remove("active");
  }
  
  function showRegister() {
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
  
    document.querySelectorAll(".tab")[1].classList.add("active");
    document.querySelectorAll(".tab")[0].classList.remove("active");
  }
  
  // Simpan akun baru
  function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
  
    if (!username || !password) {
      alert("Username dan Password wajib diisi!");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    const exists = users.find(u => u.username === username);
  
    if (exists) {
      alert("Username sudah digunakan!");
      return;
    }
  
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Akun berhasil dibuat! Silakan login.");
  
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerPassword").value = "";
  
    showLogin();
  }
  
  // Login akun
  function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    if (!username || !password) {
      alert("Username dan Password wajib diisi!");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    const found = users.find(u => u.username === username && u.password === password);
  
    if (!found) {
      alert("Login gagal! Username atau Password salah.");
      return;
    }
  
    // Simpan user yang login
    localStorage.setItem("loggedInUser", username);
  
    alert("Login berhasil! Selamat bekerja ✨");
  
    window.location.href = "index.html";
  }
  