const postProductForm = document.getElementById('postProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const changeRoleForm = document.getElementById('changeRoleForm');

postProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value;
    const status = document.getElementById('status').checked;

    axios({
        method: 'post',
        url: '/api/products',
        data: {
            title,
            description,
            price,
            stock,
            code,
            category,
            status,
        },
    })
        .then((res) => {
            e.target.reset();
        })
        .catch((err) => {
            console.log(err);
        });
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productID = document.getElementById('productIDDel').value;

    axios({
        method: 'delete',
        url: `/api/products/${productID}`,
    })
        .then((res) => {
            e.target.reset();
        })
        .catch((err) => {
            console.log(err);
        });
});

changeRoleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    axios({
        method: 'put',
        url: '/api/users/permission/change?userID=643872260be3940d2c3c6f74&toRole=premium',
    })
        .then((res) => {
            alert('Role changed successfully');
        })
        .catch((err) => {
            alert('Role change failed');
        });
});
