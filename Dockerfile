FROM node:22-alpine AS frontend-build
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY backend/ShopNow.Api/ShopNow.Api.csproj backend/ShopNow.Api/
RUN dotnet restore backend/ShopNow.Api/ShopNow.Api.csproj
COPY backend/ShopNow.Api/ backend/ShopNow.Api/
RUN dotnet publish backend/ShopNow.Api/ShopNow.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish ./
COPY --from=frontend-build /src/frontend/dist/ ./wwwroot/
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 10000
ENTRYPOINT ["dotnet", "ShopNow.Api.dll"]