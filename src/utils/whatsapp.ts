export const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('62')) {
        return '+' + digits;
    }

    if (digits.startsWith('0')) {
        return '+62' + digits.substring(1);
    }

    return '+62' + digits;
};

export const createOrderMessage = (order: {
    order_id: string;
    order_fname: string;
    order_lname: string;
    products: Array<{
        product_qty: number;
        product_name: string;
    }>;
}) => {
    const fullName = `${order.order_fname} ${order.order_lname}`.trim();

    return `Halo Bpk/Ibu ${fullName},

Sebelumnya terimakasih telah checkout di Website Jaya Elektronik. Saya melihat bahwa Bpk/Ibu telah order beberapa barang berikut :

Order ID : #${order.order_id}
${order.products.map((product) => `${product.product_qty}x ${product.product_name}`).join('\n')}

Apakah ada yang bisa saya bantu ?`;
};
