const sendPasswordResetBtn = document.getElementById('sendPasswordResetBtn');

sendPasswordResetBtn.addEventListener('click', (e) => {
  e.preventDefault();

  axios({
    method: 'get',
    url: '/api/users/sendPwResetEmail',
  })
    .then((res) => {
      const success = res.data.success;

      if (success) {
        alert('Email sent with a 1h lasting link to reset your password');
      }
      setTimeout(() => {
        window.location.href = '/userCenter';
      }, 5000);
    })
    .catch((err) => {
      console.log(err);
    });
});
