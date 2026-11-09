using ShopNow.Api.Contracts;

namespace ShopNow.Api.Services;

public interface IOrderStatusService
{
    OrderStatusResponse? FindVerifiedOrder(string orderId, string lastFourDigits);
}