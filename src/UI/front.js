

const {remote} = require('electron')
const main = remote.require('./main')




const ProductForm = document.getElementById('main-form');
const ProductName = document.getElementById('text-name');
const ProductPrice = document.getElementById('text-price');
const ProductDesc = document.getElementById('text-desc');
const ProductList = document.getElementById('products');


let products = []
let EditingStatus = false;
let ProductEditing = null;


ProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProduct = {
        name: ProductName.value,
        price: ProductPrice.value,
        description: ProductDesc.value
    }
    if(!EditingStatus)
    {
        const result = await main.CreateProduct(newProduct);
    } else {
        const result = await main.UpdateProduct(ProductEditing, newProduct);
    }
    
    EditingStatus = false;
    ProductEditing = null;
    getProducts();
    ProductForm.reset();
})

async function deleteProduct(id, name)
{
    const response = confirm(`¿Quieres eliminar ${name} de la lista?`);
    if(response)
    {
        await main.deleteProduct(id);
        await getProducts();

    }
}

async function editProduct(id)
{
    const producto = await main.getProductById(id);
    ProductName.value = producto.name;
    ProductPrice.value = producto.price;
    ProductDesc.value = producto.description;
    EditingStatus = true;
    ProductEditing = id;
}

function ShowProducts(productos)
{
    ProductList.innerHTML = ''
    productos.forEach(product => {
        ProductList.innerHTML += `
        <div class="animate__animated animate__backInLeft">
            <div class="card card-body border-info my-2">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
                <p>
                    <button type="button" class="btn btn-danger" onclick="deleteProduct('${product.id}', '${product.name}')">
                        ELIMINAR
                    </button>
                    <button type="button" class="btn btn-success" onclick="editProduct('${product.id}')">
                        EDITAR
                    </button>
                </p>
            </div>
        </div>    
        `;
    });
}

const getProducts = async () => {
    products = await main.getProducts();
    ShowProducts(products);
}

async function init()
{
    await getProducts();
}

init();