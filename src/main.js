const {BrowserWindow, Notification} = require('electron')

const {getConnection} = require('./database')

let Form;


function NewWindow()
{
    Form = new BrowserWindow({
            width:800,
            height:600,
            webPreferences:{
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });  
    Form.loadFile('src/UI/index.html');
}

async function CreateProduct(producto)
{
    try
    {
        const conex = await getConnection();
        producto.price = parseFloat(producto.price);
        const result = await conex.query('INSERT INTO productos SET ?', producto);  
        new Notification({
            title:'Productos Electron',
            body: 'Se ha agregado un nuevo producto correctamente'
        }).show();

        
        producto.id = result.insertId;
        return producto;

    } catch(error) {
        console.log(error)
    }
    
}

async function getProductById(id)
{
    const conex = await getConnection();
    const result = await conex.query('SELECT * FROM productos WHERE id = ? LIMIT 1', id);
    return result[0];
}

async function UpdateProduct(id, producto)
{
    const conex = await getConnection();
    const result = await conex.query('UPDATE productos SET ? WHERE id = ?', [producto, id]);
}

async function deleteProduct(id)
{
    const conex = await getConnection();
    conex.query('DELETE FROM productos WHERE id = ?', id);
    new Notification({
        title:'Productos Electron',
        body: 'Se ha eliminado un producto correctamente'
    }).show();
}

async function getProducts()
{
    const conex = await getConnection();
    const result = await conex.query('SELECT * FROM productos ORDER BY id DESC');
    return result;
}

module.exports = {
    NewWindow,
    CreateProduct,
    getProducts,
    deleteProduct,
    getProductById,
    UpdateProduct
}