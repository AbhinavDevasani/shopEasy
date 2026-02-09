
const API_URL = "https://shopeasy-7gqg.onrender.com";

async function test() {
    try {
        const res = await fetch(`${API_URL}/product/products`);
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data keys:", Object.keys(data));
        if (data.products) {
            console.log("Products count:", data.products.length);
            if (data.products.length > 0) {
                console.log("First product category:", data.products[0].category);
            }
        } else {
            console.log("No products key in data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
