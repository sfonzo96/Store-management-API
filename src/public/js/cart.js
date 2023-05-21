const emtpyCartBtn = document.getElementById('emtpyCartBtn');
const removeProductBtns = document.querySelectorAll('.removeFromCartBtn');
const purchaseBtnCash = document.getElementById('purchaseBtnCash');
const purchaseBtnCard = document.getElementById('purchaseBtnCard');

document.addEventListener('DOMContentLoaded', () => {
  if (emtpyCartBtn) {
    emtpyCartBtn.addEventListener('click', () => {
      axios({
        method: 'GET',
        url: '/api/carts/getCartID',
      }).then((res) => {
        const cartID = res.data.cartID;
        axios({
          method: 'delete',
          url: `/api/carts/${cartID}`,
        })
          .then((res) => {
            alert('Cart emptied!');
            location.reload();
          })
          .catch((err) => {
            alert(err.message);
          });
      });
    });
  }

  if (removeProductBtns) {
    removeProductBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productID = e.target.id.substring(0, e.target.id.indexOf('-'));
        axios({
          method: 'GET',
          url: '/api/carts/getCartID',
        }).then((res) => {
          const cartID = res.data.cartID;
          axios({
            method: 'DELETE',
            url: `/api/carts/${cartID}/product/${productID}`,
          })
            .then((res) => {
              if (res.data.success === true) {
                Swal.fire({
                  text: `Removed successfully.`,
                  toast: true,
                  position: 'top-right',
                });
                location.reload();
              } else {
                Swal.fire({
                  text: `Failed to remove.`,
                  toast: true,
                  position: 'top-right',
                });
              }
            })
            .catch((err) => {
              alert(err.message);
            });
        });
      });
    });
  }

  if (purchaseBtnCash) {
    purchaseBtnCash.addEventListener('click', () => {
      axios({
        method: 'GET',
        url: '/api/carts/getCartID',
      }).then((res) => {
        const cartID = res.data.cartID;
        axios({
          method: 'POST',
          url: `/api/payments/${cartID}/purchase?method=cash`,
        })
          .then((res) => {
            if (res.data.success === true) {
              Swal.fire({
                text: `Purchase successful!`,
                toast: true,
                position: 'top-right',
              });
              location.reload();
            } else {
              Swal.fire({
                text: `Purchase failed!`,
                toast: true,
                position: 'top-right',
              });
            }
          })
          .catch((err) => {
            alert(err.message);
          });
      });
    });
  }

  if (purchaseBtnCard) {
    purchaseBtnCard.addEventListener('click', () => {
      axios({
        method: 'GET',
        url: '/api/carts/getCartID',
      }).then((res) => {
        const cartID = res.data.cartID;
        axios({
          method: 'POST',
          url: `/api/payments/${cartID}/purchase?method=card`,
        })
          .then((res) => {
            if (res.data.success === true) {
              Swal.fire({
                text: `Purchase successful!`,
                toast: true,
                position: 'top-right',
              });
              location.reload();
            } else {
              Swal.fire({
                text: `Purchase failed!`,
                toast: true,
                position: 'top-right',
              });
            }
          })
          .catch((err) => {
            alert(err.message);
          });
      });
    });
  }
});
