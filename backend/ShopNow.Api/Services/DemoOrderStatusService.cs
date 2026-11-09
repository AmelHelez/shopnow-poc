using ShopNow.Api.Contracts;
using ShopNow.Api.Models;

namespace ShopNow.Api.Services;

public sealed class DemoOrderStatusService : IOrderStatusService
{
    private static readonly IReadOnlyDictionary<string, DemoOrder> Orders =
        new Dictionary<string, DemoOrder>(StringComparer.OrdinalIgnoreCase)
        {
            ["SN-12345"] = new("SN-12345", "4821", "SHIPPED", "2026-11-12", "Your parcel is on its way."),
            ["SN-67890"] = new("SN-67890", "1379", "PROCESSING", null, "Your order is being prepared."),
            ["SN-24680"] = new("SN-24680", "9054", "DELIVERED", "2026-11-05", "Your order was delivered.")
        };

    public OrderStatusResponse? FindVerifiedOrder(string orderId, string lastFourDigits)
    {
        if (!Orders.TryGetValue(orderId, out var order) || order.PhoneLast4 != lastFourDigits) return null;

        return new OrderStatusResponse(order.OrderId, order.Status, order.EstimatedDelivery, order.Message);
    }
}