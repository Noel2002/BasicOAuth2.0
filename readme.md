# Basic OAuth 2.0 Authorization Server
This project intends to create a basic authorization server that follows OAuth 2.0 protocol. The server provides authorization code flow.

### Exposed endpoints for OAuth 2.0 Authorization code flow

```GET /auth/authorize```

This endpoint allows client to authenticate the user. The user will be redirected to the authentication webpage/service from the authorization server where he/she will enter his/her credentials. On successful authentication, the server will redirect the user to the registered redirect url with the authrorization code appended as url parameters.

```POST /auth/token```

This endpoint allows the client's webserver to exchange the authorization code with an access token. This requires request will required Basic Autharization with client id and client secret as credentials. On successful request, the server's response will contain a jwt token.

```POST /users/userInfo```

This endpoint allow the client to request for user's profile using the access token received.


### Available Scopes

```transaction:transfer```

Transfer your wallet's funds from your account to another account

```balance:read```

View your wallet's current balance

```profile:read```

View your account's profile(name, email, profile picture)

### Demo
https://drive.google.com/file/d/1k9E6LiD9dDGePycmKKdiz-DlZEgUJKrt/view?usp=sharing

