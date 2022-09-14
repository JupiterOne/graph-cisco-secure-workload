# Development

This integration uses the Cisco Secure Workload OpenAPI. You can find
documentation in the
[User Guides](https://www.cisco.com/c/en/us/support/security/tetration/products-installation-and-configuration-guides-list.html).
A Python client can also be found called
[tetpyclient](https://pypi.org/project/tetpyclient/).

## Provider account setup

1. Log in to Cisco Secure Workload and navigate to API Keys located under your
   profile in the top right.
2. Click the **Create API Key** button and select **Users, roles and scope
   management** **Flow, workload and inventory APIs** and **Applications and
   policy management**.
3. Supply the API Key and API Secret as the ENV variables (API_KEY and
   API_SECRET).
4. Supply the URI for Cisco Secure Workload as the ENV variable (API_URI).

## Authentication

Copy the `.env.example` file to `.env` file and fill in the values described
above. Mapping is as follows:

- API_KEY= ${`apiKey`}
- API_SECRET= ${`apiSecret`}
- API_URI= ${`apiURI`}
