#!/bin/bash
set -e

# Get deployment outputs
SEARCH_SERVICE_NAME=$(azd env get-values | grep SEARCH_SERVICE_NAME | cut -d= -f2)
OPENAI_SERVICE_NAME=$(azd env get-values | grep OPENAI_SERVICE_NAME | cut -d= -f2)
APPSERVICE_NAME=$(azd env get-values | grep APPSERVICE_NAME | cut -d= -f2)
RESOURCE_GROUP=$(azd env get-values | grep AZURE_RESOURCE_GROUP | cut -d= -f2)
ENABLE_NETWORK_SECURITY=$(azd env get-values | grep ENABLE_NETWORK_SECURITY | cut -d= -f2 || echo "false")
VNET_NAME=$(azd env get-values | grep VNET_NAME | cut -d= -f2 || echo "none")

echo "Azure resources successfully deployed!"
echo "Search Service: $SEARCH_SERVICE_NAME"
echo "OpenAI Service: $OPENAI_SERVICE_NAME"
echo "App Service: $APPSERVICE_NAME"
echo "Resource Group: $RESOURCE_GROUP"
echo "Network Security Enabled: $ENABLE_NETWORK_SECURITY"
if [ "$ENABLE_NETWORK_SECURITY" == "true" ]; then
  echo "Virtual Network: $VNET_NAME"
fi

# Print application URL
APPSERVICE_URL=$(az webapp show --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv)

echo ""
echo "Your BlazorAISearch application is available at: https://$APPSERVICE_URL"
echo ""
echo "==================================================================="
echo "NEXT STEPS"
echo "==================================================================="
echo "1. Navigate to your Azure AI Search resource in the Azure Portal to set up data indexing:"
echo "   https://portal.azure.com/#resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Search/searchServices/$SEARCH_SERVICE_NAME/overview"
echo ""
echo "2. Navigate to your Azure OpenAI resource to set up 'OpenAI on Your Data':"
echo "   https://portal.azure.com/#resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$OPENAI_SERVICE_NAME/overview"
echo ""
echo "3. Find sample documents to index in the /sample-docs directory"
echo ""
echo "==================================================================="
echo "MONITORING & MANAGEMENT"
echo "==================================================================="
echo "- View logs for this application in the Azure Portal"
echo "- Monitor your Azure OpenAI usage in the Azure Portal"
echo "- See your Azure AI Search indexes at:"
echo "  https://portal.azure.com/#resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Search/searchServices/$SEARCH_SERVICE_NAME/indexes"
echo ""
echo "==================================================================="
echo "DOCUMENTATION"
echo "==================================================================="
echo "For more information, refer to the following resources:"
echo "- Application README: README.md"
echo "- Azure OpenAI on Your Data: infra/AZURE_OPENAI_ON_YOUR_DATA.md"
echo "- Quick Start Guide: QUICKSTART.md"
if [ "$ENABLE_NETWORK_SECURITY" == "true" ]; then
  echo "- Network Security Configuration: infra/NETWORK_SECURITY.md"
  echo "- Security Overview: SECURITY_OVERVIEW.md"
  echo ""
  echo "==================================================================="
  echo "NETWORK SECURITY INFORMATION"
  echo "==================================================================="
  echo "Your deployment has enhanced network security with private endpoints enabled."
  echo "To access the services in your virtual network, you need to be connected to it."
  echo "Options include:"
  echo "1. Azure Bastion"
  echo "2. Point-to-Site VPN"
  echo "3. Site-to-Site VPN"
  echo "4. ExpressRoute"
  echo "5. Jumpbox VM within the VNet"
fi
echo ""
