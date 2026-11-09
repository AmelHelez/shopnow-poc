# ShopNow Order Status PoC

A full-stack recruitment Proof of Concept for Infobip Solution Engineer Associate position.

**Status:** Demonstration only. No Infobip credentials, accounts, messaging provider, actual WhatsApp/Viber integration or production authentication are included.

## Architecture

```text
frontend/ (React 19, TypeScript, Vite)
    ├─ src/components/ChatPanel.tsx
    ├─ src/components/OrderLookupPanel.tsx
    ├─ src/data/demoOrders.ts
    ├─ src/services/orderApi.ts
    ├─ src/App.tsx
    └─ src/styles.css
backend/ShopNow.Api/ (.NET 10)
    ├─ Controllers/OrderStatusController.cs
    ├─ Controllers/HealthController.cs
    ├─ Contracts/OrderStatusContracts.cs
    ├─ Models/DemoOrder.cs
    ├─ Services/IOrderStatusService.cs
    ├─ Services/DemoOrderStatusService.cs
    └─ Program.cs
```

## Run locally (two terminals)

Prerequisites: Node.js 20+; .NET SDK 10.

Terminal 1:

```bash
cd backend/ShopNow.Api
dotnet run --urls http://localhost:5055
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. Vite automatically proxies `/api` requests to `http://localhost:5055`, so you do not need CORS configuration.

## Demo scenarios

| ID | Four test digits | Expected result |
| --- | --- | --- |
| `SN-12345` | `4821` | Shipped |
| `SN-67890` | `1379` | Processing |
| `SN-24680` | `9054` | Delivered |
| `SN-99999` | `0000` | Simulated OMS outage (503) |

For an unknown order or incorrect digits, the API returns 404 with a uniform error message. Invalid request format returns 400.

## API

`POST /api/demo/order-status`

```json
{
  "orderId": "SN-12345",
  "phoneLast4": "4821"
}
```

`GET /api/health`

## Single-origin production build (one Azure App Service)

```bash
cd frontend
npm install
npm run build
```

Copy the **contents** of `frontend/dist/` into `backend/ShopNow.Api/wwwroot/`. Example from the repository root:

```bash
rm -rf backend/ShopNow.Api/wwwroot/*
cp -R frontend/dist/. backend/ShopNow.Api/wwwroot/
dotnet publish backend/ShopNow.Api/ShopNow.Api.csproj -c Release -o publish
```

On Windows, use File Explorer or PowerShell `Copy-Item -Path frontend/dist/* -Destination backend/ShopNow.Api/wwwroot -Recurse -Force`.

Deploy the `publish/` output to an **Azure App Service (Windows)** using a supported .NET runtime and an **F1 Free** plan if available for your subscription and region. The Azure-provided `azurewebsites.net` hostname gives you one HTTPS URL for frontend and API. **No React dev server runs in production.**

Azure F1 has shared compute and daily CPU quotas, no always-on and no availability SLA. Check the pricing plan and any related resource costs in the portal before deployment. Do not enable paid monitoring, databases or premium services unintentionally.

## Production gaps and limitations

- The React frontend simulates the buyer conversation; there is **no Infobip Chatbots or Messages API connection**.
- The OMS is an in-memory dictionary with fictional orders.
- Four phone digits are only a **demo check**, not real authentication. A production solution must use identity verification, scoped tokens, order-level authorization and abuse controls.
- The response reflects demo data, not actual Shopify/OMS data.
- Human handoff, SMS notifications, Viber/WhatsApp onboarding and compliance controls are described in the assessment architecture, **not implemented in this PoC**.

## Interview explanation

This demo isolates the two business layers: a simulated conversational interface and a ShopNow Integration API. In production, Infobip Automation Studio - Chatbots would handle WhatsApp/Viber conversations; the securely authenticated ShopNow Integration API would read the OMS. Messages API would handle outbound notifications. The demo validates the customer flow, API shape, success response and failure behavior without overstating Infobip connectivity.