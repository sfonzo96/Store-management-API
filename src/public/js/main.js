const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    await axios.post('/api/passport/logout').then((res) => {
      location.href = res.data.redirectURL;
    }); // OK pero ver por qué no funciona el redirect (desde server)
  });
}
