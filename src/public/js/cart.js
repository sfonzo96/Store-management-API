const emtpyCartBtn = document.getElementById('emtpyCartBtn');
const removeProductBtns = document.querySelectorAll('.removeFromCartBtn');
const purchaseBtn = document.getElementById('purchaseBtn');

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
                }).then((res) => {
                    alert('Cart emptied!');
                    location.reload();
                });
            });
        });
    }

    if (removeProductBtns) {
        removeProductBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const productID = e.target.id.substring(
                    0,
                    e.target.id.indexOf('-')
                );
                axios({
                    method: 'GET',
                    url: '/api/carts/getCartID',
                }).then((res) => {
                    const cartID = res.data.cartID;
                    axios({
                        method: 'DELETE',
                        url: `/api/carts/${cartID}/product/${productID}`,
                    }).then((res) => {
                        alert(
                            'Product removed from cart.'
                            // TODO: botones + y - para modificar la cantidad.
                        );
                        location.reload();
                    });
                });
            });
        });
    }

    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            axios({
                method: 'GET',
                url: '/api/carts/getCartID',
            }).then((res) => {
                const cartID = res.data.cartID;
                axios({
                    method: 'POST',
                    url: `/api/carts/${cartID}/purchase`,
                }).then((res) => {
                    if (res.success === true) {
                        alert(res.message);
                        location.reload();
                    } else {
                        alert(res.message);
                    }
                });
            });
        });
    }
});
