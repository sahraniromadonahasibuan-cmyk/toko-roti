/* =========================================================
   AUTH.JS — Roti Kayu Manis
   Sistem login & daftar sederhana memakai localStorage.
   Cocok untuk demo/tugas. BUKAN pengamanan produksi:
   password disimpan apa adanya di browser, tanpa enkripsi.
   ========================================================= */

const RKM_USERS_KEY = "rkm_users";
const RKM_SESSION_KEY = "rkm_session";

/* Ambil semua akun terdaftar */
function rkmGetUsers() {
  try {
    const raw = localStorage.getItem(RKM_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/* Simpan daftar akun */
function rkmSaveUsers(users) {
  localStorage.setItem(RKM_USERS_KEY, JSON.stringify(users));
}

/* Daftar akun baru. Return {ok:true} atau {ok:false, message} */
function rkmRegister(nama, email, password) {
  const users = rkmGetUsers();
  const emailLower = email.trim().toLowerCase();

  if (users.some(u => u.email === emailLower)) {
    return { ok: false, message: "Email ini sudah terdaftar. Silakan masuk." };
  }

  users.push({ nama: nama.trim(), email: emailLower, password: password });
  rkmSaveUsers(users);
  return { ok: true };
}

/* Login. Return {ok:true} atau {ok:false, message} */
function rkmLogin(email, password) {
  const users = rkmGetUsers();
  const emailLower = email.trim().toLowerCase();
  const user = users.find(u => u.email === emailLower);

  if (!user) {
    return { ok: false, message: "Email belum terdaftar. Silakan daftar dulu." };
  }
  if (user.password !== password) {
    return { ok: false, message: "Kata sandi salah. Coba lagi." };
  }

  localStorage.setItem(RKM_SESSION_KEY, JSON.stringify({ nama: user.nama, email: user.email }));
  return { ok: true };
}

/* Ambil sesi yang sedang login, atau null */
function rkmGetSession() {
  try {
    const raw = localStorage.getItem(RKM_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* Logout */
function rkmLogout() {
  localStorage.removeItem(RKM_SESSION_KEY);
}

/* Lindungi halaman: panggil di halaman yang butuh login (misal dashboard) */
function rkmRequireLogin(redirectTo) {
  const session = rkmGetSession();
  if (!session) {
    window.location.href = redirectTo || "login.html";
  }
  return session;
}
