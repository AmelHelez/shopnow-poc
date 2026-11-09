using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using ShopNow.Api.Contracts;
using ShopNow.Api.Services;

namespace ShopNow.Api.Controllers;

[ApiController]
[Route("api/demo")]
public sealed class OrderStatusController(IOrderStatusService orders) : ControllerBase
{
    [HttpPost("order-status")]
    [ProducesResponseType(typeof(OrderStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status503ServiceUnavailable)]
    public ActionResult<OrderStatusResponse> GetOrderStatus([FromBody] OrderLookupRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OrderId) ||
            !Regex.IsMatch(request.OrderId, @"^SN-\d{5}$", RegexOptions.IgnoreCase) ||
            string.IsNullOrWhiteSpace(request.PhoneLast4) ||
            !Regex.IsMatch(request.PhoneLast4, @"^\d{4}$"))
        {
            return BadRequest(new ApiError("invalid_input", "Enter an order ID (SN-12345) and four digits."));
        }

        if (request.OrderId.Equals("SN-99999", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(503, new ApiError("oms_unavailable", "The order system is temporarily unavailable."));
        }

        var result = orders.FindVerifiedOrder(request.OrderId, request.PhoneLast4);
        if (result is null)
        {
            return NotFound(new ApiError("not_found_or_unverified", "We couldn't verify this order with the provided details."));
        }

        return Ok(result);
    }
}