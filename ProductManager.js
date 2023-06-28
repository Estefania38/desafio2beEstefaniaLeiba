const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.loadProducts();
  }

  addProduct(newProduct) {
    const { title, description, price, thumbnail, code, stock } = newProduct;

    if (!title.trim() || !description.trim() || !price || !thumbnail.trim() || !code || !stock) {
      console.error("Error: todos los campos son obligatorios");
      return;
    }

    if (typeof price !== 'number' || price <= 0) {
      console.error("Error: el precio debe ser un número positivo");
      return;
    }

    if (typeof stock !== 'number' || stock <= 0 || !Number.isInteger(stock)) {
      console.error("Error: el stock debe ser un número entero positivo");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.error(`Error: el producto con el código ${code} ya existe`);
      return;
    }

    const newProductData = {
        id: this.getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      this.products.push(newProductData);
      this.saveProducts();
  
      console.log("Producto agregado con éxito. El nuevo producto es:", newProductData);
    }         

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Error: producto no encontrado");
    }
  }
 
  updateProduct(productId, updatedFields) {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
      console.log("Producto actualizado con éxito. El producto actualizado es:", this.products[index]);
      return true;
    }
    console.error("Error: producto no encontrado");
    return false;
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }

  loadProducts() {
    try {
      const fileContent = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      this.products = [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4));
      console.log("Productos guardados con éxito.");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  getNextId() {
    const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    return lastId > 0 ? lastId + 1 : 1;
  }
}

// Ejemplos de uso
const path = 'products.json';
const manager = new ProductManager(path);

// Agregar un producto
  const newProduct = {
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 15.99,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'DEF456',
    stock: 20
  };
  manager.addProduct(newProduct);

// Obtener todos los productos
const products = manager.getProducts();
console.log(products);

// Obtener producto por id
const productId = 1;
const product = manager.getProductById(productId);
console.log(product);

// Modificar un producto
const updatedFields = {
  title: 'Producto actualizado',
  description: 'Nueva descripción',
  price: 19.99,
  thumbnail: 'ruta/imagen1.jpg',
  code: 'ABc145',
  stock: 30
};
manager.updateProduct(productId, updatedFields);