import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../services/orderService';
import formatDate from '../../utils/formatDate';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import { useNavigate } from 'react-router-dom';
import { SkeletonOrderDetail } from '../../components';
import formatToRupiah from '../../utils/formatToRupiah';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isFetching } = useGetOrderByIdQuery(id || '');

    if (isFetching) {
        return <SkeletonOrderDetail />;
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold text-gray-500">Order not found</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <button className="btn btn-primary p-2 rounded-full" onClick={() => navigate(-1)}>
                        <IconArrowBackward className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Order Detail</h1>
                        <p className="text-sm text-gray-600">Details for order #{order.order_id}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5">
                <div className="panel">
                    <div className="mb-5">
                        <h5 className="font-semibold text-lg mb-4">Customer Information</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 mb-2">Name</p>
                                <p className="font-semibold">{order.order_user_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Email</p>
                                <p className="font-semibold">{order.order_email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Phone Number</p>
                                <p className="font-semibold">{order.order_phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Address</p>
                                <p className="font-semibold">{order.order_address}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Verification Status</p>
                                <span className={`badge ${order.order_user_verified ? 'badge-outline-primary' : 'badge-outline-danger'}`}>{order.order_user_verified ? 'Verified' : 'Unverified'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="mb-5">
                        <h5 className="font-semibold text-lg mb-4">Order Information</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 mb-2">Order ID</p>
                                <p className="font-semibold">{order.order_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Order Status</p>
                                <span className={`badge ${order.order_is_completed ? 'badge-outline-success' : 'badge-outline-warning'}`}>{order.order_is_completed ? 'Completed' : 'Pending'}</span>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Order Date</p>
                                <p className="font-semibold">{formatDate(order.order_created_date)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Last Updated</p>
                                <p className="font-semibold">{formatDate(order.order_updated_at)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Total Order</p>
                                <p className="font-semibold">{formatToRupiah(order.order_grand_total)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div>
                        <h5 className="font-semibold text-lg mb-4">Products</h5>
                        <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand</th>
                                        <th>Subcategory</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map((product) => (
                                        <tr key={product.product_id}>
                                            <td>
                                                <div className="font-semibold">{product.product_name}</div>
                                                <div className="text-gray-500 text-xs">SKU: {product.product_id}</div>
                                            </td>
                                            <td>
                                                <div className="font-semibold">{product.brand_name}</div>
                                            </td>
                                            <td>
                                                <div className="font-semibold">{product.product_subcategory_name}</div>
                                            </td>
                                            <td>{product.product_qty}</td>
                                            <td>{formatToRupiah(product.product_price)}</td>
                                            <td>{formatToRupiah(product.product_price * product.product_qty)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td colSpan={5} className="text-right font-semibold">
                                            Grand Total
                                        </td>
                                        <td className="font-semibold">{formatToRupiah(order.order_grand_total)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
