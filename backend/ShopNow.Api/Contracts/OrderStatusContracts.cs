namespace ShopNow.Api.Contracts;

public sealed record OrderLookupRequest(string? OrderId, string? PhoneLast4);
public sealed record OrderStatusResponse(string OrderId, string Status, string? EstimatedDelivery, string Message);
public sealed record ApiError(string Code, string Message);