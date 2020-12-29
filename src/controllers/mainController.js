const fs = require('fs');
const path = require('path');

const pathProductsJSON = path.resolve(__dirname + '/../database/products.json');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res, next) => {
		const productsJSON = fs.readFileSync(pathProductsJSON, 'utf-8');
		const products = JSON.parse(productsJSON);

		const visitedProducts = products.filter(product => product.category == 'visited');
		const inSaleProducts = products.filter(product => product.category == 'in-sale');
		return res.render('index', {
			visitedProducts,
			inSaleProducts
		});
	}
};

module.exports = controller;
