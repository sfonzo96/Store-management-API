<div class="accordion-item">
<h2 class="accordion-header" id="headingThree">
  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
    Update a product
  </button>
</h2>
<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
  <div class="accordion-body">
    <form id="updateProductForm">

      <div class="mb-6">
        <label for="productIDPut" class="form-label">Product ID</label>
        <input type="text" class="form-control" id="productIDPut" required="true">
        <div class="form-text">Selecciona uno de los de arriba.</div>
      </div>

      <div class="mb-6">
        <label for="titlePut" class="form-label">Title</label>
        <input type="text" class="form-control" id="titlePut">
        <div class="form-text">Preferentemente del formato: "Producto XX" siendo XX un número.</div>
      </div>

      <div class="mb-6">
        <label for="descriptionPut" class="form-label">Description</label>
        <input type="text" class="form-control" id="descriptionPut">
      </div>

      <div class="mb-6">
        <label class="form-label" for="pricePut">Price</label>
        <input type="number" class="form-control" id="pricePut">
      </div>

      <div class="mb-6">
        <label class="form-label" for="stockPut">Stock</label>
        <input type="number" class="form-control" id="stockPut">
      </div>
      <div class="mb-6">
        <label class="form-label" for="codePut">Code</label>
        <input type="text" class="form-control" id="codePut">
        <div class="form-text">Preferentemente del formato: "AAA0XX" siendo XX el número anterior.</div>
      </div>

      <div class="mb-6">
        <label class="form-label" for="categoryPut">Category</label>
        <input type="text" class="form-control" id="categoryPut">
        <div class="form-text">Preferentemente del formato: "tipoX" siendo X un número entre 1 y 5.</div>
      </div>

      <div class="mb-6 form-check">
        <label class="form-check-label" for="statusPut">Status</label>
        <input type="checkbox" class="form-check-input" id="statusPut">
      </div>

      <button type="submit" class="btn btn-primary">Update product</button>
    </form>
  </div>
</div>
</div>