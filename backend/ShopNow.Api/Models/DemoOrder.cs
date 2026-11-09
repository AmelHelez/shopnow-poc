namespace ShopNow.Api.Models;

public sealed record DemoOrder(
    string OrderId,
    string PhoneLast4,
    string Status,
    string? EstimatedDelivery,
    string Message);