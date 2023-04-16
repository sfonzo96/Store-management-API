import axios from 'axios';

const resetPasswordForm = document.getElementById('resetPasswordForm');

resetPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(resetPasswordForm);
  const password = formData.get('password').trim();
  const passwordConfirm = formData.get('passwordConfirm').trim();

  if (password !== passwordConfirm) {
    return alert('Passwords do not match');
  }

  axios({
    method: 'get',
    url: '/api/users/getCurrentUser',
  }).then((res) => {
    const currentUserEmail = res.data.user.email;

    axios({
      method: 'post',
      url: '/api/users/password/reset',
      data: {
        newPassword: password,
        email: currentUserEmail,
      },
    })
      .then((res) => {
        e.target.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
